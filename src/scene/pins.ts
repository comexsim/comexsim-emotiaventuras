import type { WorldId } from "@/engine/types";

/** Lugar de cada etiqueta sobre la isla del mapa. */
export const MAP_PINS: {
  id: WorldId | "forest";
  domId: string;
  at: [number, number, number];
}[] = [
  { id: "aula", domId: "pin-aula", at: [-7.2, 3.8, -5.3] },
  { id: "recreo", domId: "pin-recreo", at: [7.2, 2.6, -5.3] },
  { id: "paseos", domId: "pin-paseos", at: [-7.5, 2.9, 7.1] },
  { id: "casa", domId: "pin-casa", at: [7.4, 3.6, 7] },
  { id: "forest", domId: "pin-forest", at: [0, 3.6, -8] },
];
