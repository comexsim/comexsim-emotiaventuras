import { describe, expect, it } from "vitest";

import { LANDING_STYLES } from "./landingStyles";
import { hexToRgb, nearest, rgbToHex, SIM_STYLES, skinColor } from "./simStyles";

const HEX = /^#[0-9a-f]{6}$/;

describe("línea gráfica en /business", () => {
  it("EA-B1: el simulador muestra el estilo actual y al menos cuatro alternativas", () => {
    expect(SIM_STYLES[0]?.id).toBe("actual");
    expect(SIM_STYLES[0]?.skin).toBeNull();
    expect(SIM_STYLES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(SIM_STYLES.map((style) => style.id)).size).toBe(SIM_STYLES.length);
  });

  it("EA-B2: la web tiene seis propuestas, cada una con paleta, par tipográfico y tono", () => {
    expect(LANDING_STYLES).toHaveLength(6);
    for (const style of LANDING_STYLES) {
      expect(style.palette.length).toBeGreaterThanOrEqual(5);
      expect(style.fonts.display).not.toBe(style.fonts.body);
      expect(style.voice.length).toBeGreaterThan(10);
    }
  });

  it("EA-B3: todos los colores de las paletas son hex válidos", () => {
    const all = [...SIM_STYLES, ...LANDING_STYLES].flatMap((style) => style.palette);
    for (const swatch of all) expect(swatch.hex).toMatch(HEX);
  });

  it("EA-B4: los textos visibles hablan de simulador y aventura, nunca de juego", () => {
    const text = JSON.stringify([SIM_STYLES, LANDING_STYLES]).toLowerCase();
    expect(text).not.toMatch(/\bjuegos?\b|\bjugar\b|\bjuega\b/);
  });
});

describe("re-vestido de colores", () => {
  it("EA-B5: hex ida y vuelta sin pérdida", () => {
    expect(rgbToHex(hexToRgb("#a9e2f7"))).toBe("#a9e2f7");
  });

  it("EA-B6: sin cambios de saturación ni luz, el color queda igual", () => {
    expect(skinColor("#ef6f5b", { material: "standard", saturation: 1, lighten: 0 }, [])).toBe(
      "#ef6f5b",
    );
  });

  it("EA-B7: aclarar sube la luminosidad y nunca pasa del blanco", () => {
    const [r, g, b] = hexToRgb(
      skinColor("#3fa7d6", { material: "lambert", saturation: 1, lighten: 0.5 }, []),
    );
    const [r0, g0, b0] = hexToRgb("#3fa7d6");
    expect(r + g + b).toBeGreaterThan(r0 + g0 + b0);
    expect(Math.max(r, g, b)).toBeLessThanOrEqual(255);
  });

  it("EA-B8: con cuantización el color siempre pertenece a la paleta del estilo", () => {
    for (const style of SIM_STYLES.filter((item) => item.skin?.quantize)) {
      const palette = style.palette.map((swatch) => swatch.hex);
      for (const hex of ["#8ed06b", "#74c9e8", "#eebd93", "#33262a", "#fbf8f1"]) {
        expect(palette).toContain(skinColor(hex, style.skin!, palette));
      }
    }
  });

  it("EA-B9: el más cercano de un color de la paleta es él mismo", () => {
    expect(nearest("#2ec4b6", ["#ff6b4a", "#2ec4b6", "#2b2d42"])).toBe("#2ec4b6");
  });
});
