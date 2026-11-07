import { describe, expect, it } from "vitest";

import { parseSave } from "./persistence";
import { emptySave } from "./store";

describe("guardado", () => {
  it("EA-G1: conserva inventario y avance entre sesiones", () => {
    const save = { ...emptySave(10), coins: 9, owned: ["cap"] };
    expect(parseSave(JSON.stringify(save))).toEqual(save);
  });

  it("EA-G2: ignora datos rotos o de otra versión, sin romper la aplicación", () => {
    expect(parseSave(null)).toBeNull();
    expect(parseSave("{no-json")).toBeNull();
    expect(parseSave(JSON.stringify({ version: 2 }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...emptySave(1), coins: -4 }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...emptySave(1), coins: 0.5 }))).toBeNull();
  });
});
