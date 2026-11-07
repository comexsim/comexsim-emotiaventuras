"use client";

import { useApp } from "./store";

/**
 * Narrador de la demo con la voz del sistema (Web Speech). La versión final usará voces pregrabadas
 * (V1 §12); por eso todo pasa por este módulo y las pantallas no conocen la API.
 */
let voice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === "undefined") return null;
  const spanish = speechSynthesis
    .getVoices()
    .filter((item) => item.lang.toLowerCase().startsWith("es"));
  // Las voces neuronales suenan más cálidas; luego se prefiere español de América.
  return (
    spanish.find((item) => /natural|neural|online/i.test(item.name)) ??
    spanish.find((item) => /es-(419|mx|us|ar|bo|co)/i.test(item.lang)) ??
    spanish[0] ??
    null
  );
}

if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.addEventListener?.("voiceschanged", () => {
    voice = pickVoice();
  });
}

export function stopNarration() {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

/** Narra un texto, frase por frase (Chrome corta los textos largos si van de una sola vez). */
export function narrate(text: string, force = false) {
  if (typeof speechSynthesis === "undefined") return;
  const { narration, volume } = useApp.getState().save.settings;
  speechSynthesis.cancel();
  if (!narration && !force) return;
  voice ??= pickVoice();
  const parts = text.match(/[^.!?¡¿]*[¡¿]?[^.!?]+[.!?»]*/g) ?? [text];
  for (const part of parts) {
    const clean = part.trim();
    if (!clean) continue;
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = voice?.lang ?? "es-419";
    if (voice) utterance.voice = voice;
    utterance.rate = 0.94;
    utterance.pitch = 1.06;
    utterance.volume = volume;
    speechSynthesis.speak(utterance);
  }
}
