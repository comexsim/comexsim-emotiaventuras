import type { Swatch } from "./simStyles";

/**
 * Seis direcciones para la web oficial que leen los padres (y los colegios). Inspiradas en los
 * referentes de `docs/linea-grafica/benchmarking.md`, sin copiar ninguno.
 */

export type LandingId = "refugio" | "experto" | "cuaderno" | "color" | "editorial" | "noche";

export interface LandingStyle {
  id: LandingId;
  name: string;
  idea: string;
  palette: Swatch[];
  fonts: { display: string; body: string; displayVar: string; bodyVar: string };
  voice: string;
  inspiredBy: string[];
  /** Estructura del hero: cambia la composición, no solo el color. */
  layout: "split" | "centered" | "illustrated" | "playful" | "editorial" | "dark";
  copy: {
    kicker: string;
    title: string;
    lead: string;
    cta: string;
    secondary: string;
    howTitle: string;
    learnTitle: string;
    trustTitle: string;
    trustLead: string;
    schoolTitle: string;
    schoolLead: string;
  };
  /** Colores que usa la maqueta. */
  tokens: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    primary: string;
    onPrimary: string;
    accent: string;
    soft: string;
    line: string;
  };
}

export const LANDING_STYLES: LandingStyle[] = [
  {
    id: "refugio",
    name: "Refugio sereno",
    idea: "Bienestar primero: mucho aire, tonos tierra y una voz que acompaña.",
    palette: [
      { name: "Crema", hex: "#faf5ec" },
      { name: "Salvia", hex: "#8fa98b" },
      { name: "Salvia profunda", hex: "#4f6b52" },
      { name: "Terracota", hex: "#c8704f" },
      { name: "Arena", hex: "#ead9bf" },
      { name: "Carbón cálido", hex: "#2f2a26" },
    ],
    fonts: {
      display: "Fraunces",
      body: "Nunito Sans",
      displayVar: "var(--font-fraunces)",
      bodyVar: "var(--font-nunito-sans)",
    },
    voice: "Cálida y pausada, como una conversación con una orientadora de confianza.",
    inspiredBy: ["Pok Pok", "Headspace", "Lovevery"],
    layout: "split",
    copy: {
      kicker: "Bienestar emocional para niños de 5 a 9 años",
      title: "Un lugar tranquilo para aprender a sentir",
      lead: "En EmotiAventuras, tu hijo recorre una isla llena de situaciones de la vida real: el aula, el recreo, los paseos y la casa. En cada desafío elige qué hacer y ve, con calma, lo que pasa después.",
      cta: "Conocer la aventura",
      secondary: "Cómo cuidamos a tu familia",
      howTitle: "Así acompaña a tu hijo",
      learnTitle: "Cinco superpoderes para la vida",
      trustTitle: "Pensado para que estés tranquilo",
      trustLead:
        "Sin anuncios, sin compras dentro del simulador y sin presión por volver cada día.",
      schoolTitle: "Para colegios",
      schoolLead:
        "Cada colegio recibe acceso para sus aulas y para las familias, con un precio claro por grupo de alumnos.",
    },
    tokens: {
      bg: "#faf5ec",
      surface: "#ffffff",
      ink: "#2f2a26",
      muted: "#5f5850",
      primary: "#4f6b52",
      onPrimary: "#ffffff",
      accent: "#c8704f",
      soft: "#ead9bf",
      line: "#e6dccb",
    },
  },
  {
    id: "experto",
    name: "Respaldo experto",
    idea: "Confianza institucional: datos claros, método y privacidad a la vista, para colegios.",
    palette: [
      { name: "Azul profundo", hex: "#14365d" },
      { name: "Azul medio", hex: "#2f6db5" },
      { name: "Menta", hex: "#5cc8a8" },
      { name: "Menta suave", hex: "#e3f6ef" },
      { name: "Niebla", hex: "#f4f7fb" },
      { name: "Grafito", hex: "#1f2a37" },
    ],
    fonts: {
      display: "Figtree",
      body: "Source Serif 4",
      displayVar: "var(--font-figtree)",
      bodyVar: "var(--font-source-serif)",
    },
    voice: "Precisa y serena: explica el método, muestra lo que hace y lo que no hace.",
    inspiredBy: ["Second Step", "Centervention", "moozoom"],
    layout: "centered",
    copy: {
      kicker: "Aprendizaje socioemocional · 5 a 9 años",
      title: "Habilidades emocionales que se practican, no solo se explican",
      lead: "30 situaciones reales, 150 decisiones posibles y una consecuencia para cada una. EmotiAventuras convierte el aprendizaje socioemocional en práctica guiada, sin evaluar ni comparar a ningún niño.",
      cta: "Solicitar una demostración",
      secondary: "Ver el método",
      howTitle: "Un método en tres pasos",
      learnTitle: "Las cinco habilidades que se trabajan",
      trustTitle: "Privacidad por diseño",
      trustLead:
        "El simulador no pide datos personales: el progreso se guarda en el propio dispositivo.",
      schoolTitle: "Para colegios",
      schoolLead:
        "Licencia por grupo de alumnos con acceso familiar incluido y un panel para adultos que acompaña sin diagnosticar.",
    },
    tokens: {
      bg: "#f4f7fb",
      surface: "#ffffff",
      ink: "#1f2a37",
      muted: "#4a5768",
      primary: "#14365d",
      onPrimary: "#ffffff",
      accent: "#2f6db5",
      soft: "#e3f6ef",
      line: "#dde5ef",
    },
  },
  {
    id: "cuaderno",
    name: "Cuaderno de cuentos",
    idea: "La web como un libro ilustrado: cercana para los niños y tierna para los padres.",
    palette: [
      { name: "Papel", hex: "#fdf6e4" },
      { name: "Cielo de cuento", hex: "#7cc3e6" },
      { name: "Hierba", hex: "#7fbf6a" },
      { name: "Sol", hex: "#f6b93b" },
      { name: "Coral", hex: "#ea6a52" },
      { name: "Tinta", hex: "#3b2f2a" },
    ],
    fonts: {
      display: "Grandstander",
      body: "Nunito",
      displayVar: "var(--font-grandstander)",
      bodyVar: "var(--font-body)",
    },
    voice: "Narrativa y amable: cuenta la aventura como un cuento que se lee en familia.",
    inspiredBy: ["Peekapak", "ClassDojo Big Ideas", "Daniel Tiger"],
    layout: "illustrated",
    copy: {
      kicker: "Había una vez una isla…",
      title: "Donde cada emoción tiene su superpoder",
      lead: "Tu hijo crea su personaje, explora cuatro mundos y descubre, desafío a desafío, qué hacer cuando algo no sale, cuando un amigo se enoja o cuando da miedo probar algo nuevo.",
      cta: "Empezar la aventura",
      secondary: "Leer un cuento del Bosque",
      howTitle: "La aventura en tres capítulos",
      learnTitle: "Lo que se lleva de cada mundo",
      trustTitle: "Un rincón seguro",
      trustLead:
        "Nada de anuncios ni de compras reales: las monedas se ganan decidiendo y se gastan en la tienda mágica.",
      schoolTitle: "En el aula y en casa",
      schoolLead:
        "El colegio lo usa en clase y las familias continúan la aventura en casa con el mismo acceso.",
    },
    tokens: {
      bg: "#fdf6e4",
      surface: "#fffdf6",
      ink: "#3b2f2a",
      muted: "#6a5a50",
      primary: "#d4543c",
      onPrimary: "#ffffff",
      accent: "#7cc3e6",
      soft: "#fbe7b5",
      line: "#efdfba",
    },
  },
  {
    id: "color",
    name: "Color que despierta",
    idea: "Brillante y moderna: entra por los ojos del niño y convence con claridad al adulto.",
    palette: [
      { name: "Violeta", hex: "#6c4cf5" },
      { name: "Lima", hex: "#c6f36b" },
      { name: "Rosa chicle", hex: "#ff7eb6" },
      { name: "Amarillo", hex: "#ffd23f" },
      { name: "Blanco", hex: "#ffffff" },
      { name: "Noche", hex: "#1c1440" },
    ],
    fonts: {
      display: "Fredoka",
      body: "DM Sans",
      displayVar: "var(--font-fredoka)",
      bodyVar: "var(--font-dm-sans)",
    },
    voice: "Enérgica, directa y positiva, con frases cortas.",
    inspiredBy: ["Toca Boca", "Sago Mini", "Duolingo ABC"],
    layout: "playful",
    copy: {
      kicker: "¡Hola, emociones!",
      title: "Superpoderes emocionales en cada desafío",
      lead: "Decide, mira qué pasa y vuelve a intentarlo. Equivocarse también enseña: aquí nadie pierde, todos aprenden.",
      cta: "Probar EmotiAventuras",
      secondary: "Para colegios",
      howTitle: "Así de simple",
      learnTitle: "Tus 5 superpoderes",
      trustTitle: "Seguro de verdad",
      trustLead: "Sin anuncios. Sin compras reales. Sin rachas ni rankings. Solo aventura.",
      schoolTitle: "¿Eres un colegio?",
      schoolLead:
        "Acceso para tus aulas y para las familias, con un precio claro desde el primer día.",
    },
    tokens: {
      bg: "#ffffff",
      surface: "#f6f2ff",
      ink: "#1c1440",
      muted: "#4b4470",
      primary: "#6c4cf5",
      onPrimary: "#ffffff",
      accent: "#ff7eb6",
      soft: "#c6f36b",
      line: "#e7e0ff",
    },
  },
  {
    id: "editorial",
    name: "Editorial familiar",
    idea: "Sobria y premium, como una revista de crianza: convence por la calidad del contenido.",
    palette: [
      { name: "Hueso", hex: "#f6f1e9" },
      { name: "Ocre", hex: "#c99a3b" },
      { name: "Verde bosque", hex: "#2f5d50" },
      { name: "Rubor", hex: "#e9c2b4" },
      { name: "Tinta", hex: "#1e1c1a" },
      { name: "Gris piedra", hex: "#8a847b" },
    ],
    fonts: {
      display: "DM Serif Display",
      body: "Work Sans",
      displayVar: "var(--font-dm-serif)",
      bodyVar: "var(--font-work-sans)",
    },
    voice: "Reflexiva y cuidada: habla de crianza con respeto, sin exagerar ni prometer milagros.",
    inspiredBy: ["Lovevery", "Lingokids", "Smile and Learn"],
    layout: "editorial",
    copy: {
      kicker: "Crianza emocional · Edición 5 a 9 años",
      title: "Lo que no se enseña en una pizarra, se aprende viviéndolo",
      lead: "Frustración, amistad, miedo, límites. EmotiAventuras propone situaciones cotidianas para que tu hijo ensaye decisiones en un lugar seguro, y te da un panel para conversar después, sin notas ni comparaciones.",
      cta: "Descubrir EmotiAventuras",
      secondary: "Leer el enfoque",
      howTitle: "El recorrido",
      learnTitle: "Cinco habilidades, una conversación",
      trustTitle: "Nuestro compromiso",
      trustLead:
        "Diseñado para no capturar la atención a cualquier precio: sin rachas, anuncios ni recompensas por quedarse más tiempo.",
      schoolTitle: "Colegios",
      schoolLead:
        "Una licencia para el aula que llega también a casa: el colegio y la familia hablan el mismo idioma emocional.",
    },
    tokens: {
      bg: "#f6f1e9",
      surface: "#fffdf9",
      ink: "#1e1c1a",
      muted: "#5c5751",
      primary: "#2f5d50",
      onPrimary: "#ffffff",
      accent: "#c99a3b",
      soft: "#e9c2b4",
      line: "#e2d9cb",
    },
  },
  {
    id: "noche",
    name: "Noche de calma",
    idea: "Oscura y suave, con estrellas: el momento de calma antes de dormir.",
    palette: [
      { name: "Índigo noche", hex: "#1b1b3a" },
      { name: "Índigo", hex: "#2c2c5e" },
      { name: "Lavanda", hex: "#b9a9ff" },
      { name: "Luna", hex: "#ffe9a8" },
      { name: "Aurora", hex: "#7fe0c4" },
      { name: "Bruma", hex: "#e9e7ff" },
    ],
    fonts: {
      display: "Comfortaa",
      body: "Mulish",
      displayVar: "var(--font-comfortaa)",
      bodyVar: "var(--font-mulish)",
    },
    voice: "Suave y lenta, casi un susurro: invita a respirar y a bajar el ritmo.",
    inspiredBy: ["Moshi", "Headspace", "Breathe, Think, Do (Sesame)"],
    layout: "dark",
    copy: {
      kicker: "Respira. Siente. Elige.",
      title: "Un cielo tranquilo para las emociones grandes",
      lead: "Cuando el día fue difícil, el Bosque de la Calma espera con cuentos, respiración guiada y un semáforo de emociones. Y cuando hay energía, cuatro mundos de desafíos para practicar.",
      cta: "Entrar al Bosque de la Calma",
      secondary: "Para padres",
      howTitle: "De la emoción a la calma",
      learnTitle: "Lo que florece con la práctica",
      trustTitle: "Hecho para descansar, no para engancharse",
      trustLead:
        "Límite de uso diario configurable, sin rachas ni recompensas por quedarse más tiempo.",
      schoolTitle: "Para colegios y familias",
      schoolLead: "El colegio activa el acceso y cada familia lo continúa en casa, a su ritmo.",
    },
    tokens: {
      bg: "#1b1b3a",
      surface: "#2c2c5e",
      ink: "#f3f1ff",
      muted: "#c4c0e8",
      primary: "#ffe9a8",
      onPrimary: "#1b1b3a",
      accent: "#7fe0c4",
      soft: "#3a3a72",
      line: "#3d3d78",
    },
  },
];

export function landingById(id: string): LandingStyle | undefined {
  return LANDING_STYLES.find((style) => style.id === id);
}

/** Pasos, habilidades y garantías: textos reales del producto, iguales en las seis maquetas. */
export const HOW_STEPS = [
  {
    icon: "🎨",
    title: "Crea su personaje",
    text: "Elige un nombre de fantasía, su peinado y su ropa. No se pide ningún dato personal.",
  },
  {
    icon: "🗺️",
    title: "Recorre cuatro mundos",
    text: "El aula, el recreo, los paseos y la casa: 30 situaciones de la vida real.",
  },
  {
    icon: "💡",
    title: "Decide y ve qué pasa",
    text: "Cada alternativa tiene su consecuencia. Si no sale bien, se repara y se vuelve a intentar.",
  },
];

export const TRUST_POINTS = [
  { icon: "🔒", text: "Nada sale del dispositivo: sin cuentas ni datos personales" },
  { icon: "🚫", text: "Sin anuncios ni compras reales" },
  { icon: "🌱", text: "Sin rachas, rankings ni castigos por ausentarse" },
  { icon: "👪", text: "Panel de padres que acompaña: no diagnostica, no califica, no compara" },
  { icon: "🙋", text: "Botón «Necesito ayuda» siempre visible" },
  { icon: "⏱️", text: "Límite de uso diario configurable por un adulto" },
];

export const NUMBERS = [
  { value: "4", label: "mundos" },
  { value: "30", label: "situaciones" },
  { value: "150", label: "decisiones posibles" },
  { value: "6", label: "cuentos de calma" },
];
