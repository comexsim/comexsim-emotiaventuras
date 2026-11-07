"use client";

import { STORIES } from "@/content/stories";
import { useApp, type ToolId } from "@/state/store";

const TOOLS: { id: ToolId; name: string; icon: string }[] = [
  { id: "traffic", name: "Semáforo emocional", icon: "🚦" },
  { id: "breath", name: "Respiración de la tortuga", icon: "🐢" },
  { id: "volcano", name: "Termómetro del volcán", icon: "🌋" },
];

/** Espacio libre: nunca consume corazones ni se presenta como un castigo (V2 §3). */
export function ForestScreen() {
  const openStory = useApp((state) => state.openStory);
  const openTool = useApp((state) => state.openTool);
  const go = useApp((state) => state.go);
  return (
    <aside className="side-panel forest-panel">
      <p className="kicker">🌳 Siempre abierto y sin corazones</p>
      <h2>El Bosque de la Calma</h2>
      <h3>Cuentos para escuchar</h3>
      <ul className="story-grid">
        {STORIES.map((story) => (
          <li key={story.id}>
            <button type="button" className="story-card" onClick={() => openStory(story.id)}>
              <span className="story-icon" style={{ background: story.tint }} aria-hidden="true">
                {story.icon}
              </span>
              <span>
                <strong>{story.title}</strong>
                <small>{story.summary}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <h3>Para practicar</h3>
      <div className="pill-row">
        {TOOLS.map((tool) => (
          <button key={tool.id} type="button" className="pill" onClick={() => openTool(tool.id)}>
            <span aria-hidden="true">{tool.icon}</span> {tool.name}
          </button>
        ))}
        <button type="button" className="pill" onClick={() => go("room")}>
          <span aria-hidden="true">🛋️</span> Habitación tranquila
        </button>
      </div>
    </aside>
  );
}
