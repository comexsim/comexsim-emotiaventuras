import type { Metadata } from "next";

import { BusinessPage } from "@/features/business/BusinessPage";

import { businessFonts } from "./fonts";
import "./business.css";

// Ruta interna para decidir la línea gráfica: ningún botón la enlaza y no se indexa.
export const metadata: Metadata = {
  title: "EmotiAventuras · Línea gráfica (interno)",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function Page() {
  return (
    <div className={`biz ${businessFonts}`}>
      <BusinessPage />
    </div>
  );
}
