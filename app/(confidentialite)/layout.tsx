import type { Metadata } from "next";
//import { Mona_Sans } from "next/font/google";

import { Inter, Playfair_Display } from "next/font/google";
/* const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
}); */

export const metadata: Metadata = {
  title: " Politique de confidentialité MonAuto.com",
  description:
    "Le site de référence pour l'achat et la vente de véhicule neuf et d'occasion",
};

// Configure Inter (Sans-serif)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Configure Playfair Display (Serif - for headings)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
