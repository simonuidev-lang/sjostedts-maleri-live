import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Image from "next/image";
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
        <nav className="sticky top-0 z-50 bg-white py-6 px-8 flex items-center justify-between border-b border-black/10">
          <Image
            src="/logga.png"
            alt="Sjöstedts Måleri"
            width={400}
            height={120}
            priority={true}
            className="h-12 md:h-16 w-auto object-contain"
          />
          <a
            href="#"
            className="text-black bg-transparent border border-[#000000] px-5 py-2 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
          >
            Boka kostnadsfri offert
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
