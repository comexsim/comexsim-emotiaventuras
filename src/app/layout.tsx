import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

// Letras redondeadas y muy legibles, pensadas para quienes están aprendiendo a leer.
const display = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Nunito({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "EmotiAventuras · La Academia de los Superpoderes Emocionales",
  description:
    "Simulador educativo para niños de 5 a 9 años: reconocer emociones, manejar la frustración, pedir ayuda y resolver conflictos.",
};

export const viewport: Viewport = { themeColor: "#a9e2f7" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
