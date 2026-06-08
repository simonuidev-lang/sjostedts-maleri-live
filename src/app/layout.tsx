import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import PageTransitionKey from "../components/PageTransitionKey";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: "Sjöstedts Måleri — Premium måleritjänster med total trygghet",
  description: "Professionellt invändigt och utvändigt måleri samt tvätt och algbehandlingar. Få en kostnadsfri offert utan dolda kostnader.",
  openGraph: {
    title: "Sjöstedts Måleri — Premium måleritjänster med total trygghet",
    description: "Professionellt invändigt och utvändigt måleri samt tvätt och algbehandlingar. Få en kostnadsfri offert utan dolda kostnader.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <PageTransitionKey>
          {children}
        </PageTransitionKey>
      </body>
    </html>
  );
}
