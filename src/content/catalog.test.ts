import { describe, expect, it } from "vitest";

import { ACCESSORIES, REPAIR_BY_REACTION, SITUATIONS, SKILLS, WORLDS } from "./catalog";
import { STORIES } from "./stories";

describe("banco de situaciones (alcance V2 §7)", () => {
  it("EA-C1: hay 30 situaciones y 150 alternativas, numeradas de 1 a 30", () => {
    expect(SITUATIONS).toHaveLength(30);
    expect(SITUATIONS.map((item) => item.id)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(SITUATIONS.flatMap((item) => item.options)).toHaveLength(150);
  });

  it("EA-C2: los cuatro mundos tienen 8, 8, 6 y 8 situaciones", () => {
    const count = (world: string) => SITUATIONS.filter((item) => item.world === world).length;
    expect(WORLDS.map((world) => count(world.id))).toEqual([8, 8, 6, 8]);
  });

  it.each(SITUATIONS.map((item) => [item.id, item] as const))(
    "EA-C3: la situación %i tiene A–E, una recomendada y consecuencias completas",
    (_, situation) => {
      expect(situation.options.map((option) => option.id)).toEqual(["A", "B", "C", "D", "E"]);
      expect(situation.options.filter((option) => option.recommended)).toHaveLength(1);
      for (const option of situation.options) {
        expect(option.text.length).toBeGreaterThan(3);
        expect(option.icon.length).toBeGreaterThan(0);
        expect(option.consequence.length).toBeGreaterThan(10);
      }
      expect(situation.feels.length).toBeGreaterThan(0);
      expect(situation.skills.length).toBeGreaterThanOrEqual(1);
      expect(situation.skills.length).toBeLessThanOrEqual(2);
      expect(situation.validation.length).toBeGreaterThan(5);
      expect(situation.learning.length).toBeGreaterThan(5);
    },
  );

  it("EA-C4: toda alternativa no recomendada tiene una forma de reparar", () => {
    for (const option of SITUATIONS.flatMap((item) => item.options)) {
      if (!option.recommended) expect(REPAIR_BY_REACTION[option.react]).toBeTruthy();
    }
  });

  it("EA-C5: ningún texto usa mensajes que avergüenzan (V1 §3)", () => {
    const banned = /eres mal|fallaste|no sabes controlar|mal[oa] (niñ|person)|fracas/i;
    const texts = SITUATIONS.flatMap((item) => [
      item.validation,
      item.learning,
      ...item.options.map((option) => option.consequence),
    ]);
    for (const text of texts) expect(text).not.toMatch(banned);
  });

  it("EA-C6: las recompensas posibles se ofrecen sin marcar la recomendada por posición", () => {
    const positions = new Set(
      SITUATIONS.map((item) => item.options.findIndex((option) => option.recommended)),
    );
    expect(positions.size).toBeGreaterThanOrEqual(4);
  });
});

describe("catálogos", () => {
  it("EA-C7: hay 20 accesorios con precio positivo e identificador único", () => {
    expect(ACCESSORIES).toHaveLength(20);
    expect(new Set(ACCESSORIES.map((item) => item.id)).size).toBe(20);
    for (const item of ACCESSORIES) expect(item.price).toBeGreaterThan(0);
  });

  it("EA-C8: la tienda del documento conserva sus precios", () => {
    const price = (id: string) => ACCESSORIES.find((item) => item.id === id)?.price;
    expect(price("cap")).toBe(3);
    expect(price("funGlasses")).toBe(5);
    expect(price("backpack")).toBe(8);
    expect(price("fastShoes")).toBe(12);
    expect(price("cape")).toBe(20);
    expect(price("spaceSuit")).toBe(30);
  });

  it("EA-C9: hay cinco superpoderes y seis cuentos con interacciones", () => {
    expect(SKILLS).toHaveLength(5);
    expect(STORIES).toHaveLength(6);
    for (const story of STORIES) {
      const widgets = story.pages.filter((page) => page.widget);
      expect(widgets.length).toBeGreaterThanOrEqual(2);
      expect(widgets.length).toBeLessThanOrEqual(3);
    }
  });
});
