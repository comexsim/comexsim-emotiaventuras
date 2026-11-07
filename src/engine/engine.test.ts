import { describe, expect, it } from "vitest";

import { HEARTS } from "@/content/rules";

import { formatCoins, purchase, rewardFor, visibleOptions } from "./economy";
import { initialHearts, nextHeartIn, settleHearts, spendHeart } from "./hearts";
import { addUsage, adultCheck, dayKey, entryFor, skillCounts, summarize } from "./progress";
import type { Accessory, ActivityEntry, Option, Situation } from "./types";

const HOUR = HEARTS.recoveryMs;
const T0 = Date.UTC(2026, 10, 7, 12);

const option = (id: Option["id"], recommended = false): Option => ({
  id,
  text: id,
  icon: "🙂",
  react: recommended ? "talk" : "outburst",
  consequence: id,
  recommended,
});

const situation: Situation = {
  id: 1,
  world: "aula",
  title: "",
  story: "",
  feels: ["enojo"],
  validation: "",
  learning: "",
  strategy: "",
  topic: "frustracion",
  skills: ["resuelvo"],
  set: "classroom",
  npcs: [],
  prop: "none",
  options: [option("A"), option("B"), option("C", true), option("D"), option("E")],
};

describe("corazones", () => {
  it("EA-H1: se empieza con cinco corazones", () => {
    expect(initialHearts(T0).count).toBe(5);
  });

  it("EA-H2: se recupera uno por hora hasta un máximo de cinco", () => {
    const low = { count: 1, anchor: T0 };
    expect(settleHearts(low, T0 + HOUR - 1).count).toBe(1);
    expect(settleHearts(low, T0 + HOUR).count).toBe(2);
    expect(settleHearts(low, T0 + 3 * HOUR + 10).count).toBe(4);
    expect(settleHearts(low, T0 + 40 * HOUR).count).toBe(5);
  });

  it("EA-H3: conserva el tiempo parcial hacia el próximo corazón", () => {
    const settled = settleHearts({ count: 0, anchor: T0 }, T0 + HOUR + 600);
    expect(settled).toEqual({ count: 1, anchor: T0 + HOUR });
    expect(nextHeartIn(settled, T0 + HOUR + 600)).toBe(HOUR - 600);
  });

  it("EA-H4: el reloj hacia atrás no quita ni regala corazones", () => {
    expect(settleHearts({ count: 2, anchor: T0 }, T0 - HOUR * 5)).toEqual({
      count: 2,
      anchor: T0 - HOUR * 5,
    });
  });

  it("EA-H5: gastar sin corazones devuelve null y nunca deja números negativos", () => {
    expect(spendHeart({ count: 0, anchor: T0 }, T0)).toBeNull();
    expect(spendHeart({ count: 1, anchor: T0 }, T0)?.count).toBe(0);
  });

  it("EA-H6: gastar con el máximo inicia la cuenta en ese instante", () => {
    const spent = spendHeart(initialHearts(T0), T0 + 5 * HOUR);
    expect(spent).toEqual({ count: 4, anchor: T0 + 5 * HOUR });
    expect(nextHeartIn(spent!, T0 + 5 * HOUR)).toBe(HOUR);
  });
});

describe("monedas", () => {
  it("EA-M1: +1 por la recomendada y +0,25 por explorar otra", () => {
    expect(rewardFor(option("C", true), undefined)).toBe(4);
    expect(rewardFor(option("A"), undefined)).toBe(1);
  });

  it("EA-M2: la recompensa se concede una sola vez por alternativa", () => {
    const record = { explored: ["A", "C"] as Option["id"][], plays: 2 };
    expect(rewardFor(option("A"), record)).toBe(0);
    expect(rewardFor(option("C", true), record)).toBe(0);
    expect(rewardFor(option("B"), record)).toBe(1);
  });

  it("EA-M3: una situación completa nunca entrega más de 2 monedas", () => {
    let total = 0;
    const explored: Option["id"][] = [];
    for (const current of situation.options) {
      total += rewardFor(current, { explored, plays: 1 });
      total += rewardFor(current, { explored: [...explored, current.id], plays: 1 });
      explored.push(current.id);
    }
    expect(total).toBe(8);
  });

  it("EA-M4: los bordes de los cuartos de moneda se muestran exactos", () => {
    expect(formatCoins(0)).toBe("0");
    expect(formatCoins(1)).toBe("0,25");
    expect(formatCoins(2)).toBe("0,50");
    expect(formatCoins(39)).toBe("9,75");
    expect(formatCoins(50)).toBe("12,50");
    expect(formatCoins(100)).toBe("25");
  });

  const cape: Accessory = { id: "cape", name: "", slot: "back", price: 20, icon: "" };

  it("EA-M5: se compra con monedas virtuales suficientes y se agrega al inventario", () => {
    expect(purchase({ coins: 100, owned: [] }, cape)).toEqual({
      ok: true,
      coins: 20,
      owned: ["cape"],
    });
  });

  it("EA-M6: justo con el precio alcanza; con un cuarto menos no alcanza", () => {
    expect(purchase({ coins: 80, owned: [] }, cape).ok).toBe(true);
    expect(purchase({ coins: 79, owned: [] }, cape)).toEqual({
      ok: false,
      reason: "not-enough-coins",
    });
  });

  it("EA-M7: lo que ya se tiene no se cobra dos veces", () => {
    expect(purchase({ coins: 400, owned: ["cape"] }, cape)).toEqual({
      ok: false,
      reason: "already-owned",
    });
  });
});

describe("niveles", () => {
  it("EA-N1: cada nivel muestra 3, 4 o 5 alternativas e incluye siempre la recomendada", () => {
    for (const [level, count] of [
      [1, 3],
      [2, 4],
      [3, 5],
    ] as const) {
      const visible = visibleOptions(situation, level);
      expect(visible).toHaveLength(count);
      expect(visible.some((item) => item.recommended)).toBe(true);
    }
  });

  it("EA-N2: el recorte conserva el orden, para no delatar la recomendada", () => {
    expect(visibleOptions(situation, 1).map((item) => item.id)).toEqual(["A", "B", "C"]);
  });
});

describe("entrada a un desafío", () => {
  const base = {
    record: undefined,
    hearts: initialHearts(T0),
    now: T0,
    usedSecondsToday: 0,
    dailyLimit: 30 as const,
  };

  it("EA-E1: lo nuevo usa un corazón", () => {
    expect(entryFor(base)).toBe("heart");
  });

  it("EA-E2: sin corazones se invita al Bosque de la Calma, sin derrota", () => {
    expect(entryFor({ ...base, hearts: { count: 0, anchor: T0 } })).toBe("forest");
  });

  it("EA-E3: lo ya vivido se practica gratis aunque no queden corazones", () => {
    expect(
      entryFor({
        ...base,
        record: { explored: ["A"], plays: 1 },
        hearts: { count: 0, anchor: T0 },
      }),
    ).toBe("practice");
  });

  it("EA-E4: el límite del adulto invita a descansar; sin límite, nunca", () => {
    expect(entryFor({ ...base, usedSecondsToday: 30 * 60 })).toBe("rest");
    expect(entryFor({ ...base, usedSecondsToday: 30 * 60 - 1 })).toBe("heart");
    expect(entryFor({ ...base, usedSecondsToday: 999_999, dailyLimit: null })).toBe("heart");
  });
});

describe("panel de padres", () => {
  const decision = (at: number, id: number, earned: number): ActivityEntry => ({
    kind: "decision",
    at,
    situation: id,
    option: "A",
    topic: id % 2 ? "frustracion" : "empatia",
    skills: ["calma", "intento"],
    earned,
  });

  it("EA-P1: cuenta situaciones únicas, cuentos, monedas y temas del período", () => {
    const log: ActivityEntry[] = [
      decision(T0 - 1000, 1, 4),
      decision(T0 - 900, 1, 1),
      decision(T0 - 800, 3, 1),
      decision(T0 - 700, 2, 4),
      { kind: "story", at: T0 - 600, story: "volcan" },
      decision(T0 - 40 * 24 * HOUR, 5, 4),
    ];
    const summary = summarize(log, {}, T0, "week");
    expect(summary.situations).toBe(3);
    expect(summary.stories).toBe(1);
    expect(summary.earnedQuarters).toBe(10);
    expect(summary.topics[0]).toEqual({ topic: "frustracion", count: 3 });
  });

  it("EA-P2: la semana y el mes separan el uso y la actividad", () => {
    const old = T0 - 10 * 24 * HOUR;
    const usage = addUsage(addUsage({}, T0, 60), old, 120);
    const log = [decision(old, 1, 4)];
    expect(summarize(log, usage, T0, "week").usageSeconds).toBe(60);
    expect(summarize(log, usage, T0, "week").situations).toBe(0);
    expect(summarize(log, usage, T0, "month").usageSeconds).toBe(180);
    expect(summarize(log, usage, T0, "month").situations).toBe(1);
  });

  it("EA-P3: el uso se acumula por día", () => {
    expect(addUsage(addUsage({}, T0, 30), T0, 15)[dayKey(T0)]).toBe(45);
  });

  it("EA-S1: los superpoderes cuentan práctica por habilidad", () => {
    const counts = skillCounts([decision(T0, 1, 1), decision(T0, 2, 1)]);
    expect(counts.calma).toBe(2);
    expect(counts.comprendo).toBe(0);
  });

  it("EA-P4: la verificación de adulto es determinista y de multiplicar", () => {
    expect(adultCheck(12345)).toEqual(adultCheck(12345));
    const { a, b, answer } = adultCheck(987654);
    expect(answer).toBe(a * b);
    expect(a).toBeGreaterThanOrEqual(6);
    expect(b).toBeGreaterThanOrEqual(7);
  });
});
