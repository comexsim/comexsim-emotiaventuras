/**
 * Animaciones reutilizables de los personajes (V2 §7), como funciones puras del tiempo: se prueban
 * sin WebGL. Una agresión nunca se muestra con contacto ni como algo divertido (V2 §5): el gesto se
 * queda a distancia y lo que se ve es cómo reacciona la otra persona.
 */
import type { Emotion, Reaction } from "@/engine/types";

export interface Pose {
  /** Elevación de cada brazo: 0 abajo, π arriba. */
  armL: number;
  armR: number;
  /** Apertura lateral de cada brazo. */
  spreadL: number;
  spreadR: number;
  /** Inclinación del cuerpo hacia adelante. */
  lean: number;
  bob: number;
  /** Desplazamiento desde la marca del personaje. */
  x: number;
  z: number;
  /** Giro extra respecto de su orientación. */
  turn: number;
  headNod: number;
  headTurn: number;
  stride: number;
  /** 1 de pie, 0,6 agachado. */
  height: number;
}

export const REST: Pose = {
  armL: 0,
  armR: 0,
  spreadL: 0.08,
  spreadR: 0.08,
  lean: 0,
  bob: 0,
  x: 0,
  z: 0,
  turn: 0,
  headNod: 0,
  headTurn: 0,
  stride: 0,
  height: 1,
};

export type ClipId =
  | "idle"
  | "wave"
  | "worry"
  | "stomp"
  | "shove"
  | "throw"
  | "run"
  | "hide"
  | "slump"
  | "sneak"
  | "point"
  | "raiseHand"
  | "talk"
  | "breathe"
  | "retry"
  | "repair"
  | "stop"
  | "stepBack"
  | "approach"
  | "nod"
  | "sad"
  | "cheer"
  | "look"
  | "sit";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const ease = (value: number) => {
  const k = clamp01(value);
  return k * k * (3 - 2 * k);
};

const CLIPS: Record<ClipId, (t: number) => Partial<Pose>> = {
  idle: (t) => ({
    bob: Math.sin(t * 2) * 0.008,
    armL: 0.04 + Math.sin(t * 2) * 0.03,
    armR: 0.04 - Math.sin(t * 2) * 0.03,
    headTurn: Math.sin(t * 0.7) * 0.08,
  }),
  wave: (t) => ({
    armR: 2.7,
    spreadR: 0.3 + Math.sin(t * 8) * 0.35,
    bob: Math.abs(Math.sin(t * 4)) * 0.03,
    headTurn: Math.sin(t) * 0.1,
  }),
  worry: (t) => ({
    armL: 2.1,
    armR: 2.1,
    spreadL: -0.32,
    spreadR: -0.32,
    headNod: 0.22,
    lean: 0.06,
    headTurn: Math.sin(t * 1.5) * 0.14,
    bob: Math.sin(t * 3) * 0.006,
  }),
  stomp: (t) => {
    const k = ease(t / 0.4);
    const calm = ease((t - 3.2) / 1);
    const shake = Math.sin(t * 14) * (1 - calm);
    return {
      stride: shake * 0.35 * k,
      armL: 0.5 * k * (1 - calm),
      armR: 0.5 * k * (1 - calm),
      spreadL: 0.45,
      spreadR: 0.45,
      lean: 0.1 * k * (1 - calm),
      bob: Math.abs(shake) * 0.03,
      headNod: -0.08 + calm * 0.2,
    };
  },
  shove: (t) => {
    const go = ease(t / 0.45) * (1 - ease((t - 0.75) / 0.6));
    return {
      armL: 1.5 * go,
      armR: 1.5 * go,
      lean: 0.24 * go,
      x: 0.18 * go,
      headNod: 0.12 * ease((t - 1.3) / 1),
    };
  },
  throw: (t) => {
    const up = ease(t / 0.5);
    const down = ease((t - 0.55) / 0.22);
    return {
      armR: 2.7 * up * (1 - down) + 0.3 * down,
      armL: 0.3,
      lean: 0.2 * down,
      headNod: 0.05 + 0.22 * ease((t - 1.4) / 1),
      stride: 0,
    };
  },
  run: (t) => {
    const k = ease(t / 0.3);
    return {
      x: -Math.max(0, t - 0.15) * 2.4,
      turn: -1.4 * k,
      stride: Math.sin(t * 15) * 0.8 * k,
      armL: 0.5 + Math.sin(t * 15) * 0.5 * k,
      armR: 0.5 - Math.sin(t * 15) * 0.5 * k,
      lean: 0.25 * k,
      bob: Math.abs(Math.sin(t * 15)) * 0.05,
    };
  },
  hide: (t) => {
    const k = ease(t / 0.7);
    return {
      height: 1 - 0.32 * k,
      armL: 2.5 * k,
      armR: 2.5 * k,
      spreadL: -0.28,
      spreadR: -0.28,
      headNod: 0.45 * k,
      x: -0.25 * k,
      z: -0.3 * k,
      turn: 0.2 * k,
    };
  },
  slump: (t) => {
    const k = ease(t / 1.1);
    return {
      height: 1 - 0.1 * k,
      lean: 0.24 * k,
      headNod: 0.42 * k,
      armL: 0,
      armR: 0,
      bob: Math.sin(t * 1.4) * 0.004,
    };
  },
  sneak: (t) => {
    const k = ease(t / 0.5);
    return {
      headTurn: Math.sin(t * 2.2) * 0.6 * k,
      lean: 0.14 * k,
      armR: 0.7 * k,
      spreadR: -0.3 * k,
      x: 0.1 * Math.sin(t * 0.6),
      height: 1 - 0.05 * k,
    };
  },
  point: (t) => {
    const k = ease(t / 0.35);
    const calm = ease((t - 2.8) / 0.9);
    return {
      armR: 1.55 * k * (1 - calm),
      spreadR: 0,
      lean: 0.08 * k * (1 - calm),
      stride: Math.sin(t * 9) * 0.1 * (1 - calm),
      bob: Math.abs(Math.sin(t * 9)) * 0.012 * (1 - calm),
      headNod: calm * 0.2,
    };
  },
  raiseHand: (t) => {
    const up = ease(t / 0.5);
    const down = ease((t - 2.1) / 0.5);
    return {
      armR: 2.95 * up * (1 - down),
      spreadR: 0.14,
      bob: Math.abs(Math.sin(t * 5)) * 0.018 * (1 - down),
      headNod: -0.08,
      headTurn: 0.3 * down,
    };
  },
  talk: (t) => ({
    armR: 1 + Math.sin(t * 3.4) * 0.35,
    armL: 0.45 + Math.sin(t * 2.6) * 0.2,
    spreadR: 0.3,
    spreadL: 0.3,
    headNod: Math.sin(t * 3.6) * 0.07,
    bob: Math.sin(t * 3.6) * 0.01,
    lean: 0.02,
  }),
  breathe: (t) => {
    const breath = (Math.sin(t * 1.4 - 1.5) + 1) / 2;
    return {
      armL: 0.4 + breath * 0.8,
      armR: 0.4 + breath * 0.8,
      spreadL: 0.45,
      spreadR: 0.45,
      bob: breath * 0.035,
      headNod: -0.1 * breath + 0.06,
    };
  },
  retry: (t) => {
    const work = 1 - ease((t - 2.7) / 0.5);
    const joy = ease((t - 2.8) / 0.4);
    return {
      armR: 1.15 * work + Math.sin(t * 7) * 0.2 * work + 2.7 * joy,
      armL: 0.9 * work + 2.7 * joy,
      spreadL: 0.2 + 0.2 * joy,
      spreadR: 0.2 + 0.2 * joy,
      lean: 0.14 * work,
      headNod: 0.2 * work - 0.1 * joy,
      bob: joy * Math.abs(Math.sin(t * 6)) * 0.06,
    };
  },
  repair: (t) => {
    const k = ease(t / 0.5);
    const up = ease((t - 2.8) / 0.5);
    return {
      height: 1 - 0.22 * k * (1 - up),
      lean: 0.34 * k * (1 - up),
      armL: 1 * k * (1 - up),
      armR: 1 + Math.sin(t * 6) * 0.3 * k * (1 - up),
      headNod: 0.24 * k * (1 - up),
    };
  },
  stop: (t) => {
    const up = ease(t / 0.35);
    const down = ease((t - 2) / 0.5);
    const away = ease((t - 2.2) / 1.1);
    return { armR: 1.65 * up * (1 - down), spreadR: 0.05, x: -0.45 * away, headNod: -0.04 };
  },
  stepBack: (t) => {
    const k = ease((t - 0.45) / 0.7);
    return {
      x: 0.5 * k,
      stride: Math.sin(t * 8) * 0.3 * (k > 0 && k < 1 ? 1 : 0),
      armL: 1.1 * k,
      armR: 1.1 * k,
      spreadL: 0.1,
      spreadR: 0.1,
      headNod: 0.12 * k,
      lean: -0.08 * k,
    };
  },
  approach: (t) => {
    const k = ease((t - 0.7) / 1.2);
    const moving = k > 0 && k < 1;
    return {
      x: -0.42 * k,
      stride: moving ? Math.sin(t * 7) * 0.4 : 0,
      armR: k > 0.95 ? 0.8 + Math.sin(t * 3) * 0.2 : 0,
      headNod: k > 0.95 ? Math.sin(t * 3.4) * 0.07 : 0,
      lean: 0.04 * k,
    };
  },
  nod: (t) => ({
    headNod: Math.sin(t * 4.2) * 0.1,
    bob: Math.sin(t * 4.2) * 0.006,
    armL: 0.25,
    armR: 0.25,
  }),
  sad: (t) => {
    const k = ease((t - 0.3) / 0.8);
    return {
      headNod: 0.36 * k,
      lean: 0.1 * k,
      armL: 0.08,
      armR: 0.08,
      bob: Math.sin(t * 1.3) * 0.004,
    };
  },
  cheer: (t) => {
    const k = ease((t - 2.8) / 0.4);
    return {
      armL: 1.7 * k,
      armR: 1.7 * k,
      spreadL: 0.16 + Math.sin(t * 9) * 0.14 * k,
      spreadR: 0.16 + Math.sin(t * 9) * 0.14 * k,
      bob: k * Math.abs(Math.sin(t * 6)) * 0.03,
      headNod: Math.sin(t * 2) * 0.05,
    };
  },
  look: (t) => ({ headTurn: Math.sin(t * 1.3) * 0.5, armL: 0.1, armR: 0.5 }),
  sit: () => ({ height: 0.74, armL: 1, armR: 1, headNod: 0.14 }),
};

export function poseAt(clip: ClipId, t: number): Pose {
  return { ...REST, ...CLIPS[clip](Math.max(t, 0)) };
}

/** Cómo se ve cada alternativa: gesto y cara del personaje, reacción de los demás y objeto. */
export interface Staging {
  me: ClipId;
  meFace: Emotion | "calm";
  them: ClipId;
  themFace: Emotion | "calm";
  /** El objeto se cae. */
  drop?: boolean;
  /** Brillo suave: solo en estrategias útiles, nunca en una agresión. */
  sparkle?: boolean;
}

export const STAGING: Record<Reaction, Staging> = {
  outburst: { me: "stomp", meFace: "enojo", them: "stepBack", themFace: "miedo" },
  harm: { me: "shove", meFace: "enojo", them: "stepBack", themFace: "tristeza" },
  breakThing: { me: "throw", meFace: "enojo", them: "stepBack", themFace: "miedo", drop: true },
  flee: { me: "run", meFace: "miedo", them: "look", themFace: "miedo" },
  withdraw: { me: "hide", meFace: "tristeza", them: "look", themFace: "tristeza" },
  giveUp: { me: "slump", meFace: "tristeza", them: "sad", themFace: "tristeza" },
  sneak: { me: "sneak", meFace: "verguenza", them: "look", themFace: "tristeza" },
  blame: { me: "point", meFace: "enojo", them: "sad", themFace: "tristeza" },
  insult: { me: "point", meFace: "enojo", them: "sad", themFace: "tristeza" },
  ask: { me: "raiseHand", meFace: "calm", them: "approach", themFace: "alegria", sparkle: true },
  talk: { me: "talk", meFace: "calm", them: "nod", themFace: "alegria", sparkle: true },
  breathe: { me: "breathe", meFace: "calm", them: "nod", themFace: "alegria", sparkle: true },
  retry: { me: "retry", meFace: "alegria", them: "cheer", themFace: "alegria", sparkle: true },
  repair: { me: "repair", meFace: "alegria", them: "nod", themFace: "alegria", sparkle: true },
  safeWait: { me: "stop", meFace: "calm", them: "approach", themFace: "alegria", sparkle: true },
};
