import {
  Andika,
  Chewy,
  Comfortaa,
  DM_Sans,
  DM_Serif_Display,
  Figtree,
  Fraunces,
  Fredoka,
  Grandstander,
  Lexend,
  Lilita_One,
  Mali,
  Mulish,
  Nunito_Sans,
  Quicksand,
  Sniglet,
  Source_Serif_4,
  Work_Sans,
} from "next/font/google";

/*
 * Tipografías de las propuestas. Solo las carga /business, sin precarga: el simulador de «/» sigue
 * con sus dos fuentes de siempre.
 */
const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-fredoka",
});
const mali = Mali({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["500", "700"],
  variable: "--font-mali",
});
const andika = Andika({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "700"],
  variable: "--font-andika",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-quicksand",
});
const sniglet = Sniglet({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["400", "800"],
  variable: "--font-sniglet",
});
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-lexend",
});
const chewy = Chewy({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
  variable: "--font-chewy",
});
const lilita = Lilita_One({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
  variable: "--font-lilita",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-fraunces",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-nunito-sans",
});
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-figtree",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-source-serif",
});
const grandstander = Grandstander({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-grandstander",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-dm-sans",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
  variable: "--font-dm-serif",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-work-sans",
});
const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-comfortaa",
});
const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mulish",
});

export const businessFonts = [
  fredoka,
  mali,
  andika,
  quicksand,
  sniglet,
  lexend,
  chewy,
  lilita,
  fraunces,
  nunitoSans,
  figtree,
  sourceSerif,
  grandstander,
  dmSans,
  dmSerif,
  workSans,
  comfortaa,
  mulish,
]
  .map((font) => font.variable)
  .join(" ");
