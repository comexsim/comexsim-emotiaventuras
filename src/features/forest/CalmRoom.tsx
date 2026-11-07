"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { CLOUD_FEELINGS } from "@/content/stories";
import { playAmbience, type Ambience } from "@/state/sound";
import { useApp } from "@/state/store";

const SOUNDS: { id: Ambience; name: string; icon: string }[] = [
  { id: "rain", name: "Lluvia", icon: "🌧️" },
  { id: "waves", name: "Olas", icon: "🌊" },
  { id: "wind", name: "Viento", icon: "🍃" },
];

/** Habitación tranquila: dibujar emociones o escuchar sonidos, sin objetivos ni resultados. */
export function CalmRoom() {
  const go = useApp((state) => state.go);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const stopSound = useRef<(() => void) | null>(null);
  const [color, setColor] = useState<string>(CLOUD_FEELINGS[0].color);
  const [sound, setSound] = useState<Ambience | null>(null);

  useEffect(() => () => stopSound.current?.(), []);

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * element.width,
      y: ((event.clientY - box.top) / box.height) * element.height,
    };
  };

  const resolveColor = (value: string) => {
    const token = value.match(/var\((--[^)]+)\)/)?.[1];
    return token ? getComputedStyle(document.documentElement).getPropertyValue(token) : value;
  };

  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const { x, y } = point(event);
    context.strokeStyle = resolveColor(color);
    context.lineWidth = 16;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 0.1, y);
    context.stroke();
  };

  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const toggleSound = (id: Ambience) => {
    stopSound.current?.();
    stopSound.current = null;
    if (sound === id) {
      setSound(null);
      return;
    }
    stopSound.current = playAmbience(id);
    setSound(id);
  };

  return (
    <article className="tool-card room">
      <header className="row between">
        <h2>🛋️ La habitación tranquila</h2>
        <button
          type="button"
          className="round-btn soft"
          aria-label="Volver al bosque"
          onClick={() => go("forest")}
        >
          ✕
        </button>
      </header>
      <p className="muted">
        Dibuja lo que sientes con el color que quieras. Aquí no hay nada que hacer bien o mal.
      </p>
      <div className="pill-row">
        {CLOUD_FEELINGS.map((feeling) => (
          <button
            key={feeling.id}
            type="button"
            className="pill"
            aria-pressed={color === feeling.color}
            onClick={() => setColor(feeling.color)}
          >
            <span className="dot-color" style={{ background: feeling.color }} aria-hidden="true" />
            {feeling.name}
          </button>
        ))}
        <button
          type="button"
          className="pill"
          onClick={() => {
            const element = canvas.current;
            element?.getContext("2d")?.clearRect(0, 0, element.width, element.height);
          }}
        >
          🧽 Hoja nueva
        </button>
      </div>
      <canvas
        ref={canvas}
        className="draw"
        width={900}
        height={420}
        aria-label="Hoja para dibujar"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <div className="pill-row">
        {SOUNDS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={sound === item.id}
            onClick={() => toggleSound(item.id)}
          >
            <span aria-hidden="true">{item.icon}</span> {item.name}
          </button>
        ))}
      </div>
    </article>
  );
}
