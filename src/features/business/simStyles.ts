/**
 * Estilos gráficos propuestos para el simulador (ruta oculta /business). Cada estilo re-viste la
 * escena 3D real: no cambia la geometría del mundo ni el simulador de «/», solo materiales, luces y
 * paleta mientras se mira la comparación.
 */

export interface Swatch {
  name: string;
  hex: string;
}

export type SimStyleId =
  "actual" | "plano" | "acuarela" | "pastel" | "papel" | "arcilla" | "lowpoly";

/** Cómo se re-viste cada pieza de la escena. */
export interface Skin {
  material: "toon" | "lambert" | "standard";
  /** Escalones de luz del sombreado de dibujo animado. */
  steps?: number;
  /** Caras planas visibles (y geometría simplificada en el low-poly). */
  faceted?: boolean;
  /** Relieve de huellas para la arcilla. */
  bump?: boolean;
  roughness?: number;
  /** Multiplica la saturación (1 = igual). */
  saturation: number;
  /** Positivo aclara hacia el blanco; negativo oscurece. Entre -1 y 1. */
  lighten: number;
  /** Color con que se tiñe todo, como el papel de fondo. */
  tint?: string;
  tintAmount?: number;
  /** Lleva cada color al más cercano de la paleta del estilo. */
  quantize?: boolean;
  /** Contorno por casco invertido. */
  outline?: { color: string; width: number };
}

export interface SceneLook {
  background: string;
  hemi: { sky: string; ground: string; intensity: number };
  sun: { color: string; intensity: number };
  fog?: { color: string; near: number; far: number };
}

export interface UiLook {
  surface: string;
  ink: string;
  muted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  radius: string;
  border: string;
  shadow: string;
}

export interface SimStyle {
  id: SimStyleId;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  risks: string[];
  /** Esfuerzo estimado para llevarlo al simulador completo. */
  effort: "Ya existe" | "Bajo" | "Medio" | "Alto";
  palette: Swatch[];
  fonts: { display: string; body: string; displayVar: string; bodyVar: string };
  /** `null`: los materiales originales, tal cual están en «/». */
  skin: Skin | null;
  scene: SceneLook;
  overlay: "none" | "watercolor" | "paper" | "grain";
  ui: UiLook;
}

export const SIM_STYLES: SimStyle[] = [
  {
    id: "actual",
    name: "Juguete 3D (actual)",
    tagline: "Maqueta de juguete, cálida y saturada",
    description:
      "Es el estilo publicado hoy: piezas redondeadas como bloques de juguete, sol cálido y sombras suaves. Se siente tangible y alegre.",
    strengths: [
      "Ya funciona en todo el recorrido",
      "Muy legible para 5 a 9 años",
      "Transmite energía y aventura",
    ],
    risks: ["Saturado para los momentos de calma", "Se parece a muchos productos infantiles 3D"],
    effort: "Ya existe",
    palette: [
      { name: "Cielo", hex: "#a9e2f7" },
      { name: "Pasto", hex: "#8ed06b" },
      { name: "Arena", hex: "#f2d995" },
      { name: "Sol", hex: "#f7c243" },
      { name: "Coral", hex: "#ef6f5b" },
      { name: "Mar", hex: "#74c9e8" },
      { name: "Violeta", hex: "#a06cd5" },
      { name: "Madera", hex: "#c98f5c" },
    ],
    fonts: {
      display: "Baloo 2",
      body: "Nunito",
      displayVar: "var(--font-display)",
      bodyVar: "var(--font-body)",
    },
    skin: null,
    scene: {
      background: "#a9e2f7",
      hemi: { sky: "#ffffff", ground: "#d9c6a5", intensity: 1.55 },
      sun: { color: "#fff4e2", intensity: 2.1 },
    },
    overlay: "none",
    ui: {
      surface: "#fffdf8",
      ink: "#33262a",
      muted: "#5d5054",
      primary: "#e8573f",
      onPrimary: "#ffffff",
      accent: "#f7c243",
      radius: "24px",
      border: "3px solid #f0e3c8",
      shadow: "0 2px 0 rgb(80 50 20 / 0.08), 0 14px 34px rgb(80 50 20 / 0.18)",
    },
  },
  {
    id: "plano",
    name: "Plano ilustrado",
    tagline: "Dibujo animado con contorno y colores planos",
    description:
      "Sombreado en pocos tonos y un contorno de tinta, como la ilustración de un libro escolar moderno. Se lee de un vistazo, incluso en una pantalla pequeña.",
    strengths: [
      "Máxima legibilidad de formas y emociones",
      "Liviano: rinde bien en tabletas escolares",
      "Coherente con ilustraciones 2D para la web",
    ],
    risks: [
      "Pierde algo de la sensación de volumen",
      "El contorno exige cuidar los detalles finos",
    ],
    effort: "Bajo",
    palette: [
      { name: "Tinta", hex: "#2b2d42" },
      { name: "Crema", hex: "#fff6e5" },
      { name: "Turquesa", hex: "#2ec4b6" },
      { name: "Mostaza", hex: "#ffbf3c" },
      { name: "Tomate", hex: "#ff6b4a" },
      { name: "Cielo", hex: "#8fd3f4" },
      { name: "Hoja", hex: "#7bc950" },
      { name: "Lila", hex: "#9b8cf2" },
      { name: "Rosa", hex: "#ff9fb2" },
      { name: "Tierra", hex: "#c08552" },
      { name: "Piel clara", hex: "#f6c9a0" },
      { name: "Piel morena", hex: "#a8693f" },
    ],
    fonts: {
      display: "Fredoka",
      body: "Nunito",
      displayVar: "var(--font-fredoka)",
      bodyVar: "var(--font-body)",
    },
    skin: {
      material: "toon",
      steps: 3,
      saturation: 1.1,
      lighten: 0.04,
      quantize: true,
      outline: { color: "#2b2d42", width: 0.022 },
    },
    scene: {
      background: "#8fd3f4",
      hemi: { sky: "#ffffff", ground: "#ffe9c7", intensity: 1.9 },
      sun: { color: "#ffffff", intensity: 1.6 },
    },
    overlay: "none",
    ui: {
      surface: "#fff6e5",
      ink: "#2b2d42",
      muted: "#555872",
      primary: "#ff6b4a",
      onPrimary: "#ffffff",
      accent: "#2ec4b6",
      radius: "18px",
      border: "3px solid #2b2d42",
      shadow: "4px 4px 0 #2b2d42",
    },
  },
  {
    id: "acuarela",
    name: "Acuarela de cuento",
    tagline: "Libro ilustrado, papel y pigmento suave",
    description:
      "Colores lavados sobre papel con grano, como un cuento de biblioteca. Invita a la calma y a la lectura compartida con un adulto.",
    strengths: [
      "Transmite ternura y cuidado a los padres",
      "Ideal para el Bosque de la Calma y los cuentos",
      "Se distingue de la mayoría de las apps infantiles",
    ],
    risks: ["Menos energía para los desafíos del recreo", "Hay que vigilar el contraste del texto"],
    effort: "Medio",
    palette: [
      { name: "Papel", hex: "#f7f1e3" },
      { name: "Salvia", hex: "#a8c3a0" },
      { name: "Agua", hex: "#9cc5d9" },
      { name: "Durazno", hex: "#f2b8a2" },
      { name: "Miel", hex: "#e9c46a" },
      { name: "Ciruela", hex: "#b388a8" },
      { name: "Musgo", hex: "#6f8f6a" },
      { name: "Sepia", hex: "#6b4f3a" },
    ],
    fonts: {
      display: "Mali",
      body: "Andika",
      displayVar: "var(--font-mali)",
      bodyVar: "var(--font-andika)",
    },
    skin: {
      material: "lambert",
      saturation: 0.78,
      lighten: 0.1,
      tint: "#f3e6cc",
      tintAmount: 0.2,
    },
    scene: {
      background: "#efe6d2",
      hemi: { sky: "#fffaf0", ground: "#e8d9bc", intensity: 1.9 },
      sun: { color: "#fff1dc", intensity: 1.2 },
      fog: { color: "#efe6d2", near: 28, far: 80 },
    },
    overlay: "watercolor",
    ui: {
      surface: "#fbf6ea",
      ink: "#4a3a2c",
      muted: "#6b5a4a",
      primary: "#a85a50",
      onPrimary: "#fffaf0",
      accent: "#6f8f6a",
      radius: "14px",
      border: "2px solid #d9c9a8",
      shadow: "0 10px 30px rgb(107 79 58 / 0.18)",
    },
  },
  {
    id: "pastel",
    name: "Pastel sereno",
    tagline: "Tonos suaves, luz difusa y mucho aire",
    description:
      "Colores pastel, luz sin contrastes duros y una niebla suave. Baja la estimulación: pensado para niños que se abruman con facilidad y para la rutina de calma.",
    strengths: [
      "El más calmo: coherente con el bienestar emocional",
      "Bien recibido por padres y docentes",
      "Comparte lenguaje con la web para padres",
    ],
    risks: [
      "Puede verse apagado para los de 8 y 9 años",
      "Las emociones deben distinguirse por forma, no solo por color",
    ],
    effort: "Bajo",
    palette: [
      { name: "Niebla", hex: "#eef2f7" },
      { name: "Lavanda", hex: "#c9c3ef" },
      { name: "Menta", hex: "#bfe6d3" },
      { name: "Cielo", hex: "#bcdff1" },
      { name: "Durazno", hex: "#fbd3c0" },
      { name: "Vainilla", hex: "#fbeeb8" },
      { name: "Rosa", hex: "#f6c6d8" },
      { name: "Pizarra", hex: "#5b6577" },
    ],
    fonts: {
      display: "Quicksand",
      body: "Nunito",
      displayVar: "var(--font-quicksand)",
      bodyVar: "var(--font-body)",
    },
    skin: { material: "lambert", saturation: 0.85, lighten: 0.3 },
    scene: {
      background: "#e6ecf6",
      hemi: { sky: "#ffffff", ground: "#e9e3f5", intensity: 2.1 },
      sun: { color: "#ffffff", intensity: 0.9 },
      fog: { color: "#e6ecf6", near: 26, far: 70 },
    },
    overlay: "none",
    ui: {
      surface: "#ffffff",
      ink: "#3d4556",
      muted: "#5b6577",
      primary: "#6c5fcf",
      onPrimary: "#ffffff",
      accent: "#7cc4a3",
      radius: "28px",
      border: "1px solid #e1e6f0",
      shadow: "0 12px 40px rgb(91 101 119 / 0.14)",
    },
  },
  {
    id: "papel",
    name: "Papel recortado",
    tagline: "Collage de cartulina con borde blanco",
    description:
      "Cada pieza parece recortada en cartulina, con borde blanco y textura de fibra. Recuerda a una manualidad del aula: cercano y artesanal.",
    strengths: [
      "Muy original frente a la competencia",
      "Conecta con las manualidades del aula",
      "Las piezas se ven claras y separadas",
    ],
    risks: ["El borde blanco requiere ajuste fino por pieza", "Menos matices en las expresiones"],
    effort: "Medio",
    palette: [
      { name: "Cartulina", hex: "#f4ead5" },
      { name: "Kraft", hex: "#c9a47a" },
      { name: "Rojo papel", hex: "#e4572e" },
      { name: "Amarillo", hex: "#f3c623" },
      { name: "Verde", hex: "#5aa469" },
      { name: "Azul", hex: "#3a86c8" },
      { name: "Morado", hex: "#8e6bbf" },
      { name: "Rosa", hex: "#f19bb4" },
      { name: "Carbón", hex: "#2f2f37" },
      { name: "Blanco", hex: "#fffaf0" },
      { name: "Piel clara", hex: "#f2c49b" },
      { name: "Piel morena", hex: "#9c6440" },
    ],
    fonts: {
      display: "Sniglet",
      body: "Lexend",
      displayVar: "var(--font-sniglet)",
      bodyVar: "var(--font-lexend)",
    },
    skin: {
      material: "toon",
      steps: 2,
      saturation: 1,
      lighten: 0,
      quantize: true,
      outline: { color: "#fffaf0", width: 0.03 },
    },
    scene: {
      background: "#f4ead5",
      hemi: { sky: "#ffffff", ground: "#e9d9b8", intensity: 1.7 },
      sun: { color: "#fff8ea", intensity: 1.8 },
    },
    overlay: "paper",
    ui: {
      surface: "#fffaf0",
      ink: "#2f2f37",
      muted: "#55525c",
      primary: "#d24a22",
      onPrimary: "#fffaf0",
      accent: "#3a86c8",
      radius: "6px",
      border: "3px solid #fffaf0",
      shadow: "0 3px 0 #c9a47a, 0 10px 20px rgb(47 47 55 / 0.25)",
    },
  },
  {
    id: "arcilla",
    name: "Arcilla",
    tagline: "Plastilina modelada a mano",
    description:
      "Superficies mate con pequeñas huellas, como figuras de plastilina animadas cuadro a cuadro. Muy expresivo y cálido: invita a tocar.",
    strengths: [
      "Muy expresivo para las emociones",
      "Cálido y memorable para los niños",
      "Distinto de los 3D lisos del mercado",
    ],
    risks: ["El relieve cuesta más en equipos lentos", "Hay que cuidar que no se vea sucio"],
    effort: "Medio",
    palette: [
      { name: "Masa", hex: "#f3e1c7" },
      { name: "Terracota", hex: "#d9714e" },
      { name: "Ocre", hex: "#e0a63a" },
      { name: "Oliva", hex: "#8ea95a" },
      { name: "Petróleo", hex: "#3f8f9b" },
      { name: "Ciruela", hex: "#8c5a8c" },
      { name: "Rosa arcilla", hex: "#e8a1a1" },
      { name: "Cacao", hex: "#6b4430" },
    ],
    fonts: {
      display: "Chewy",
      body: "Nunito",
      displayVar: "var(--font-chewy)",
      bodyVar: "var(--font-body)",
    },
    skin: {
      material: "standard",
      bump: true,
      roughness: 1,
      saturation: 0.72,
      lighten: -0.06,
      tint: "#e9c9a0",
      tintAmount: 0.22,
    },
    scene: {
      background: "#e9dcc6",
      hemi: { sky: "#fff6e8", ground: "#b99a74", intensity: 1.3 },
      sun: { color: "#ffe6c4", intensity: 2.6 },
    },
    overlay: "grain",
    ui: {
      surface: "#f8eddc",
      ink: "#4a2f22",
      muted: "#6b4a38",
      primary: "#c35f3e",
      onPrimary: "#fff8ee",
      accent: "#3f8f9b",
      radius: "30px",
      border: "4px solid #ecd6b6",
      shadow: "inset 0 -6px 0 rgb(107 68 48 / 0.15), 0 12px 24px rgb(107 68 48 / 0.25)",
    },
  },
  {
    id: "lowpoly",
    name: "Low-poly geométrico",
    tagline: "Facetas nítidas y color vibrante",
    description:
      "Formas de pocas caras y luz marcada, como un origami digital. Se siente moderno y es el más liviano de dibujar.",
    strengths: [
      "Muy liviano: ideal para equipos escolares lentos",
      "Moderno: atrae a los de 8 y 9 años",
      "Fácil de ampliar con piezas nuevas",
    ],
    risks: ["Menos tierno para los de 5 y 6 años", "Rostros con menos matices"],
    effort: "Bajo",
    palette: [
      { name: "Hielo", hex: "#edf6f9" },
      { name: "Cian", hex: "#4cc9f0" },
      { name: "Índigo", hex: "#4361ee" },
      { name: "Magenta", hex: "#f72585" },
      { name: "Lima", hex: "#b5e48c" },
      { name: "Esmeralda", hex: "#52b788" },
      { name: "Ámbar", hex: "#ffb703" },
      { name: "Naranja", hex: "#fb8500" },
    ],
    fonts: {
      display: "Lilita One",
      body: "Lexend",
      displayVar: "var(--font-lilita)",
      bodyVar: "var(--font-lexend)",
    },
    skin: { material: "standard", faceted: true, roughness: 0.9, saturation: 1.25, lighten: 0 },
    scene: {
      background: "#bfe9f7",
      hemi: { sky: "#ffffff", ground: "#9fb7c9", intensity: 1.2 },
      sun: { color: "#fff7e6", intensity: 2.8 },
    },
    overlay: "none",
    ui: {
      surface: "#ffffff",
      ink: "#1d2340",
      muted: "#4a5070",
      primary: "#4361ee",
      onPrimary: "#ffffff",
      accent: "#f72585",
      radius: "4px",
      border: "2px solid #1d2340",
      shadow: "6px 6px 0 #4cc9f0",
    },
  },
];

export function simStyleById(id: string): SimStyle | undefined {
  return SIM_STYLES.find((style) => style.id === id);
}

/* ---------- Color ---------- */

interface Hsl {
  h: number;
  s: number;
  l: number;
}
type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl([r, g, b]: Rgb): Hsl {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h / 6, s, l };
}

function hueToRgb(p: number, q: number, t: number): number {
  let x = t;
  if (x < 0) x += 1;
  if (x > 1) x -= 1;
  if (x < 1 / 6) return p + (q - p) * 6 * x;
  if (x < 1 / 2) return q;
  if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
  return p;
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    hueToRgb(p, q, h + 1 / 3) * 255,
    hueToRgb(p, q, h) * 255,
    hueToRgb(p, q, h - 1 / 3) * 255,
  ];
}

/** Distancia perceptual aproximada («redmean»): basta para elegir el color más cercano. */
function distance(a: Rgb, b: Rgb): number {
  const rm = (a[0] + b[0]) / 2;
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
}

export function nearest(hex: string, palette: string[]): string {
  const target = hexToRgb(hex);
  let best = palette[0] ?? hex;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of palette) {
    const d = distance(target, hexToRgb(candidate));
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }
  return best;
}

/** Color con que se dibuja, en un estilo, una pieza que en «/» tiene `hex`. */
export function skinColor(hex: string, skin: Skin, palette: string[]): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  const s = Math.min(1, hsl.s * skin.saturation);
  const l = skin.lighten >= 0 ? hsl.l + (1 - hsl.l) * skin.lighten : hsl.l * (1 + skin.lighten);
  let rgb = hslToRgb({ h: hsl.h, s, l });
  if (skin.tint && skin.tintAmount) {
    const tint = hexToRgb(skin.tint);
    const k = skin.tintAmount;
    rgb = [
      rgb[0] * (1 - k) + tint[0] * k,
      rgb[1] * (1 - k) + tint[1] * k,
      rgb[2] * (1 - k) + tint[2] * k,
    ];
  }
  const out = rgbToHex(rgb);
  return skin.quantize && palette.length > 0 ? nearest(out, palette) : out;
}
