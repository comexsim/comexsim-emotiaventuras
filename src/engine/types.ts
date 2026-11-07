/** Tipos del dominio de EmotiAventuras. El contenido editable vive en `src/content/`. */
import type { DailyLimit, Level } from "@/content/rules";

export type WorldId = "aula" | "recreo" | "paseos" | "casa";

export type Emotion = "alegria" | "tristeza" | "enojo" | "miedo" | "verguenza";

/** Los cinco superpoderes emocionales (V1 §8). */
export type Skill = "reconozco" | "calma" | "resuelvo" | "comprendo" | "intento";

/** Temas que el panel de padres resume (V2 §6). */
export type Topic =
  "frustracion" | "problemas" | "empatia" | "calma" | "comunicacion" | "limites" | "seguridad";

/** Reacciones reutilizables de la escena (V2 §7): cada alternativa se muestra con una de ellas. */
export type Reaction =
  | "outburst"
  | "harm"
  | "breakThing"
  | "flee"
  | "withdraw"
  | "giveUp"
  | "sneak"
  | "blame"
  | "insult"
  | "ask"
  | "talk"
  | "breathe"
  | "retry"
  | "repair"
  | "safeWait";

export type SceneSet =
  "classroom" | "playground" | "busStop" | "museum" | "giftShop" | "park" | "home";

export type NpcRole = "teacher" | "adult" | "peer" | "peer2" | "sibling" | "staff";

export type PropId =
  | "notebook"
  | "drawing"
  | "pencil"
  | "paper"
  | "ball"
  | "toy"
  | "lunch"
  | "tablet"
  | "controller"
  | "blocks"
  | "remote"
  | "laptop"
  | "souvenir"
  | "plaster"
  | "none";

export interface Option {
  id: "A" | "B" | "C" | "D" | "E";
  /** Qué podría hacer el personaje. Redactada en lenguaje neutro. */
  text: string;
  /** Icono grande: los niños de 5 años no necesitan leer. */
  icon: string;
  react: Reaction;
  /** Qué sucede después; se narra y se muestra en la escena. Sin juzgar al niño. */
  consequence: string;
  /** Marcada en los datos; nunca se señala antes de que el niño decida (V2 §2). */
  recommended?: boolean;
}

export interface Situation {
  id: number;
  world: WorldId;
  title: string;
  /** Historia en tercera persona; `{n}` se reemplaza por el nombre de fantasía. */
  story: string;
  feels: Emotion[];
  /** Validar antes de corregir (V1 §11). */
  validation: string;
  learning: string;
  strategy: string;
  topic: Topic;
  skills: Skill[];
  set: SceneSet;
  npcs: NpcRole[];
  prop: PropId;
  /** Lluvia en la escena (situación 17). */
  rain?: boolean;
  options: Option[];
}

export interface HeartState {
  count: number;
  /** Instante desde el que corre la recuperación del próximo corazón. */
  anchor: number;
}

export interface SituationRecord {
  explored: Option["id"][];
  plays: number;
}

export type ActivityEntry =
  | {
      kind: "decision";
      at: number;
      situation: number;
      option: Option["id"];
      topic: Topic;
      skills: Skill[];
      earned: number;
    }
  | { kind: "story"; at: number; story: string };

export interface AvatarLook {
  name: string;
  skin: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfit: string;
}

export type HairStyle = "short" | "curly" | "long" | "buns" | "spiky" | "braids";

export type AccessorySlot = "head" | "face" | "back" | "feet" | "outfit" | "companion";

export interface Accessory {
  id: string;
  name: string;
  slot: AccessorySlot;
  /** Precio en monedas enteras. */
  price: number;
  icon: string;
}

export interface Settings {
  level: Level;
  dailyLimit: DailyLimit;
  /** 0 a 1. */
  volume: number;
  subtitles: boolean;
  narration: boolean;
}

/** Todo lo que se conserva entre sesiones (V1 §12), solo en este navegador. */
export interface SaveData {
  version: 1;
  avatar: AvatarLook | null;
  /** Cuartos de moneda. */
  coins: number;
  hearts: HeartState;
  owned: string[];
  equipped: Partial<Record<AccessorySlot, string>>;
  records: Record<number, SituationRecord>;
  log: ActivityEntry[];
  /** Segundos de uso por día local (`AAAA-MM-DD`). */
  usage: Record<string, number>;
  settings: Settings;
}
