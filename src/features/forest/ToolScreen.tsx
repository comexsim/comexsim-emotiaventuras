"use client";

import { useApp, type ToolId } from "@/state/store";

import { BreathWidget, TrafficWidget, VolcanoWidget } from "./widgets";

const TITLES: Record<ToolId, string> = {
  traffic: "🚦 Semáforo emocional",
  breath: "🐢 La respiración de la tortuga",
  volcano: "🌋 El termómetro del volcán",
};

export function ToolScreen() {
  const tool = useApp((state) => state.tool);
  const go = useApp((state) => state.go);
  if (!tool) return null;
  return (
    <article className="tool-card">
      <header className="row between">
        <h2>{TITLES[tool]}</h2>
        <button
          type="button"
          className="round-btn soft"
          aria-label="Volver al bosque"
          onClick={() => go("forest")}
        >
          ✕
        </button>
      </header>
      {tool === "traffic" && <TrafficWidget />}
      {tool === "breath" && <BreathWidget />}
      {tool === "volcano" && <VolcanoWidget />}
    </article>
  );
}
