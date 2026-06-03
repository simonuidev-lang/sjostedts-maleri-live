"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";


/* ─── Brand Tokens ─────────────────────────────────────────────────────────── */
const CREAM = "#F4F0EA";
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Reusable viewport props ───────────────────────────────────────────────── */
const VP = { once: true, margin: "-100px" } as const;



/* ─── Project card data ─────────────────────────────────────────────────────── */
interface ProjectImage {
  src: string;
  label: string;
}

interface ProjectCardData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  images: ProjectImage[];
  /** Bento layout: "wide" spans 2 cols, "half" spans 1 col */
  size: "wide" | "half";
  /** Number of columns for the thumbnail grid inside the card */
  thumbCols: 2 | 1;
  /**
   * When set, the card renders as a single full-bleed image showcase
   * instead of a grid. No carousel or before/after logic is applied.
   */
  singleImage?: { src: string; alt: string };
}

const projectCards: ProjectCardData[] = [
  // ── Card 1: Exteriör: Inglasad Altan (4 images, full width) ──
  {
    id: "projekt-altan",
    title: "Exteriör: Inglasad Altan",
    subtitle: "Komplett ytbehandling av den svarta träexteriören — från grundning till finish med precision i varje detalj.",
    tag: "EXTERIÖR · GALLERI",
    size: "wide",
    thumbCols: 2,
    images: [
      { src: "/1-altan/1.jpg", label: "Före" },
      { src: "/1-altan/2.jpg", label: "Efter" },
      { src: "/1-altan/3.jpg", label: "Före" },
      { src: "/1-altan/4.jpg", label: "Efter" },
    ],
  },
  // ── Card 2: Fasadmålning: Detalj & Helhet (4 images, full width) ──
  {
    id: "projekt-fasad",
    title: "Fasadmålning: Detalj & Helhet",
    subtitle: "Klimatskyddad fasadmålning — flagnade ytor restaurerade och förseglade med premiumprodukter för generationer framöver.",
    tag: "FASAD · GALLERI",
    size: "wide",
    thumbCols: 2,
    images: [
      { src: "/2-fasad-detaljer/1.jpg", label: "Före" },
      { src: "/2-fasad-detaljer/2.jpg", label: "Efter" },
      { src: "/2-fasad-detaljer/3.jpg", label: "Före" },
      { src: "/2-fasad-detaljer/4.jpg", label: "Efter" },
    ],
  },
  // ── Card 3: Exteriör: Plattvätt (2 images, Before/After) ──
  {
    id: "projekt-plattvatt",
    title: "Exteriör: Plattvätt",
    subtitle: "Professionell högtrycksrengöring — stenplattor återfår sin ursprungliga yta och lyser som nya.",
    tag: "EXTERIÖR · FÖRE / EFTER",
    size: "half",
    thumbCols: 1,
    images: [
      { src: "/3-plattvatt/1.jpg", label: "Före" },
      { src: "/3-plattvatt/2.jpg", label: "Efter" },
    ],
  },
  // ── Card 4: Interiör: Trapprenovering (2 images, Before/After) ──
  {
    id: "projekt-trappa",
    title: "Interiör: Trapprenovering",
    subtitle: "Totalrenovering av trappa — slipning, grundning och lackering till absolut planhet och exklusiv finish.",
    tag: "INTERIÖR · FÖRE / EFTER",
    size: "half",
    thumbCols: 1,
    images: [
      { src: "/4-trappa/1.jpg", label: "Före" },
      { src: "/4-trappa/2.jpg", label: "Efter" },
    ],
  },
  // ── Card 5: Fasadmålning: Röd Trävilla (2 images, Before/After) ──
  {
    id: "projekt-rod-villa",
    title: "Fasadmålning: Röd Trävilla",
    subtitle: "Traditionell rödfärgsmålning med moderna premiumprodukter — skyddar och förvandlar hela fasaden.",
    tag: "FASAD · FÖRE / EFTER",
    size: "half",
    thumbCols: 1,
    images: [
      { src: "/5-fasad-helhet/1.jpg", label: "Före" },
      { src: "/5-fasad-helhet/2.jpg", label: "Efter" },
    ],
  },
];

/* ─── Easing curves ─────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 380, damping: 40 } as const;
const SPRING_SLOW = { type: "spring", stiffness: 280, damping: 36 } as const;

/* ── Grid texture helper ─────────────────────────────────────────────────────── */
const GridTexture = ({ size = 28 }: { size?: number }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
      `,
      backgroundSize: `${size}px ${size}px`,
    }}
    aria-hidden="true"
  />
);

/* ══════════════════════════════════════════════════════════════════════════════
   REUSABLE PROJECT CARD COMPONENT
   – Each card manages its own open/active state independently.
═══════════════════════════════════════════════════════════════════════════════ */
function ProjectCard({ card, delay = 0 }: { card: ProjectCardData; delay?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const openCard = () => setIsOpen(true);
  const closeCard = () => { setActiveIdx(null); setIsOpen(false); };
  const openImg = (e: React.MouseEvent, idx: number) => { e.stopPropagation(); setActiveIdx(idx); };
  const closeImg = (e: React.MouseEvent) => { e.stopPropagation(); setActiveIdx(null); };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((p) => p === null ? 0 : (p - 1 + card.images.length) % card.images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((p) => p === null ? 0 : (p + 1) % card.images.length);
  };

  const thumbGridClass = card.thumbCols === 2 ? "grid-cols-2" : "grid-cols-1";

  /* ── Single-image showcase variant (no grid, no carousel) ── */
  if (card.singleImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        layoutId={`card-container-${card.id}`}
        transition={SPRING}
        className="relative flex flex-col select-none"
        style={{
          borderRadius: "1.75rem",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.72)",
          boxShadow: "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Full-bleed image */}
        <motion.div
          layoutId={`thumb-${card.id}-0`}
          transition={SPRING}
          className="relative overflow-hidden"
          style={{
            borderRadius: "1.4rem 1.4rem 0 0",
            aspectRatio: "16 / 9",
            background: CREAM,
          }}
        >
          <img
            src={card.singleImage.src}
            alt={card.singleImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <GridTexture />
          {/* Signature chip */}
          <div className="absolute top-3 right-3">
            <span
              className="text-[8px] tracking-[0.26em] font-mono font-semibold uppercase px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
            >
              Signatur
            </span>
          </div>
        </motion.div>

        {/* Card footer */}
        <div className="px-5 pb-5 pt-4 flex flex-col gap-1.5">
          <span
            className="text-[9px] tracking-[0.3em] font-mono font-semibold uppercase"
            style={{ color: "rgba(0,0,0,0.36)" }}
          >
            {card.tag}
          </span>
          <h3
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)" }}
          >
            {card.title}
          </h3>
          <p className="text-xs font-sans font-normal leading-relaxed" style={{ color: "rgba(0,0,0,0.52)" }}>
            {card.subtitle}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* ── The card widget ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        layoutId={`card-container-${card.id}`}
        onClick={openCard}
        transition={SPRING}
        className="relative flex flex-col cursor-pointer select-none group"
        style={{
          borderRadius: "1.75rem",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.72)",
          boxShadow: "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        whileHover={{
          y: -6,
          boxShadow: "0 36px 80px -15px rgba(0,0,0,0.2), 0 8px 28px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Thumbnail grid */}
        <div className={`grid ${thumbGridClass} gap-2 p-3`}>
          {card.images.map((img, idx) => (
            <motion.div
              key={idx}
              layoutId={`thumb-${card.id}-${idx}`}
              transition={SPRING}
              className="relative overflow-hidden"
              style={{
                borderRadius: "1.1rem",
                aspectRatio: card.thumbCols === 2 ? "1 / 1" : "16 / 9",
                background: CREAM,
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <GridTexture />
              {/* Before/After chip — shown on all grid cards */}
              <div className="absolute top-3 left-3">
                <span
                  className="text-[8px] tracking-[0.26em] font-mono font-semibold uppercase px-2.5 py-1 rounded-full"
                  style={{
                    background: img.label === "Före" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.88)",
                    color: img.label === "Före" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Card footer */}
        <div className="px-5 pb-5 pt-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span
              className="text-[9px] tracking-[0.3em] font-mono font-semibold uppercase"
              style={{ color: "rgba(0,0,0,0.36)" }}
            >
              {card.tag}
            </span>
            {/* Expand icon */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(0,0,0,0.07)" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>
          <h3
            className="font-serif font-bold leading-tight"
            style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)" }}
          >
            {card.title}
          </h3>
          <p className="text-xs font-sans font-normal leading-relaxed" style={{ color: "rgba(0,0,0,0.52)" }}>
            {card.subtitle}
          </p>
        </div>
      </motion.div>

      {/* ── Lightbox overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Scrim */}
            <motion.div
              key={`scrim-${card.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36 }}
              onClick={closeCard}
              className="fixed inset-0 z-[90]"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            />

            {/* Expanded card */}
            <motion.div
              layoutId={`card-container-${card.id}`}
              onClick={closeCard}
              transition={SPRING_SLOW}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
              style={{ pointerEvents: "auto" }}
            >
              <motion.div
                initial={false}
                onClick={(e) => e.stopPropagation()}
                className={`grid ${thumbGridClass} gap-4 w-full cursor-default`}
                style={{
                  maxWidth: card.size === "wide" ? "min(90vw, 960px)" : "min(90vw, 560px)",
                  padding: "18px",
                  borderRadius: "2.5rem",
                  background: "rgba(244,240,234,0.97)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 60px 120px -20px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.25)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  overflow: "hidden",
                }}
              >
                {/* Header row */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.16, duration: 0.36 }}
                  className={`${card.thumbCols === 2 ? "col-span-2" : "col-span-1"} flex items-center justify-between px-1 pb-1`}
                >
                  <div>
                    <p className="text-[9px] tracking-[0.3em] font-mono uppercase" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {card.tag}
                    </p>
                    <p className="font-serif font-bold text-base leading-snug mt-0.5">{card.title}</p>
                  </div>
                  <button
                    onClick={closeCard}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/10 flex-shrink-0 ml-4"
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    aria-label="Stäng galleri"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </motion.div>

                {/* Expanded thumbnails */}
                {card.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    layoutId={`thumb-${card.id}-${idx}`}
                    transition={SPRING}
                    onClick={(e) => openImg(e, idx)}
                    className="relative overflow-hidden cursor-zoom-in group/thumb"
                    style={{
                      borderRadius: "1.6rem",
                      aspectRatio: card.thumbCols === 2 ? "1 / 1" : "4 / 3",
                      background: CREAM,
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                    whileHover={{ scale: 1.025, zIndex: 10, boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.975 }}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <GridTexture />
                    {/* Hover zoom overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.24)" }}
                    >
                      <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2">
                          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                    </motion.div>
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="text-[8px] tracking-[0.26em] font-mono font-semibold uppercase px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.88)", color: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
                      >
                        {img.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Full-screen single image viewer ── */}
            <AnimatePresence>
              {activeIdx !== null && (
                <motion.div
                  key={`fs-${card.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26 }}
                  className="fixed inset-0 z-[110] flex items-center justify-center"
                  onClick={closeImg}
                  style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, scale: 0.9, x: 40 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92, x: -40 }}
                      transition={SPRING}
                      className="relative flex items-center justify-center"
                      style={{ maxWidth: "min(88vw, 900px)", maxHeight: "80vh", width: "100%" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="relative overflow-hidden w-full"
                        style={{ borderRadius: "2.5rem", aspectRatio: "4/3", background: CREAM }}
                      >
                        <img
                          src={card.images[activeIdx].src}
                          alt={card.images[activeIdx].label}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                        <GridTexture size={32} />
                        <div
                          className="absolute top-5 left-5 px-4 py-2 rounded-full text-[10px] font-mono tracking-[0.28em] uppercase font-semibold"
                          style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
                        >
                          {activeIdx + 1} / {card.images.length}
                        </div>
                        <div
                          className="absolute bottom-5 left-5 px-4 py-2 rounded-full text-[10px] font-mono tracking-[0.28em] uppercase font-semibold"
                          style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}
                        >
                          {card.images[activeIdx].label}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Prev */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.28, delay: 0.08 }}
                    onClick={prev}
                    className="absolute left-4 md:left-10 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}
                    whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.22)" }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Föregående bild"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>
                  </motion.button>

                  {/* Next */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.28, delay: 0.08 }}
                    onClick={next}
                    className="absolute right-4 md:right-10 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}
                    whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.22)" }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Nästa bild"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><polyline points="9 18 15 12 9 6" /></svg>
                  </motion.button>

                  {/* Close */}
                  <motion.button
                    initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.28 }}
                    onClick={closeImg}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}
                    whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.22)" }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Stäng bild"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>

                  {/* Dot indicators */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, delay: 0.12 }}
                    className="absolute bottom-8 flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {card.images.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                        animate={{ width: i === activeIdx ? 28 : 8, opacity: i === activeIdx ? 1 : 0.4 }}
                        transition={{ duration: 0.26 }}
                        className="h-2 rounded-full bg-white"
                        aria-label={`Gå till bild ${i + 1}`}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   BENTO GALLERY SECTION
   Layout:
     Row 1 – Card 0 (Altan, 4-img):          full width  (col-span-2)
     Row 2 – Card 1 (Fasad, 4-img):          full width  (col-span-2)
     Row 3 – Card 2 (Plattvätt, 2-img):      left half   (col-span-1)
           – Card 3 (Trappa, 2-img):         right half  (col-span-1)
     Row 4 – Card 4 (Röd Trävilla, 2-img):   full width  (col-span-2)
═══════════════════════════════════════════════════════════════════════════════ */
function BentoGallerySection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 md:px-16 pt-16 pb-8 md:py-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 1, ease }}
        className="mb-16"
      >
        <p className="text-xs tracking-[0.32em] font-semibold uppercase mb-5" style={{ color: "rgba(0,0,0,0.38)" }}>
          Senaste Transformationer
        </p>
        <h2
          className="font-serif font-bold leading-none tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 6rem)" }}
        >
          Före / Efter.
        </h2>
        <p className="mt-4 text-sm font-medium tracking-wide" style={{ color: "rgba(0,0,0,0.42)" }}>
          Klicka på ett projekt för att utforska
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Row 1: Card 0 — Exteriör: Inglasad Altan, full width showstopper ── */}
        <div className="md:col-span-2">
          <ProjectCard card={projectCards[0]} delay={0} />
        </div>

        {/* ── Row 2: Card 1 — Fasadmålning: Detalj & Helhet, full width showstopper ── */}
        <div className="md:col-span-2">
          <ProjectCard card={projectCards[1]} delay={0.06} />
        </div>

        {/* ── Row 3: Cards 2 & 3 — Plattvätt & Trapprenovering side-by-side ── */}
        <div className="md:col-span-1">
          <ProjectCard card={projectCards[2]} delay={0.12} />
        </div>
        <div className="md:col-span-1">
          <ProjectCard card={projectCards[3]} delay={0.18} />
        </div>

        {/* ── Row 4: Card 4 — Fasadmålning: Röd Trävilla, half width Before/After ── */}
        <div className="md:col-span-1">
          <ProjectCard card={projectCards[4]} delay={0.24} />
        </div>
      </div>
    </section>
  );
}

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
          className="max-w-screen-xl mx-auto px-3 md:px-16 h-16 md:h-20 flex items-center justify-between gap-2"
        >
          {/* Logo */}
          <img
            src="/logga.png"
            alt="Sjöstedts Måleri"
            className="h-12 md:h-20 w-auto object-contain select-none flex-shrink-0"
          />

          {/* CTA pill + phone — both visible on mobile, compact */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            {/* Phone — Concave neumorphic button */}
            <a
              href="tel:0735271957"
              id="nav-phone-btn"
              aria-label="Ring 073-527 19 57"
              className="flex items-center gap-1.5 rounded-full px-2 py-1 md:px-5 md:py-2.5 text-xs font-semibold uppercase text-gray-800 bg-gray-100 border border-gray-200 transition-all duration-200 select-none"
              style={{
                letterSpacing: "0.12em",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "inset 0 4px 10px rgba(0,0,0,0.15), inset 0 2px 4px rgba(0,0,0,0.10)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
              </svg>
              <span className="hidden sm:inline">073-527 19 57</span>
              <span className="sm:hidden">Ring</span>
            </a>

            {/* Boka Offert — convex / popping-out primary */}
            <motion.a
              href="#offert"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease, delay: 0.3 }}
              whileHover={{ scale: 1.06, boxShadow: "0 20px 48px rgba(0,0,0,0.36), 0 4px 12px rgba(0,0,0,0.22)" }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-black text-white py-1 px-3 md:px-7 md:py-3 text-xs font-semibold uppercase cursor-pointer select-none transition-all duration-300 flex-shrink-0"
              style={{
                letterSpacing: "0.18em",
                boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Boka Offert
            </motion.a>
          </div>
        </div>
      </motion.nav>

      <main>
        {/* ────────────────────────────────────────────────────────────────────
            2. HERO — Clean image frame, grounded headline
        ──────────────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative flex items-center pt-16 md:pt-20"
          style={{ minHeight: "100svh", contain: "layout" }}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto px-6 md:px-12 w-full pt-4 pb-6 md:pt-8 md:pb-10">
            {/* LEFT — Grounded Headline */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, ease }}
              className="flex flex-col justify-center z-10 min-w-0"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.1 }}
                className="font-serif font-bold leading-none tracking-tight mb-5"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 6.5rem)" }}
              >
                Professionellt
                <br />
                <span style={{ opacity: 0.82 }}>måleri i</span>
                <br />
                <span
                  className="font-serif font-bold"
                  style={{ fontSize: "clamp(1.9rem, 4.2vw, 4.2rem)", opacity: 0.48 }}
                >
                  Ljungby.
                </span>
              </motion.h1>



              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                {/* BOKA OFFERT — convex, pops OUT */}
                <a
                  href="#offert"
                  className="rounded-full bg-black text-white px-9 py-4 text-sm font-bold uppercase transition-all duration-300 hover:-translate-y-1 active:scale-95"
                  style={{
                    letterSpacing: "0.16em",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.1) inset",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 20px 56px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.1) inset";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 12px 32px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.1) inset";
                  }}
                >
                  Boka Offert
                </a>

                {/* Phone — Concave neumorphic button */}
                <a
                  href="tel:0735271957"
                  id="hero-phone-btn"
                  aria-label="Ring 073-527 19 57"
                  className="rounded-full px-9 py-4 text-sm font-bold uppercase text-gray-800 bg-gray-100 border border-gray-200 transition-all duration-200 select-none active:scale-95"
                  style={{
                    letterSpacing: "0.16em",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 3px rgba(0,0,0,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "inset 0 4px 10px rgba(0,0,0,0.15), inset 0 2px 5px rgba(0,0,0,0.10)";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "inset 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 3px rgba(0,0,0,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "";
                  }}
                >
                  073-527 19 57
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease, delay: 0.65 }}
                className="flex flex-wrap items-center gap-4 mt-8"
              >
                {/* 5-star row */}
                <span className="text-xs text-stone-500 flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5" aria-label="5 av 5 stjärnor">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-stone-600" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </span>
                  <span className="font-medium">5/5 i Kundnöjdhet</span>
                </span>

                <span className="text-stone-300 text-sm select-none" aria-hidden="true">·</span>

                {/* Map pin */}
                <span className="text-xs text-stone-500 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="font-medium">Lokala i Ljungby</span>
                </span>

                <span className="text-stone-300 text-sm select-none" aria-hidden="true">·</span>

                {/* Shield / no hidden fees */}
                <span className="text-xs text-stone-500 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span className="font-medium">Inga dolda avgifter</span>
                </span>
              </motion.div>
            </motion.div>

            {/* RIGHT — Massive clean image frame */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease, delay: 0.1 }}
              className="relative w-full min-w-0"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute inset-0 rounded-[3rem] overflow-hidden"
                style={{
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow:
                    "0 60px 120px -20px rgba(0,0,0,0.22), 0 20px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <img
                  src="/jonas.jpg"
                  alt="Jonas Sjöstedt Måleri"
                  className="object-cover w-full h-full rounded-[2rem] shadow-xl"
                />
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
                { num: "01", heading: "Erfarenhet", body: "Handplockade målare med gesällbrev och mästarexamen. Trygghet du kan lita på." },
                { num: "02", heading: "Hantverksskicklighet", body: "Slutbesiktning och garanti ingår på varje uppdrag — utan kompromisser." },
                { num: "03", heading: "Trygghet", body: "Bindande offerter utan dolda kostnader. Tydlighet och ärlighet i varje steg." },
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
                  <h3 className="text-sm tracking-[0.14em] font-serif font-bold uppercase">{item.heading}</h3>
                  <p className="font-sans font-medium text-lg" style={{ color: "rgba(0,0,0,0.62)", lineHeight: 1.65 }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            BENTO BOX GALLERY — Senaste Transformationer
        ═══════════════════════════════════════════════════════════════════ */}
        <BentoGallerySection />


        {/* ────────────────────────────────────────────────────────────────────
            5. THE VAULT — Blackout Conversion Form
        ──────────────────────────────────────────────────────────────────── */}
        <section
          id="offert"
          className="pt-4 pb-16 px-4 md:px-8"
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
                  className="font-serif font-bold leading-none tracking-tight mb-10"
                  style={{ fontSize: "clamp(3rem, 5.5vw, 5.5rem)" }}
                >
                  Redo för
                  <br />
                  <span style={{ opacity: 0.72 }}>förändring?</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VP}
                  transition={{ duration: 1, ease, delay: 0.2 }}
                  className="font-sans font-normal text-lg leading-relaxed mb-12"
                  style={{ color: "rgba(255,255,255,0.6)", maxWidth: "380px" }}
                >
                  Jonas återkommer personligen med en bindande fastprisoffert inom 24 timmar. Trygghet och ärlighet — inga dolda avgifter.
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
                      <span className="text-sm tracking-wide font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {badge}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Form */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
              >
                <form
                  action="https://formsubmit.co/sjostedtsmaleri@gmail.com"
                  method="POST"
                  className="flex flex-col gap-10"
                  onSubmit={(e) => { new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3').play(); }}
                >
                  {/* FormSubmit hidden config inputs */}
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_subject" value="Ny Offertförfrågan från Hemsidan!" />

                  {[
                    { type: "text", name: "name", placeholder: "Ditt Namn", id: "form-name" },
                    { type: "email", name: "email", placeholder: "E-postadress", id: "form-email" },
                    { type: "tel", name: "phone", placeholder: "Telefonnummer", id: "form-phone" },
                  ].map((field) => (
                    <div key={field.id} className="relative group">
                      <input
                        id={field.id}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="w-full bg-transparent py-5 text-white text-lg font-normal tracking-wide placeholder-white/30 focus:outline-none transition-colors peer"
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
                      name="message"
                      placeholder="Berätta om ditt projekt..."
                      rows={3}
                      className="w-full bg-transparent py-5 text-white text-lg font-normal tracking-wide placeholder-white/30 focus:outline-none transition-colors resize-none"
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
                      className="w-full rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] py-6 transition-all duration-300"
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
                </form>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ────────────────────────────────────────────────────────────────────
            FOOTER
        ──────────────────────────────────────────────────────────────────── */}
        <footer
          className="w-full pt-16 pb-10 px-6 md:px-16"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="max-w-screen-xl mx-auto">
            {/* Top row: logo + contact grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 pb-12" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              {/* Logo + tagline */}
              <div className="flex flex-col gap-4">
                <img
                  src="/logga.png"
                  alt="Sjöstedts Måleri"
                  className="h-12 w-auto object-contain opacity-70"
                />
                <p className="text-xs tracking-wide font-sans font-semibold" style={{ color: "rgba(0,0,0,0.3)" }}>
                  Certifierat Målarmästeri
                </p>
              </div>

              {/* Telefon */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.22em] font-mono font-semibold uppercase" style={{ color: "rgba(0,0,0,0.3)" }}>Telefon</p>
                <div className="space-y-1">
                  <a
                    href="tel:0735271957"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 block"
                  >
                    073-527 19 57
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.22em] font-mono font-semibold uppercase" style={{ color: "rgba(0,0,0,0.3)" }}>Email</p>
                <div className="space-y-1">
                  <a
                    href="mailto:sjostedtsmaleri@gmail.com"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 block break-all"
                  >
                    sjostedtsmaleri@gmail.com
                  </a>
                </div>
              </div>

              {/* Adress */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.22em] font-mono font-semibold uppercase" style={{ color: "rgba(0,0,0,0.3)" }}>Adress</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Sjöstedts Måleri AB</p>
                  <p className="text-sm text-gray-400">Torsgatan 117</p>
                  <p className="text-sm text-gray-400">Ljungby, Sweden</p>
                </div>
              </div>
            </div>

            {/* Bottom row: copyright */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p
                className="text-xs tracking-[0.18em] font-sans font-medium text-center"
                style={{ color: "rgba(0,0,0,0.28)" }}
              >
                © {new Date().getFullYear()} Sjöstedts Måleri AB · Hantverksskicklighet i varje detalj.
              </p>
              <p className="text-xs font-mono" style={{ color: "rgba(0,0,0,0.2)" }}>Ljungby · Sverige</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
