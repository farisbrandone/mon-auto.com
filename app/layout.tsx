import type { Metadata } from "next";
//import { Mona_Sans } from "next/font/google";
import "./globals.css";

/* const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
}); */

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
    <html lang="fr">
      <body /* className={`${monaSans.className} antialiased`} */>
        {children}
      </body>
    </html>
  );
}
