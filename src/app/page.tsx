"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─── Brand Tokens ─────────────────────────────────────────────────────────── */
const CREAM = "#F4F0EA";
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Reusable viewport props ───────────────────────────────────────────────── */
const VP = { once: true, margin: "-100px" } as const;

/* ─── Services data ─────────────────────────────────────────────────────────── */
const services = [
  {
    title: "Exklusiv Interiör",
    tagline: "PRIVATA HEM & VILLOR",
    punchline: "Varje rum behandlas som ett galleri — absolut planhet, perfektion i varje penseldrag.",
    fromX: -100,
  },
  {
    title: "Fasad & Exteriörskydd",
    tagline: "KLIMATSKYDD FÖR NORDISK NATUR",
    punchline: "Premiumberhandlingar som förseglar din fastighet i generationer framöver.",
    fromX: 0,
  },
  {
    title: "Kommersiella Lokaler",
    tagline: "KONTOR, BRF & NYPRODUKTION",
    punchline: "Industriell disciplin möter hantverksstolthet — levererat i tid, utan kompromisser.",
    fromX: 100,
  },
];

/* ─── Process steps ─────────────────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Skyddsmantling",
    desc: "Museifokus på total täckning.",
    numFrom: -80,
    textFrom: 80,
  },
  {
    num: "02",
    title: "Underarbete",
    desc: "Kirurgisk slipning till absolut planhet.",
    numFrom: 80,
    textFrom: -80,
  },
  {
    num: "03",
    title: "Finish",
    desc: "Dubbla strykningar med industriell disciplin.",
    numFrom: -80,
    textFrom: 80,
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: CREAM, fontFamily: "var(--font-inter, sans-serif)" }}
    >
      {/* ──────────────────────────────────────────────────────────────────────
          1. THE HOVERING NAV
      ────────────────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: "rgba(244,240,234,0.9)",
          boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="max-w-screen-xl mx-auto px-6 md:px-16 h-20 flex items-center justify-between"
        >
          {/* Logo */}
          <img
            src="/logga.png"
            alt="Sjöstedts Måleri"
            className="h-12 md:h-14 w-auto object-contain select-none"
          />

          {/* CTA pill */}
          <motion.a
            href="#offert"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
            whileHover={{ scale: 1.06, boxShadow: "0 16px 48px rgba(0,0,0,0.28)" }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-black text-white px-7 py-3 text-xs font-semibold uppercase cursor-pointer select-none transition-all duration-300"
            style={{ letterSpacing: "0.18em", boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}
          >
            Boka Offert
          </motion.a>
        </div>
      </motion.nav>

      <main className="overflow-hidden">
        {/* ────────────────────────────────────────────────────────────────────
            2. HERO — Clean image frame, NO floating badge
        ──────────────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative flex items-center pt-20"
          style={{ overflow: "hidden", minHeight: "92vh" }}
        >
          {/* Warm radial wash */}
          <motion.div
            style={{ y: heroBgY }}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 65% 70% at 80% 50%, rgba(255,255,255,0.7) 0%, transparent 70%)`,
              }}
            />
          </motion.div>

          <div className="max-w-screen-xl mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 lg:py-20">
            {/* LEFT — Headline */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, ease }}
              className="flex flex-col items-start"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.1 }}
                className="font-serif leading-none tracking-tight mb-8"
                style={{ fontSize: "clamp(3.4rem, 7.5vw, 7.5rem)", fontWeight: 700 }}
              >
                Nymålad
                <br />
                <span style={{ fontStyle: "italic", fontWeight: 400 }}>perfektion.</span>
                <br />
                <span
                  className="font-serif"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 4.5rem)", fontWeight: 300, opacity: 0.55, fontStyle: "normal" }}
                >
                  Utan kompromisser.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.25 }}
                className="text-base md:text-lg font-light tracking-wide mb-10 max-w-md"
                style={{ color: "rgba(0,0,0,0.58)", lineHeight: 1.8 }}
              >
                Zero‑kompromiss hantverk. Kirurgisk preparation. Perfektion i varje penseldrag.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href="#offert"
                  className="rounded-full bg-black text-white px-9 py-4 text-sm font-semibold uppercase transition-all duration-300 hover:-translate-y-1 active:scale-95"
                  style={{
                    letterSpacing: "0.16em",
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 40px 80px -15px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 30px 60px -15px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.2)";
                  }}
                >
                  Boka Offert
                </a>

                <a
                  href="#expertis"
                  className="rounded-full px-9 py-4 text-sm font-semibold uppercase transition-all duration-300 hover:-translate-y-1 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    color: "rgba(0,0,0,0.82)",
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
                    letterSpacing: "0.16em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.92)";
                  }}
                >
                  Vår Expertis
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT — Massive clean image frame, ZERO badge */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease, delay: 0.1 }}
              className="relative w-full"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute inset-0 rounded-[3rem] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow:
                    "0 60px 120px -20px rgba(0,0,0,0.22), 0 20px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Grid texture overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                  aria-hidden="true"
                />

                {/* Centered slot label — clean, minimal */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-px" style={{ background: "rgba(0,0,0,0.18)" }} />
                  <span
                    className="text-[10px] tracking-[0.36em] font-mono font-medium uppercase"
                    style={{ color: "rgba(0,0,0,0.28)" }}
                  >
                    Signaturbild · Premiumprojekt
                  </span>
                  <div className="w-10 h-px" style={{ background: "rgba(0,0,0,0.18)" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            TRUST STRIP
        ──────────────────────────────────────────────────────────────────── */}
        <section
          className="w-full"
          style={{
            background: "rgba(255,255,255,0.55)",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <div className="max-w-screen-xl mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { num: "01", heading: "Certifierade Mästare", body: "Handplockade målare med gesällbrev och mästarexamen." },
                { num: "02", heading: "100% Nöjd-Kund", body: "Slutbesiktning och garanti ingår på varje uppdrag." },
                { num: "03", heading: "Transparent Fastpris", body: "Bindande offerter utan dolda kostnader." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.9, ease, delay: idx * 0.12 }}
                  className="py-12 px-6 md:px-10 flex flex-col gap-4"
                  style={{
                    borderRight: idx < 2 ? "1px solid rgba(0,0,0,0.07)" : undefined,
                  }}
                >
                  <span className="text-xs tracking-[0.24em] font-mono" style={{ color: "rgba(0,0,0,0.35)" }}>
                    {item.num}
                  </span>
                  <h3 className="text-sm tracking-[0.14em] font-semibold uppercase">{item.heading}</h3>
                  <p className="font-serif text-lg" style={{ color: "rgba(0,0,0,0.62)", lineHeight: 1.65 }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            CINEMATIC FÖRE / EFTER — Asymmetric Masonry Showcase
        ──────────────────────────────────────────────────────────────────── */}
        <section className="max-w-screen-xl mx-auto px-6 md:px-16 py-28">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1, ease }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.32em] font-semibold uppercase mb-5" style={{ color: "rgba(0,0,0,0.38)" }}>
              Transformationer
            </p>
            <h2
              className="font-serif leading-none tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 6rem)", fontWeight: 700 }}
            >
              Före{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>/</span>{" "}
              Efter.
            </h2>
          </motion.div>

          {/* Masonry grid: 3-column asymmetric layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr_1fr] gap-5 md:gap-6 items-stretch">

            {/* LEFT — Team/truck arrival shot */}
            <motion.div
              initial={{ opacity: 0, x: -80, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={VP}
              transition={{ duration: 1.4, ease }}
              className="flex flex-col gap-3"
            >
              <div
                className="relative rounded-[2rem] overflow-hidden flex-1"
                style={{
                  minHeight: "520px",
                  background: CREAM,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.18), 0 12px 40px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Grid texture */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                  <span className="text-[9px] tracking-[0.38em] font-mono uppercase" style={{ color: "rgba(0,0,0,0.24)" }}>
                    Team · Ankomst
                  </span>
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                </div>
              </div>
              {/* Architectural label */}
              <p className="text-[9px] tracking-[0.32em] font-mono uppercase px-1" style={{ color: "rgba(0,0,0,0.28)" }}>
                PROJEKT: VILLA / RESIDENS
              </p>
            </motion.div>

            {/* CENTER — Side-by-side Before / After split grid */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 1.5, ease, delay: 0.08 }}
              className="flex flex-col gap-5"
            >
              {/* FÖRE box */}
              <div
                className="relative rounded-[2rem] overflow-hidden"
                style={{
                  minHeight: "240px",
                  background: CREAM,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 30px 70px -15px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)
                    `,
                    backgroundSize: "28px 28px",
                  }}
                  aria-hidden="true"
                />
                {/* FÖRE pill */}
                <div className="absolute top-6 left-6">
                  <span
                    className="inline-block px-4 py-2 rounded-full text-[9px] font-semibold uppercase tracking-[0.28em]"
                    style={{ background: "rgba(0,0,0,0.07)", color: "rgba(0,0,0,0.5)" }}
                  >
                    Före
                  </span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.14)" }} />
                  <span className="text-[9px] tracking-[0.36em] font-mono uppercase" style={{ color: "rgba(0,0,0,0.22)" }}>
                    Råjämförelse
                  </span>
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.14)" }} />
                </div>
              </div>

              {/* EFTER box */}
              <div
                className="relative rounded-[2rem] overflow-hidden"
                style={{
                  minHeight: "268px",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.17), 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "28px 28px",
                  }}
                  aria-hidden="true"
                />
                {/* EFTER pill */}
                <div className="absolute top-6 left-6">
                  <span
                    className="inline-block px-4 py-2 rounded-full text-[9px] font-semibold uppercase tracking-[0.28em]"
                    style={{ background: "black", color: "rgba(255,255,255,0.9)" }}
                  >
                    Efter
                  </span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                  <span className="text-[9px] tracking-[0.36em] font-mono uppercase" style={{ color: "rgba(0,0,0,0.24)" }}>
                    Masterfinish
                  </span>
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                </div>
              </div>

              <p className="text-[9px] tracking-[0.32em] font-mono uppercase px-1" style={{ color: "rgba(0,0,0,0.28)" }}>
                PROJEKT: LÄGENHET / BRF
              </p>
            </motion.div>

            {/* RIGHT — Full-height luxury finish close-up */}
            <motion.div
              initial={{ opacity: 0, x: 80, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={VP}
              transition={{ duration: 1.4, ease, delay: 0.16 }}
              className="flex flex-col gap-3"
            >
              <div
                className="relative rounded-[2rem] overflow-hidden flex-1"
                style={{
                  minHeight: "520px",
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 50px 100px -20px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.032) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.032) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                  <span className="text-[9px] tracking-[0.38em] font-mono uppercase" style={{ color: "rgba(0,0,0,0.24)" }}>
                    Lyxfinish · Detalj
                  </span>
                  <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.16)" }} />
                </div>

                {/* Floating result chip */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 1, ease, delay: 0.6 }}
                  className="absolute bottom-7 left-5 right-5"
                >
                  <div
                    className="rounded-xl px-5 py-4"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <p className="text-[9px] tracking-[0.26em] font-semibold uppercase mb-1" style={{ color: "rgba(0,0,0,0.38)" }}>
                      Mästarresultat
                    </p>
                    <p className="text-sm font-serif" style={{ color: "rgba(0,0,0,0.75)" }}>
                      Strukturell perfektion
                    </p>
                  </div>
                </motion.div>
              </div>
              <p className="text-[9px] tracking-[0.32em] font-mono uppercase px-1" style={{ color: "rgba(0,0,0,0.28)" }}>
                PROJEKT: KOMMERSIELL / BUTIK
              </p>
            </motion.div>

          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            3. EXPERTISE GRID — Large image showcase + 1-sentence tagline
        ──────────────────────────────────────────────────────────────────── */}
        <section id="expertis" className="max-w-screen-xl mx-auto px-6 md:px-16 py-24">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1, ease }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.28em] font-semibold uppercase mb-6" style={{ color: "rgba(0,0,0,0.4)" }}>
              Tjänster
            </p>
            <h2
              className="font-serif leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 6.5vw, 7rem)", fontWeight: 700 }}
            >
              Vår Expertis.
            </h2>
          </motion.div>

          {/* 3-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const initial =
                idx === 0
                  ? { opacity: 0, x: -100 }
                  : idx === 1
                  ? { opacity: 0, y: 150 }
                  : { opacity: 0, x: 100 };

              return (
                <motion.div
                  key={idx}
                  initial={initial}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 1.3, ease, delay: idx * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col rounded-[2.5rem] overflow-hidden cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    boxShadow:
                      "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 32px 80px -15px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)";
                  }}
                >
                  {/* Large dedicated image placeholder — h-64 */}
                  <div
                    className="w-full relative bg-white/40 rounded-t-[2.5rem] border-b border-black/5"
                    style={{ height: "16rem" }}
                  >
                    <div
                      className="absolute inset-0 rounded-t-[2.5rem]"
                      style={{
                        background: CREAM,
                        backgroundImage: `
                          linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.14)" }} />
                      <span
                        className="text-[9px] tracking-[0.32em] font-mono uppercase"
                        style={{ color: "rgba(0,0,0,0.22)" }}
                      >
                        Projektbild
                      </span>
                      <div className="w-8 h-px" style={{ background: "rgba(0,0,0,0.14)" }} />
                    </div>
                  </div>

                  {/* Card content — tight, punchy */}
                  <div className="px-10 py-8 flex flex-col gap-3 flex-1">
                    <p
                      className="text-[10px] tracking-[0.3em] font-semibold uppercase"
                      style={{ color: "rgba(0,0,0,0.38)" }}
                    >
                      {svc.tagline}
                    </p>
                    <h3
                      className="font-serif"
                      style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.2rem)", fontWeight: 600, lineHeight: 1.15 }}
                    >
                      {svc.title}
                    </h3>
                    {/* ONE sentence punchline only */}
                    <p
                      className="font-sans font-light leading-relaxed"
                      style={{ color: "rgba(0,0,0,0.62)", fontSize: "0.94rem" }}
                    >
                      {svc.punchline}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            4. ULTRA-MINIMAL PROCESS TIMELINE — Giant watermarks, 1-line desc
        ──────────────────────────────────────────────────────────────────── */}
        <section
          id="process"
          className="w-full py-32"
          style={{ background: "rgba(255,255,255,0.45)" }}
        >
          <div className="max-w-screen-xl mx-auto px-6 md:px-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 1, ease }}
              className="mb-36"
            >
              <p className="text-xs tracking-[0.28em] font-semibold uppercase mb-6" style={{ color: "rgba(0,0,0,0.4)" }}>
                Metodiken
              </p>
              <h2
                className="font-serif leading-none tracking-tight"
                style={{ fontSize: "clamp(3rem, 6.5vw, 7rem)", fontWeight: 700 }}
              >
                Processen.
              </h2>
            </motion.div>

            {/* Steps */}
            <div className="flex flex-col gap-44">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Giant background watermark number */}
                  <motion.div
                    initial={{ opacity: 0, x: step.numFrom }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VP}
                    transition={{ duration: 1.4, ease }}
                    className="absolute -top-12 -left-6 md:-left-12 select-none pointer-events-none leading-none font-serif font-bold"
                    aria-hidden="true"
                    style={{
                      fontSize: "clamp(10rem, 20vw, 20rem)",
                      color: "rgba(0,0,0,0.028)",
                      zIndex: 0,
                      lineHeight: 0.85,
                    }}
                  >
                    {step.num}
                  </motion.div>

                  {/* Text block — ultra minimal */}
                  <motion.div
                    initial={{ opacity: 0, x: step.textFrom }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VP}
                    transition={{ duration: 1.2, ease, delay: 0.1 }}
                    className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-24 items-start md:items-center"
                    style={{ paddingLeft: "clamp(0rem, 8vw, 7rem)" }}
                  >
                    <div className="flex-shrink-0">
                      <span
                        className="text-xs tracking-[0.3em] font-mono font-medium"
                        style={{ color: "rgba(0,0,0,0.3)" }}
                      >
                        {step.num} / 03
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3
                        className="font-serif leading-tight"
                        style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", fontWeight: 600 }}
                      >
                        {step.title}
                      </h3>
                      {/* One single line — razor sharp */}
                      <p
                        className="font-sans font-light text-base tracking-wide"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        — {step.desc}
                      </p>
                    </div>

                    {/* Decorative extending line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={VP}
                      transition={{ duration: 1.2, ease, delay: 0.3 }}
                      className="hidden md:block flex-1 h-px origin-left"
                      style={{ background: "rgba(0,0,0,0.1)" }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            5. THE VAULT — Blackout Conversion Form
        ──────────────────────────────────────────────────────────────────── */}
        <section
          id="offert"
          className="py-24 px-4 md:px-8"
          style={{ background: "transparent" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 1.4, ease }}
            className="relative mx-auto overflow-hidden"
            style={{
              background: "black",
              color: "white",
              borderRadius: "3.5rem",
              padding: "clamp(3rem, 8vw, 6rem)",
              maxWidth: "1200px",
              boxShadow:
                "0 60px 120px -20px rgba(0,0,0,0.45), 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Top-left glow */}
            <div
              className="absolute pointer-events-none"
              aria-hidden="true"
              style={{
                top: 0,
                left: 0,
                width: "50%",
                height: "50%",
                background:
                  "radial-gradient(ellipse 60% 60% at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left — Copy */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ duration: 0.9, ease }}
                  className="text-xs tracking-[0.28em] font-semibold uppercase mb-8"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Kostnadsfri Offert
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VP}
                  transition={{ duration: 1.1, ease, delay: 0.1 }}
                  className="font-serif leading-none tracking-tight mb-10"
                  style={{ fontSize: "clamp(3rem, 5.5vw, 5.5rem)", fontWeight: 700 }}
                >
                  Dags för
                  <br />
                  <span style={{ fontStyle: "italic", fontWeight: 400 }}>förändring?</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VP}
                  transition={{ duration: 1, ease, delay: 0.2 }}
                  className="font-sans font-light text-lg leading-relaxed mb-12"
                  style={{ color: "rgba(255,255,255,0.6)", maxWidth: "380px" }}
                >
                  Jonas återkommer personligen med en bindande fastprisoffert inom 24 timmar. Inga dolda avgifter.
                </motion.p>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VP}
                  transition={{ duration: 1, ease, delay: 0.35 }}
                  className="flex flex-col gap-3"
                >
                  {[
                    "Bindande fastprisoffert",
                    "Certifierat målarmästeri",
                    "100% nöjd-kund-garanti",
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-sm tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {badge}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Form */}
              <motion.form
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
                className="flex flex-col gap-10"
                onSubmit={(e) => e.preventDefault()}
              >
                {[
                  { type: "text", placeholder: "Ditt Namn", id: "form-name" },
                  { type: "email", placeholder: "E-postadress", id: "form-email" },
                  { type: "tel", placeholder: "Telefonnummer", id: "form-phone" },
                ].map((field) => (
                  <div key={field.id} className="relative group">
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent py-5 text-white text-lg font-light tracking-wide placeholder-white/30 focus:outline-none transition-colors peer"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.18)",
                        fontFamily: "var(--font-inter, sans-serif)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.7)")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.18)")}
                    />
                  </div>
                ))}

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    id="form-project"
                    placeholder="Berätta om ditt projekt..."
                    rows={3}
                    className="w-full bg-transparent py-5 text-white text-lg font-light tracking-wide placeholder-white/30 focus:outline-none transition-colors resize-none"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.18)",
                      fontFamily: "var(--font-inter, sans-serif)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.7)")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.18)")}
                  />
                </div>

                {/* Submit CTA */}
                <div className="flex flex-col gap-5 mt-4">
                  <motion.button
                    type="submit"
                    id="form-submit"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-full bg-white text-black font-semibold text-sm uppercase tracking-[0.2em] py-6 transition-all duration-300"
                    style={{
                      boxShadow: "0 20px 60px -10px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    Skicka Förfrågan
                  </motion.button>
                  <p
                    className="text-center text-xs tracking-wide"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    * Alla offerter är kostnadsfria och bindande — 100% nöjd-kund-garanti ingår alltid.
                  </p>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            FOOTER
        ──────────────────────────────────────────────────────────────────── */}
        <footer
          className="w-full py-16 px-6 md:px-16"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <img
              src="/logga.png"
              alt="Sjöstedts Måleri"
              className="h-10 w-auto object-contain opacity-60"
            />
            <p
              className="text-xs tracking-[0.18em] font-sans text-center"
              style={{ color: "rgba(0,0,0,0.35)" }}
            >
              © {new Date().getFullYear()} Sjöstedts Måleri AB · Precision i varje penseldrag.
            </p>
            <p
              className="text-xs tracking-wide font-sans"
              style={{ color: "rgba(0,0,0,0.3)" }}
            >
              Certifierat Målarmästeri
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
