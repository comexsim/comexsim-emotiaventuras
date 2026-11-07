import { ECONOMY, QUARTERS_PER_COIN, OPTIONS_BY_LEVEL, type Level } from "@/content/rules";

import type { Accessory, Option, SaveData, Situation, SituationRecord } from "./types";

/**
 * Recompensa de una decisión: +1 por la recomendada y +0,25 por explorar otra. Se concede una sola
 * vez por alternativa, para no acumular monedas repitiendo una conducta perjudicial (V2 §5).
 */
export function rewardFor(option: Option, record: SituationRecord | undefined): number {
  if (record?.explored.includes(option.id)) return 0;
  return option.recommended ? ECONOMY.recommended : ECONOMY.explored;
}

/** Monedas para mostrar, con coma decimal solo si hace falta: 4 → «1», 1 → «0,25». */
export function formatCoins(quarters: number): string {
  const whole = Math.floor(quarters / QUARTERS_PER_COIN);
  const rest = quarters % QUARTERS_PER_COIN;
  if (rest === 0) return String(whole);
  return `${whole},${String(rest * 25).padStart(2, "0")}`;
}

export type PurchaseResult =
  | { ok: true; coins: number; owned: string[] }
  | { ok: false; reason: "already-owned" | "not-enough-coins" };

/** Compra con monedas virtuales: no existe ninguna vía de dinero real (V1 §11). */
export function purchase(
  state: Pick<SaveData, "coins" | "owned">,
  item: Accessory,
): PurchaseResult {
  if (state.owned.includes(item.id)) return { ok: false, reason: "already-owned" };
  const cost = item.price * QUARTERS_PER_COIN;
  if (state.coins < cost) return { ok: false, reason: "not-enough-coins" };
  return { ok: true, coins: state.coins - cost, owned: [...state.owned, item.id] };
}

/**
 * Alternativas visibles según el nivel orientativo: siempre incluye la recomendada, sin moverla de
 * su lugar, para que el orden no la delate.
 */
export function visibleOptions(situation: Situation, level: Level): Option[] {
  const limit = OPTIONS_BY_LEVEL[level];
  const others = situation.options.filter((option) => !option.recommended).slice(0, limit - 1);
  return situation.options.filter((option) => option.recommended || others.includes(option));
}
