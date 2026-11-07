/**
 * Reglas de EmotiAventuras como datos (documento V2.0, §1, §5 y §7). Los montos se guardan en
 * cuartos de moneda (enteros) para que 0,25 nunca acumule errores de coma flotante.
 */
export const QUARTERS_PER_COIN = 4;

export const ECONOMY = {
  /** +1 moneda por la alternativa recomendada. */
  recommended: 4,
  /** +0,25 monedas por explorar cualquier otra alternativa, una sola vez por alternativa. */
  explored: 1,
} as const;

export const HEARTS = {
  max: 5,
  /** Se recupera un corazón cada 60 minutos. */
  recoveryMs: 60 * 60 * 1000,
} as const;

/** Monedas de la demostración de la tienda del documento (25 ficticias). */
export const DEMO_COINS_QUARTERS = 25 * QUARTERS_PER_COIN;

/** Alternativas visibles por nivel orientativo (V1 §7; V2 fija 5 como máximo). */
export const OPTIONS_BY_LEVEL = { 1: 3, 2: 4, 3: 5 } as const;

export type Level = keyof typeof OPTIONS_BY_LEVEL;

/** Opciones del límite de uso diario que configura un adulto; `null` es sin límite. */
export const DAILY_LIMIT_CHOICES = [15, 30, 45, 60, null] as const;
export type DailyLimit = (typeof DAILY_LIMIT_CHOICES)[number];
