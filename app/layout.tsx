import type { Metadata } from "next";
//import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Inter, Belleza, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

/* import * as font from "next/font/google";

const l = font.Belleza;
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Configure Playfair Display (Serif - for headings)
const playfair = Poppins({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mon auto.com",
  description:
    "Le site de référence pour l'achat et la vente de véhicule neuf et d'occasion",
};

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
      <body /* className={`${monaSans.className} antialiased`} */>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
