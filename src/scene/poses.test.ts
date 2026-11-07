import { describe, expect, it } from "vitest";

import { SITUATIONS } from "@/content/catalog";

import { poseAt, REST, STAGING } from "./poses";

describe("escena de cada alternativa", () => {
  it("EA-A1: toda reacción del banco tiene una escena", () => {
    for (const option of SITUATIONS.flatMap((item) => item.options)) {
      expect(STAGING[option.react]).toBeDefined();
    }
  });

  it("EA-A2: ninguna conducta dañina recibe animaciones llamativas (V2 §5)", () => {
    const harmful = ["outburst", "harm", "breakThing", "flee", "sneak", "blame", "insult"] as const;
    for (const reaction of harmful) expect(STAGING[reaction].sparkle).toBeUndefined();
  });

  it("EA-A3: el gesto de un empujón no llega a alcanzar a la otra persona", () => {
    for (let t = 0; t < 4; t += 0.1) expect(poseAt("shove", t).x).toBeLessThan(0.2);
  });

  it("EA-A4: las posturas son estables y arrancan cerca del reposo", () => {
    const start = poseAt("idle", 0);
    expect(start.x).toBe(REST.x);
    for (const clip of ["run", "stomp", "breathe", "approach", "repair"] as const) {
      for (let t = 0; t < 8; t += 0.5) expect(Number.isFinite(poseAt(clip, t).bob)).toBe(true);
    }
  });
});
