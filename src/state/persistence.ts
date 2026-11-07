import type { SaveData } from "@/engine/types";

const KEY = "emotiaventuras:save:v1";

/**
 * Valida lo guardado: el almacenamiento del navegador es una frontera y puede venir roto o editado.
 * Sin backend: nada sale de este dispositivo.
 */
export function parseSave(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<SaveData> | null;
    if (!data || data.version !== 1) return null;
    const valid =
      Number.isInteger(data.coins) &&
      (data.coins as number) >= 0 &&
      typeof data.hearts?.count === "number" &&
      typeof data.hearts?.anchor === "number" &&
      Array.isArray(data.owned) &&
      Array.isArray(data.log) &&
      typeof data.records === "object" &&
      typeof data.equipped === "object" &&
      typeof data.usage === "object" &&
      typeof data.settings === "object";
    return valid ? (data as SaveData) : null;
  } catch {
    return null;
  }
}

export function loadSave(): SaveData | null {
  try {
    return parseSave(window.localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function writeSave(save: SaveData): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Sin almacenamiento (ventana privada): la sesión funciona igual, solo no se recuerda.
  }
}

export function clearSave(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Sin almacenamiento: no hay nada que borrar.
  }
}
