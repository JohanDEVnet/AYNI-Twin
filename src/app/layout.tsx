import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AYNI Twin",
  description:
    "Una herramienta educativa para comprender riesgos, simular intervenciones y acompañar mejores futuros.",
  icons: {
    icon: "/img/AYNI-Twin-App-Icon.png",
    apple: "/img/AYNI-Twin-App-Icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
