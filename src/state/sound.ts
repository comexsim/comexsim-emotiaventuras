"use client";

import { useApp } from "./store";

/**
 * Sonidos sintetizados, sin archivos. No existe ningún sonido de derrota (V1 §11): solo un tono
 * suave al recibir monedas y ambientes tranquilos para la habitación de la calma.
 */
let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

function tone(frequency: number, at: number, duration: number, gain: number) {
  const ctx = audio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  env.gain.setValueAtTime(0, ctx.currentTime + at);
  env.gain.linearRampToValueAtTime(gain, ctx.currentTime + at + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + duration);
  osc.connect(env).connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + duration + 0.02);
}

/** Tono de recompensa. Más breve para explorar: nada llamativo premia una conducta dañina. */
export function coinSound(quarters: number) {
  const { volume } = useApp.getState().save.settings;
  const gain = 0.12 * volume;
  if (quarters >= 4) {
    tone(784, 0, 0.18, gain);
    tone(1046, 0.09, 0.3, gain);
  } else if (quarters > 0) {
    tone(660, 0, 0.18, gain * 0.6);
  }
}

export function tapSound() {
  tone(520, 0, 0.08, 0.05 * useApp.getState().save.settings.volume);
}

export type Ambience = "rain" | "waves" | "wind";

const FILTER: Record<Ambience, { type: BiquadFilterType; frequency: number }> = {
  rain: { type: "highpass", frequency: 1200 },
  waves: { type: "lowpass", frequency: 500 },
  wind: { type: "bandpass", frequency: 400 },
};

/** Ruido filtrado en bucle. Devuelve la función que lo detiene. */
export function playAmbience(kind: Ambience): () => void {
  const ctx = audio();
  if (!ctx) return () => undefined;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Ruido de audio: es sonido, no una decisión del motor, y no necesita ser reproducible.
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = FILTER[kind].type;
  filter.frequency.value = FILTER[kind].frequency;
  const gain = ctx.createGain();
  gain.gain.value = 0.09 * useApp.getState().save.settings.volume;
  if (kind !== "rain") {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = kind === "waves" ? 0.12 : 0.2;
    depth.gain.value = 0.05;
    lfo.connect(depth).connect(gain.gain);
    lfo.start();
  }
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
  return () => source.stop();
}
