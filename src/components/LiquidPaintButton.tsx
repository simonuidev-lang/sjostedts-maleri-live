"use client";

/**
 * LiquidPaintButton — WebGL 2D Fluid Simulation (Navier-Stokes-inspired)
 *
 * Pipeline per frame:
 *   curl → vorticity confinement → divergence → pressure (Jacobi) →
 *   gradient subtract → advect velocity → advect dye → display
 *
 * Mouse/touch inject velocity + colour splats into the fluid field.
 * Passive edge splats pour paint in automatically on hover.
 * Graceful CSS fallback if WebGL2 is unavailable.
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";

/* ─── Simulation constants ──────────────────────────────────────────────────── */
const SIM_RESOLUTION        = 128;
const DYE_RESOLUTION        = 512;
const CURL                  = 30;
const PRESSURE_ITER         = 20;
const SPLAT_RADIUS          = 0.22;
const VELOCITY_DISSIPATION  = 0.98;
const DYE_DISSIPATION       = 0.99;

/* ─── Acrylic paint palette ─────────────────────────────────────────────────── */
const COLORS: [number, number, number][] = [
  [0.0,  0.85, 0.95],   // Cyan
  [0.95, 0.10, 0.75],   // Magenta
  [0.55, 0.05, 0.95],   // Purple
  [0.05, 0.20, 0.92],   // Deep Blue
  [0.95, 0.45, 0.05],   // Amber accent
];
function pickColor(idx: number): [number, number, number] {
  return COLORS[idx % COLORS.length];
}

/* ─── GLSL shaders ──────────────────────────────────────────────────────────── */
const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
void main(){
  vUv = aPosition*0.5+0.5;
  gl_Position = vec4(aPosition,0.0,1.0);
}`;

const COPY_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
in vec2 vUv; out vec4 fragColor;
void main(){ fragColor=texture(uTexture,vUv); }`;

const ADVECT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVelocity,uSource;
uniform vec2 uTexelSize;
uniform float uDt,uDissipation;
in vec2 vUv; out vec4 fragColor;
vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){
  vec4 st;
  st.xy=floor(uv*ts-0.5)+0.5;
  st.zw=st.xy+1.0;
  vec2 f=fract(uv*ts-0.5);
  st/=vec4(ts.x,ts.y,ts.x,ts.y);
  return mix(mix(texture(s,st.xy),texture(s,st.zy),f.x),
             mix(texture(s,st.xw),texture(s,st.zw),f.x),f.y);
}
void main(){
  vec2 vel=texture(uVelocity,vUv).xy;
  vec2 pos=vUv-uDt*vel*uTexelSize;
  fragColor=uDissipation*bilerp(uSource,pos,1.0/uTexelSize);
}`;

const DIV_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
in vec2 vUv; out vec4 fragColor;
void main(){
  float L=texture(uVelocity,vUv-vec2(uTexelSize.x,0)).x;
  float R=texture(uVelocity,vUv+vec2(uTexelSize.x,0)).x;
  float T=texture(uVelocity,vUv+vec2(0,uTexelSize.y)).y;
  float B=texture(uVelocity,vUv-vec2(0,uTexelSize.y)).y;
  fragColor=vec4(0.5*(R-L+T-B),0,0,1);
}`;

const PRESSURE_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uPressure,uDivergence;
uniform vec2 uTexelSize;
in vec2 vUv; out vec4 fragColor;
void main(){
  float L=texture(uPressure,vUv-vec2(uTexelSize.x,0)).x;
  float R=texture(uPressure,vUv+vec2(uTexelSize.x,0)).x;
  float T=texture(uPressure,vUv+vec2(0,uTexelSize.y)).x;
  float B=texture(uPressure,vUv-vec2(0,uTexelSize.y)).x;
  float div=texture(uDivergence,vUv).x;
  fragColor=vec4((L+R+T+B-div)*0.25,0,0,1);
}`;

const GRADIENT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uPressure,uVelocity;
uniform vec2 uTexelSize;
in vec2 vUv; out vec4 fragColor;
void main(){
  float pL=texture(uPressure,vUv-vec2(uTexelSize.x,0)).x;
  float pR=texture(uPressure,vUv+vec2(uTexelSize.x,0)).x;
  float pT=texture(uPressure,vUv+vec2(0,uTexelSize.y)).x;
  float pB=texture(uPressure,vUv-vec2(0,uTexelSize.y)).x;
  vec2 vel=texture(uVelocity,vUv).xy-vec2(pR-pL,pT-pB)*0.5;
  fragColor=vec4(vel,0,1);
}`;

const CURL_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
in vec2 vUv; out vec4 fragColor;
void main(){
  float L=texture(uVelocity,vUv-vec2(uTexelSize.x,0)).y;
  float R=texture(uVelocity,vUv+vec2(uTexelSize.x,0)).y;
  float T=texture(uVelocity,vUv+vec2(0,uTexelSize.y)).x;
  float B=texture(uVelocity,vUv-vec2(0,uTexelSize.y)).x;
  fragColor=vec4((R-L-T+B)*0.5,0,0,1);
}`;

const VORTICITY_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVelocity,uCurl;
uniform vec2 uTexelSize;
uniform float uCurlStr,uDt;
in vec2 vUv; out vec4 fragColor;
void main(){
  float L=texture(uCurl,vUv-vec2(uTexelSize.x,0)).x;
  float R=texture(uCurl,vUv+vec2(uTexelSize.x,0)).x;
  float T=texture(uCurl,vUv+vec2(0,uTexelSize.y)).x;
  float B=texture(uCurl,vUv-vec2(0,uTexelSize.y)).x;
  float C=texture(uCurl,vUv).x;
  vec2 force=vec2(abs(T)-abs(B),abs(R)-abs(L));
  force/=length(force)+0.0001;
  force*=uCurlStr*C;
  force.y*=-1.0;
  vec2 vel=texture(uVelocity,vUv).xy+force*uDt;
  fragColor=vec4(vel,0,1);
}`;

const SPLAT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius,uAspect;
in vec2 vUv; out vec4 fragColor;
void main(){
  vec2 p=vUv-uPoint;
  p.x*=uAspect;
  float g=exp(-dot(p,p)/uRadius);
  fragColor=vec4(texture(uTarget,vUv).rgb+g*uColor,1.0);
}`;

const DISPLAY_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uTexelSize;
in vec2 vUv; out vec4 fragColor;
void main(){
  float sh=uTexelSize.x*1.2;
  float r=texture(uTexture,vUv+vec2(sh,0)).r;
  float g=texture(uTexture,vUv).g;
  float b=texture(uTexture,vUv-vec2(sh,0)).b;
  vec3 c=vec3(r,g,b);
  c=c/(c+vec3(0.78));
  c=pow(c,vec3(0.82));
  fragColor=vec4(c,1.0);
}`;

/* ─── WebGL utilities ───────────────────────────────────────────────────────── */
function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
  return s;
}

function makeProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(p) ?? "link error");
  return {
    program: p,
    u: new Proxy({} as Record<string, WebGLUniformLocation>, {
      get: (_, name: string) => gl.getUniformLocation(p, name),
    }),
  };
}

function makeFBO(gl: WebGL2RenderingContext, w: number, h: number, iFmt: number, fmt: number, type: number, filter: number) {
  gl.activeTexture(gl.TEXTURE0);
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, iFmt, w, h, 0, fmt, type, null);
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return {
    tex, fb,
    attach(unit: number) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      return unit;
    },
  };
}

type FBO = ReturnType<typeof makeFBO>;

function makeDouble(gl: WebGL2RenderingContext, w: number, h: number, iF: number, f: number, t: number, filter: number) {
  let A = makeFBO(gl, w, h, iF, f, t, filter);
  let B = makeFBO(gl, w, h, iF, f, t, filter);
  return {
    get read(): FBO { return A; },
    get write(): FBO { return B; },
    swap() { const tmp = A; A = B; B = tmp; },
  };
}

type DFBO = ReturnType<typeof makeDouble>;

/* ─── Component ─────────────────────────────────────────────────────────────── */
interface LiquidPaintButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  id?: string;
}

export function LiquidPaintButton({
  href, children, className = "", style = {}, ariaLabel, id,
}: LiquidPaintButtonProps) {
  const anchorRef   = useRef<HTMLAnchorElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const [failed, setFailed]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoveredRef  = useRef(false);

  const splatQ  = useRef<{ x: number; y: number; dx: number; dy: number; col: [number,number,number] }[]>([]);
  const colorIdx = useRef(0);
  const lastPos  = useRef<{ x: number; y: number } | null>(null);
  const frameN   = useRef(0);

  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  /* ── Init simulation ── */
  useEffect(() => {
    const anchor = anchorRef.current;
    const canvas = canvasRef.current;
    if (!anchor || !canvas) return;

    const rect = anchor.getBoundingClientRect();
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const W    = Math.round(rect.width  * dpr) || 2;
    const H    = Math.round(rect.height * dpr) || 2;
    canvas.width  = W;
    canvas.height = H;

    /* Acquire WebGL2 */
    let gl: WebGL2RenderingContext;
    try {
      const ctx = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false });
      if (!ctx) throw new Error("no ctx");
      gl = ctx;
    } catch {
      setTimeout(() => setFailed(true), 0);
      return;
    }

    const extLinear = gl.getExtension("OES_texture_float_linear");
    const filt = extLinear ? gl.LINEAR : gl.NEAREST;
    gl.getExtension("EXT_color_buffer_float");

    /* Compile programs */
    let prog: {
      copy: ReturnType<typeof makeProgram>;
      advect: ReturnType<typeof makeProgram>;
      div: ReturnType<typeof makeProgram>;
      pressure: ReturnType<typeof makeProgram>;
      gradient: ReturnType<typeof makeProgram>;
      curl: ReturnType<typeof makeProgram>;
      vorticity: ReturnType<typeof makeProgram>;
      splat: ReturnType<typeof makeProgram>;
      display: ReturnType<typeof makeProgram>;
    };
    try {
      prog = {
        copy:      makeProgram(gl, VERT, COPY_FRAG),
        advect:    makeProgram(gl, VERT, ADVECT_FRAG),
        div:       makeProgram(gl, VERT, DIV_FRAG),
        pressure:  makeProgram(gl, VERT, PRESSURE_FRAG),
        gradient:  makeProgram(gl, VERT, GRADIENT_FRAG),
        curl:      makeProgram(gl, VERT, CURL_FRAG),
        vorticity: makeProgram(gl, VERT, VORTICITY_FRAG),
        splat:     makeProgram(gl, VERT, SPLAT_FRAG),
        display:   makeProgram(gl, VERT, DISPLAY_FRAG),
      };
    } catch {
      setTimeout(() => setFailed(true), 0);
      return;
    }

    /* Quad buffer */
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    function bq(p: WebGLProgram) {
      const loc = gl.getAttribLocation(p, "aPosition");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    /* FBO sizes */
    const simW = SIM_RESOLUTION;
    const simH = Math.max(1, Math.round(SIM_RESOLUTION * H / W));
    const dyeW = DYE_RESOLUTION;
    const dyeH = Math.max(1, Math.round(DYE_RESOLUTION * H / W));

    let velocity: DFBO, dye: DFBO, pressure: DFBO, divergence: FBO, curlFBO: FBO;
    try {
      velocity   = makeDouble(gl, simW, simH, gl.RG16F,   gl.RG,   gl.HALF_FLOAT, filt);
      dye        = makeDouble(gl, dyeW, dyeH, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, filt);
      pressure   = makeDouble(gl, simW, simH, gl.R16F,    gl.RED,  gl.HALF_FLOAT, gl.NEAREST);
      divergence = makeFBO(gl, simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
      curlFBO    = makeFBO(gl, simW, simH, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
    } catch {
      setTimeout(() => setFailed(true), 0);
      return;
    }

    /* ── Splat injection ── */
    function splat(x: number, y: number, dx: number, dy: number, col: [number,number,number]) {
      const sp = prog.splat;
      gl.useProgram(sp.program);
      bq(sp.program);
      const aspect = W / H;
      const r = SPLAT_RADIUS / 100;

      /* Velocity splat */
      gl.viewport(0, 0, simW, simH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fb);
      gl.uniform1i(sp.u.uTarget, velocity.read.attach(0));
      gl.uniform1f(sp.u.uAspect, aspect);
      gl.uniform2f(sp.u.uPoint, x, 1 - y);
      gl.uniform3f(sp.u.uColor, dx * 0.0002, -dy * 0.0002, 0);
      gl.uniform1f(sp.u.uRadius, r);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      velocity.swap();

      /* Dye splat */
      gl.viewport(0, 0, dyeW, dyeH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fb);
      gl.uniform1i(sp.u.uTarget, dye.read.attach(0));
      gl.uniform1f(sp.u.uAspect, aspect);
      gl.uniform2f(sp.u.uPoint, x, 1 - y);
      gl.uniform3f(sp.u.uColor, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
      gl.uniform1f(sp.u.uRadius, r * 1.5);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      dye.swap();
    }

    /* ── Main render loop ── */
    let lastT = performance.now();
    let alive = true;

    function step(now: number) {
      if (!alive) return;
      const dt = Math.min((now - lastT) / 1000, 0.016);
      lastT = now;
      frameN.current++;

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);

      /* Flush splat queue */
      for (const s of splatQ.current) splat(s.x, s.y, s.dx, s.dy, s.col);
      splatQ.current = [];

      /* Autonomous edge splats while hovered */
      if (hoveredRef.current && frameN.current % 8 === 0) {
        const side = Math.floor(Math.random() * 4);
        let ex = 0.5, ey = 0.5, edx = 0, edy = 0;
        switch (side) {
          case 0: ex = Math.random(); ey = 0.02; edx = (Math.random()-0.5)*400; edy =  300+Math.random()*200; break;
          case 1: ex = Math.random(); ey = 0.98; edx = (Math.random()-0.5)*400; edy = -(300+Math.random()*200); break;
          case 2: ex = 0.02; ey = Math.random(); edx =  300+Math.random()*200; edy = (Math.random()-0.5)*400; break;
          case 3: ex = 0.98; ey = Math.random(); edx = -(300+Math.random()*200); edy = (Math.random()-0.5)*400; break;
        }
        splat(ex, ey, edx, edy, pickColor(colorIdx.current++));
      }

      const sx = 1/simW, sy = 1/simH;
      const dx = 1/dyeW, dy = 1/dyeH;

      /* 1. Curl */
      { const p = prog.curl; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, curlFBO.fb);
        gl.uniform2f(p.u.uTexelSize,sx,sy); gl.uniform1i(p.u.uVelocity, velocity.read.attach(0));
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); }

      /* 2. Vorticity */
      { const p = prog.vorticity; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fb);
        gl.uniform2f(p.u.uTexelSize,sx,sy); gl.uniform1i(p.u.uVelocity, velocity.read.attach(0));
        gl.uniform1i(p.u.uCurl, curlFBO.attach(1)); gl.uniform1f(p.u.uCurlStr, CURL);
        gl.uniform1f(p.u.uDt, dt); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); velocity.swap(); }

      /* 3. Divergence */
      { const p = prog.div; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, divergence.fb);
        gl.uniform2f(p.u.uTexelSize,sx,sy); gl.uniform1i(p.u.uVelocity, velocity.read.attach(0));
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); }

      /* 4. Copy pressure (warm-start) */
      { const p = prog.copy; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fb);
        gl.uniform1i(p.u.uTexture, pressure.read.attach(0));
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); pressure.swap(); }

      /* 5. Jacobi pressure */
      { const p = prog.pressure; gl.useProgram(p.program); bq(p.program);
        gl.uniform2f(p.u.uTexelSize,sx,sy); gl.uniform1i(p.u.uDivergence, divergence.attach(1));
        for (let i=0;i<PRESSURE_ITER;i++) {
          gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fb);
          gl.uniform1i(p.u.uPressure, pressure.read.attach(0));
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4); pressure.swap();
        } }

      /* 6. Gradient subtract */
      { const p = prog.gradient; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fb);
        gl.uniform2f(p.u.uTexelSize,sx,sy);
        gl.uniform1i(p.u.uPressure, pressure.read.attach(0));
        gl.uniform1i(p.u.uVelocity, velocity.read.attach(1));
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); velocity.swap(); }

      /* 7. Advect velocity */
      { const p = prog.advect; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,simW,simH); gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fb);
        gl.uniform2f(p.u.uTexelSize,sx,sy);
        gl.uniform1i(p.u.uVelocity, velocity.read.attach(0));
        gl.uniform1i(p.u.uSource,   velocity.read.attach(0));
        gl.uniform1f(p.u.uDt, dt); gl.uniform1f(p.u.uDissipation, VELOCITY_DISSIPATION);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); velocity.swap(); }

      /* 8. Advect dye */
      { const p = prog.advect; gl.useProgram(p.program); bq(p.program);
        gl.viewport(0,0,dyeW,dyeH); gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fb);
        gl.uniform2f(p.u.uTexelSize,dx,dy);
        gl.uniform1i(p.u.uVelocity, velocity.read.attach(0));
        gl.uniform1i(p.u.uSource,   dye.read.attach(1));
        gl.uniform1f(p.u.uDt, dt); gl.uniform1f(p.u.uDissipation, DYE_DISSIPATION);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); dye.swap(); }

      /* 9. Display */
      { const p = prog.display; gl.useProgram(p.program); bq(p.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0,0,W,H);
        gl.uniform1i(p.u.uTexture, dye.read.attach(0));
        gl.uniform2f(p.u.uTexelSize, 1/W, 1/H);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4); }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Pointer helpers ── */
  const inject = useCallback((clientX: number, clientY: number) => {
    const a = anchorRef.current;
    if (!a) return;
    const rect = a.getBoundingClientRect();
    const x = (clientX - rect.left)  / rect.width;
    const y = (clientY - rect.top)   / rect.height;
    const prev = lastPos.current;
    const ddx = prev ? (clientX - prev.x) * 7 : 0;
    const ddy = prev ? (clientY - prev.y) * 7 : 0;
    lastPos.current = { x: clientX, y: clientY };
    splatQ.current.push({ x, y, dx: ddx, dy: ddy, col: pickColor(colorIdx.current++) });
  }, []);

  const onMM  = useCallback((e: React.MouseEvent)  => inject(e.clientX, e.clientY), [inject]);
  const onTM  = useCallback((e: React.TouchEvent)  => { e.preventDefault(); inject(e.touches[0].clientX, e.touches[0].clientY); }, [inject]);
  const onIn  = useCallback(() => setHovered(true),  []);
  const onOut = useCallback(() => { setHovered(false); lastPos.current = null; }, []);

  /* ── CSS fallback ── */
  if (failed) {
    return (
      <a id={id} href={href} aria-label={ariaLabel}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}
        style={{ background:"rgba(0,0,0,0.05)", border:"1px solid rgba(0,0,0,0.1)", color:"rgba(0,0,0,0.78)", boxShadow:"inset 0 3px 10px rgba(0,0,0,0.12)", letterSpacing:"0.16em", ...style }}>
        <span aria-hidden="true" className="absolute inset-0 translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out"
          style={{ background:"linear-gradient(135deg,#00d4ff,#a855f7,#ec4899,#2563eb)", borderRadius:"inherit" }} />
        <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-500 group-hover:text-white group-active:text-white">{children}</span>
      </a>
    );
  }

  return (
    <a
      id={id}
      ref={anchorRef}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMM}
      onMouseEnter={onIn}
      onMouseLeave={onOut}
      onTouchMove={onTM}
      onTouchStart={(e) => { setHovered(true); inject(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={onOut}
      className={`relative inline-flex items-center justify-center overflow-hidden select-none active:scale-95 ${className}`}
      style={{
        borderRadius: "9999px",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "inset 0 3px 10px rgba(0,0,0,0.12), inset 0 1px 4px rgba(0,0,0,0.09)",
        background: "rgba(0,0,0,0.04)",
        transition: "transform 0.2s ease",
        cursor: "pointer",
        textDecoration: "none",
        ...style,
      }}
    >
      {/* WebGL simulation canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.55s ease",
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />

      {/* Text layer — mix-blend-mode: difference keeps it legible over any paint */}
      <span
        style={{
          position: "relative",
          zIndex: 10,
          mixBlendMode: hovered ? "difference" : "normal",
          color: hovered ? "white" : "rgba(0,0,0,0.78)",
          transition: "color 0.35s ease",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        {children}
      </span>
    </a>
  );
}

export default LiquidPaintButton;
