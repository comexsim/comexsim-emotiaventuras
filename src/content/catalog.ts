import type {
  Accessory,
  Emotion,
  HairStyle,
  Reaction,
  Situation,
  Skill,
  Topic,
  WorldId,
} from "@/engine/types";

import { AULA } from "./situations/aula";
import { CASA } from "./situations/casa";
import { PASEOS } from "./situations/paseos";
import { RECREO } from "./situations/recreo";

/** Las 30 situaciones. Para agregar una historia basta con editar los archivos de `situations/`. */
export const SITUATIONS: Situation[] = [...AULA, ...RECREO, ...PASEOS, ...CASA];

export function situationById(id: number): Situation | undefined {
  return SITUATIONS.find((situation) => situation.id === id);
}

export interface WorldInfo {
  id: WorldId;
  name: string;
  theme: string;
  icon: string;
  tint: string;
}

export const WORLDS: WorldInfo[] = [
  {
    id: "aula",
    name: "Mi aula, mis desafíos",
    theme: "Frustración, aprendizaje, paciencia y autonomía",
    icon: "🏫",
    tint: "var(--sun)",
  },
  {
    id: "recreo",
    name: "El recreo de la amistad",
    theme: "Convivencia, conflictos, empatía y autocontrol",
    icon: "⚽",
    tint: "var(--leaf)",
  },
  {
    id: "paseos",
    name: "Grandes aventuras fuera del aula",
    theme: "Flexibilidad, seguridad, miedo e incertidumbre",
    icon: "🚌",
    tint: "var(--sky)",
  },
  {
    id: "casa",
    name: "Mi casa y mi familia",
    theme: "Límites, tecnología, convivencia y autonomía",
    icon: "🏡",
    tint: "var(--coral)",
  },
];

export const EMOTIONS: { id: Emotion; name: string; icon: string }[] = [
  { id: "alegria", name: "Alegría", icon: "😊" },
  { id: "tristeza", name: "Tristeza", icon: "😢" },
  { id: "enojo", name: "Enojo", icon: "😠" },
  { id: "miedo", name: "Miedo", icon: "😨" },
  { id: "verguenza", name: "Vergüenza", icon: "😳" },
];

export const SKILLS: { id: Skill; name: string; detail: string; icon: string }[] = [
  {
    id: "reconozco",
    name: "Reconozco mis emociones",
    detail: "Puedo identificar y nombrar lo que siento.",
    icon: "💖",
  },
  {
    id: "calma",
    name: "Encuentro mi calma",
    detail: "Conozco formas de regularme cuando lo necesito.",
    icon: "🌿",
  },
  {
    id: "resuelvo",
    name: "Resuelvo problemas",
    detail: "Busco soluciones sin lastimar.",
    icon: "🧩",
  },
  {
    id: "comprendo",
    name: "Comprendo a los demás",
    detail: "Reconozco cómo pueden sentirse otras personas.",
    icon: "🤝",
  },
  {
    id: "intento",
    name: "Lo intento otra vez",
    detail: "Aprendo de mis errores y practico nuevas estrategias.",
    icon: "🔁",
  },
];

export const TOPICS: Record<Topic, { name: string; family: string }> = {
  frustracion: {
    name: "Frustración",
    family:
      "¿Qué puede hacer el personaje cuando una actividad no sale como esperaba? ¿Qué estrategia podrían practicar juntos esta semana?",
  },
  problemas: {
    name: "Resolución de problemas",
    family:
      "Elijan un problema pequeño de la casa y piensen juntos tres formas distintas de resolverlo.",
  },
  empatia: {
    name: "Empatía",
    family:
      "¿Cómo creen que se sintió la otra persona de la historia? ¿Qué podrían decirle para acompañarla?",
  },
  calma: {
    name: "Calma",
    family:
      "¿Qué ayuda a cada uno de ustedes a calmarse? Practiquen juntos tres respiraciones lentas.",
  },
  comunicacion: {
    name: "Comunicación",
    family: "Practiquen decir «me siento… porque…» y escuchar la respuesta sin interrumpir.",
  },
  limites: {
    name: "Límites",
    family:
      "Conversen sobre un acuerdo de la casa, como el tiempo de pantalla, y cómo avisar antes de que termine.",
  },
  seguridad: {
    name: "Seguridad",
    family:
      "Repasen juntos quiénes son sus adultos de confianza y qué hacer si se separan en un lugar público.",
  },
};

/** Reparación que se ofrece tras una alternativa que causó daño (V1 §11): enseñar a reparar. */
export const REPAIR_BY_REACTION: Partial<Record<Reaction, string>> = {
  outburst: "Después de calmarse, se puede pedir perdón por el grito y contar qué pasa.",
  harm: "Se puede detener, preguntar si la otra persona está bien y pedir disculpas.",
  breakThing: "Se puede ayudar a recoger o arreglar lo que se dañó.",
  flee: "Se puede volver con un adulto y contar cómo se siente.",
  withdraw:
    "Se puede intentar de nuevo o contárselo a alguien de confianza cuando sienta que puede.",
  giveUp: "Se puede descansar un momento y volver a intentarlo con otra idea.",
  sneak: "Se puede devolver lo que se tomó y decir la verdad. Eso ayuda a recuperar la confianza.",
  blame: "Se puede contar lo que pasó de verdad y pedir disculpas.",
  insult: "Se puede pedir disculpas y decir con calma lo que molestó.",
};

/** Nombres de fantasía: se eligen de una lista para que el niño nunca escriba su nombre real. */
export const FANTASY_NAMES = [
  "Cometa",
  "Luna",
  "Nube",
  "Chispa",
  "Sol",
  "Trueno",
  "Estrella",
  "Coral",
  "Pixel",
  "Brisa",
  "Rayo",
  "Kiwi",
];

export const SKIN_TONES = ["#f7d6bf", "#eebd93", "#d99e6e", "#a9714a", "#7a4b2c", "#553220"];
export const HAIR_COLORS = ["#2b1d14", "#5a3620", "#a0642e", "#e2b44f", "#c6462f", "#7a5cd6"];
export const OUTFIT_COLORS = ["#ef6f5b", "#3fa7d6", "#59b87a", "#f5b83d", "#a06cd5", "#f27fb2"];
export const HAIR_STYLES: { id: HairStyle; name: string; icon: string }[] = [
  { id: "short", name: "Corto", icon: "💇" },
  { id: "curly", name: "Rizos", icon: "🌀" },
  { id: "long", name: "Largo", icon: "💁" },
  { id: "buns", name: "Moñitos", icon: "🎀" },
  { id: "spiky", name: "Puntas", icon: "⚡" },
  { id: "braids", name: "Trenzas", icon: "🎀" },
];

/**
 * Los 20 accesorios de la V2 §7. Los primeros seis y sus precios son los de la tienda del
 * documento; los demás, propuestos para la demo.
 */
export const ACCESSORIES: Accessory[] = [
  { id: "cap", name: "Gorra aventurera", slot: "head", price: 3, icon: "🧢" },
  { id: "funGlasses", name: "Lentes divertidos", slot: "face", price: 5, icon: "🕶️" },
  { id: "backpack", name: "Mochila arcoíris", slot: "back", price: 8, icon: "🎒" },
  { id: "fastShoes", name: "Zapatillas veloces", slot: "feet", price: 12, icon: "👟" },
  { id: "cape", name: "Capa de superhéroe", slot: "back", price: 20, icon: "🦸" },
  { id: "spaceSuit", name: "Traje espacial", slot: "outfit", price: 30, icon: "🚀" },
  { id: "starBand", name: "Diadema de estrellas", slot: "head", price: 2, icon: "⭐" },
  { id: "explorerHat", name: "Sombrero explorador", slot: "head", price: 4, icon: "🤠" },
  { id: "crown", name: "Corona de cartón", slot: "head", price: 6, icon: "👑" },
  { id: "wizardHat", name: "Gorro de mago", slot: "head", price: 9, icon: "🧙" },
  { id: "heartGlasses", name: "Lentes de corazón", slot: "face", price: 3, icon: "💕" },
  { id: "mask", name: "Antifaz de héroe", slot: "face", price: 6, icon: "🎭" },
  { id: "wings", name: "Alas de mariposa", slot: "back", price: 10, icon: "🦋" },
  { id: "rainBoots", name: "Botas de lluvia", slot: "feet", price: 4, icon: "🥾" },
  { id: "painterSuit", name: "Overol de artista", slot: "outfit", price: 5, icon: "🎨" },
  { id: "explorerSuit", name: "Traje de explorador", slot: "outfit", price: 8, icon: "🧭" },
  { id: "dinoSuit", name: "Traje de dinosaurio", slot: "outfit", price: 14, icon: "🦖" },
  { id: "chick", name: "Pollito amigo", slot: "companion", price: 3, icon: "🐥" },
  { id: "kitten", name: "Gatito estelar", slot: "companion", price: 7, icon: "🐱" },
  { id: "dragon", name: "Dragoncito", slot: "companion", price: 15, icon: "🐲" },
];

export function accessoryById(id: string | undefined): Accessory | undefined {
  return ACCESSORIES.find((item) => item.id === id);
}

/** `{n}` → nombre de fantasía. */
export function withName(text: string, name: string): string {
  return text.replaceAll("{n}", name);
}
