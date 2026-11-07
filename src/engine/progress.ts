import type { DailyLimit } from "@/content/rules";

import { settleHearts } from "./hearts";
import type { ActivityEntry, HeartState, SaveData, Skill, SituationRecord, Topic } from "./types";

/** Cómo puede entrar el niño a una situación. Ninguna salida es una pantalla de derrota. */
export type Entry = "heart" | "practice" | "forest" | "rest";

/**
 * Lo ya vivido se practica gratis y sin límite (V1 §3); lo nuevo usa un corazón. Sin corazones se
 * invita al Bosque; con el límite del adulto cumplido se invita a descansar. Un desafío ya abierto
 * nunca se interrumpe: esto solo se consulta al entrar.
 */
export function entryFor(input: {
  record: SituationRecord | undefined;
  hearts: HeartState;
  now: number;
  usedSecondsToday: number;
  dailyLimit: DailyLimit;
}): Entry {
  const { record, hearts, now, usedSecondsToday, dailyLimit } = input;
  if (dailyLimit !== null && usedSecondsToday >= dailyLimit * 60) return "rest";
  if (record && record.plays > 0) return "practice";
  return settleHearts(hearts, now).count > 0 ? "heart" : "forest";
}

/** Día local del dispositivo como `AAAA-MM-DD`: el límite se piensa en días de la familia. */
export function dayKey(now: number): string {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addUsage(usage: SaveData["usage"], now: number, seconds: number) {
  const key = dayKey(now);
  return { ...usage, [key]: (usage[key] ?? 0) + seconds };
}

export type Range = "week" | "month";

const DAY_MS = 24 * 60 * 60 * 1000;
const RANGE_DAYS: Record<Range, number> = { week: 7, month: 30 };

export interface ParentSummary {
  situations: number;
  stories: number;
  usageSeconds: number;
  earnedQuarters: number;
  topics: { topic: Topic; count: number }[];
}

/**
 * Resumen del panel de padres: actividades, nunca calificaciones ni diagnósticos (V2 §6). Las
 * situaciones se cuentan una vez aunque se hayan explorado varias alternativas.
 */
export function summarize(
  log: ActivityEntry[],
  usage: SaveData["usage"],
  now: number,
  range: Range,
): ParentSummary {
  const days = RANGE_DAYS[range];
  const since = now - days * DAY_MS;
  const inRange = log.filter((entry) => entry.at >= since && entry.at <= now);
  const situations = new Set<number>();
  const counts = new Map<Topic, number>();
  let stories = 0;
  let earnedQuarters = 0;
  for (const entry of inRange) {
    if (entry.kind === "story") {
      stories += 1;
      continue;
    }
    situations.add(entry.situation);
    earnedQuarters += entry.earned;
    counts.set(entry.topic, (counts.get(entry.topic) ?? 0) + 1);
  }
  let usageSeconds = 0;
  for (let i = 0; i < days; i += 1) usageSeconds += usage[dayKey(now - i * DAY_MS)] ?? 0;
  const topics = [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
  return { situations: situations.size, stories, usageSeconds, earnedQuarters, topics };
}

/** Veces que se practicó cada superpoder. Se muestra como práctica, sin etiquetar (V1 §8). */
export function skillCounts(log: ActivityEntry[]): Record<Skill, number> {
  const counts: Record<Skill, number> = {
    reconozco: 0,
    calma: 0,
    resuelvo: 0,
    comprendo: 0,
    intento: 0,
  };
  for (const entry of log) {
    if (entry.kind !== "decision") continue;
    for (const skill of entry.skills) counts[skill] += 1;
  }
  return counts;
}

/** Pregunta para confirmar que hay un adulto (V2 §6). `seed` entra desde afuera: motor puro. */
export function adultCheck(seed: number) {
  const a = 6 + (Math.abs(Math.trunc(seed)) % 4);
  const b = 7 + (Math.abs(Math.trunc(seed / 7)) % 3);
  return { a, b, answer: a * b };
}
