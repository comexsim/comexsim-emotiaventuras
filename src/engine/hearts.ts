import { HEARTS } from "@/content/rules";

import type { HeartState } from "./types";

/** Corazones al empezar: los cinco del documento, con el reloj de recuperación en `now`. */
export function initialHearts(now: number): HeartState {
  return { count: HEARTS.max, anchor: now };
}

/**
 * Aplica la recuperación pendiente: uno por hora hasta el máximo. Si el reloj del dispositivo
 * retrocede, reinicia la cuenta en lugar de quitar o regalar corazones.
 */
export function settleHearts(state: HeartState, now: number): HeartState {
  if (state.count >= HEARTS.max) return { count: HEARTS.max, anchor: now };
  if (now < state.anchor) return { count: state.count, anchor: now };
  const gained = Math.floor((now - state.anchor) / HEARTS.recoveryMs);
  const count = Math.min(HEARTS.max, state.count + gained);
  return {
    count,
    anchor: count === HEARTS.max ? now : state.anchor + gained * HEARTS.recoveryMs,
  };
}

/**
 * Gasta un corazón al comenzar un desafío nuevo: nunca por elegir, equivocarse ni pedir ayuda
 * (V1 §3). Devuelve `null` si no quedan, y entonces se invita al Bosque de la Calma.
 */
export function spendHeart(state: HeartState, now: number): HeartState | null {
  const settled = settleHearts(state, now);
  if (settled.count === 0) return null;
  return { count: settled.count - 1, anchor: settled.anchor };
}

/** Milisegundos para el próximo corazón; 0 si ya están todos. */
export function nextHeartIn(state: HeartState, now: number): number {
  const settled = settleHearts(state, now);
  if (settled.count >= HEARTS.max) return 0;
  return settled.anchor + HEARTS.recoveryMs - now;
}
