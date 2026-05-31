import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Sjöstedts Måleri",
  description: "Noggrannhet i varje penseldrag. Luxury painting contractor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <nav className="sticky top-0 z-50 bg-white py-6 px-8 flex items-center justify-center">
          <h1 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase text-black">
            Sjöstedts Måleri
          </h1>
        </nav>
        {children}
      </body>
    </html>
  );
}
