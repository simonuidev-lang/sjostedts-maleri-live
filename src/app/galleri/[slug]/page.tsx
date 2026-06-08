import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";

/* ─── Category metadata ─────────────────────────────────────────────────────── */
const CATEGORIES: Record<
  string,
  { title: string; subtitle: string; folder: string; homeAnchor: string }
> = {
  invandigt: {
    title: "Invändigt Måleri",
    subtitle: "Precision och kvalitet i varje rum.",
    folder: "invandigt",
    homeAnchor: "invandig-maleri",
  },
  utvandigt: {
    title: "Utvändigt Måleri",
    subtitle: "Fasadmålning som skyddar och förvandlar.",
    folder: "utvandigt",
    homeAnchor: "utvandig-maleri",
  },
  tvatt: {
    title: "Tvätt / Algbehandlingar",
    subtitle: "Professionell rengöring — resultat du kan se direkt.",
    folder: "tvatt",
    homeAnchor: "tvatt-algbehandlingar",
  },
};

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
function getImagesForCategory(folder: string): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "galleri", folder);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) =>
        [".jpg", ".jpeg", ".png", ".webp"].includes(
          path.extname(f).toLowerCase()
        )
      )
      .sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      })
      .map((f) => `/galleri/${folder}/${f}`);
  } catch {
    return [];
  }
}

/* ─── Page component (Server Component) ─────────────────────────────────────── */
export default async function GalleriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) notFound();

  const images = getImagesForCategory(category.folder);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F0EA",
        fontFamily: "var(--font-inter, sans-serif)",
      }}
    >
      {/* ── Sticky top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: "rgba(244,240,234,0.92)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <Link href="/" aria-label="Tillbaka till startsidan">
            <img
              src="/logga.png"
              alt="Sjöstedts Måleri"
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Back button */}
          <Link
            href={`/#${category.homeAnchor}`}
            id="back-to-home-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "9999px",
              padding: "10px 22px",
              background: "black",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow:
                "0 8px 28px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Tillbaka till startsidan
          </Link>
        </div>
      </div>

      {/* ── Page header ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 24px 40px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.32em",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.38)",
            marginBottom: "16px",
          }}
        >
          Galleri
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair, serif)",
            fontWeight: 700,
            fontSize: "clamp(2.6rem, 5vw, 5rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#111",
            marginBottom: "16px",
          }}
        >
          {category.title}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(0,0,0,0.5)",
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {category.subtitle}
        </p>

        {/* Image count badge */}
        {images.length > 0 && (
          <span
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(0,0,0,0.06)",
              color: "rgba(0,0,0,0.5)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {images.length} {images.length === 1 ? "bild" : "bilder"}
          </span>
        )}
      </div>

      {/* ── Gallery grid ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        {images.length === 0 ? (
          /* Empty state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 24px",
              gap: "16px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(0,0,0,0.35)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Foton kommer snart
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: "16px",
            }}
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  aspectRatio: "4 / 3",
                  background: "#E8E4DE",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow:
                    "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${category.title} — bild ${idx + 1}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Index chip removed */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer strip ── */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "32px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          href={`/#${category.homeAnchor}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "9999px",
            padding: "14px 32px",
            background: "black",
            color: "white",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 12px 32px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}

/* ─── Static params for build ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

/* ─── Metadata ───────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES[slug];
  if (!category) return {};
  return {
    title: `${category.title} — Sjöstedts Måleri`,
    description: category.subtitle,
    openGraph: {
      title: `${category.title} — Sjöstedts Måleri`,
      description: category.subtitle,
      siteName: "Sjöstedts Måleri",
      locale: "sv_SE",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Sjöstedts Måleri",
        },
      ],
    },
  };
}
