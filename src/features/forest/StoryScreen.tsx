"use client";

import { useEffect, useRef, useState } from "react";

import { storyById, type StoryPage } from "@/content/stories";
import { narrate, stopNarration } from "@/state/narrator";
import { useApp } from "@/state/store";

import { StoryArt } from "./StoryArt";
import {
  BreathWidget,
  ChoiceInteraction,
  CloudWidget,
  PhrasesWidget,
  TowerWidget,
  TrafficWidget,
  VolcanoWidget,
} from "./widgets";

function Widget({ page }: { page: StoryPage }) {
  switch (page.widget) {
    case "traffic":
      return <TrafficWidget />;
    case "volcano":
      return <VolcanoWidget />;
    case "breath":
      return <BreathWidget />;
    case "tower":
      return <TowerWidget />;
    case "phrases":
      return <PhrasesWidget />;
    case "cloud":
      return <CloudWidget />;
    case "choice":
      return page.choice ? <ChoiceInteraction choice={page.choice} /> : null;
    default:
      return null;
  }
}

/** Cuento narrado con subtítulos opcionales y dos o tres interacciones (V2 §3). */
export function StoryScreen() {
  const storyId = useApp((state) => state.story);
  const go = useApp((state) => state.go);
  const finishStory = useApp((state) => state.finishStory);
  const subtitles = useApp((state) => state.save.settings.subtitles);
  const [index, setIndex] = useState(0);
  const finished = useRef(false);
  const story = storyId ? storyById(storyId) : undefined;
  const page = story?.pages[index];

  useEffect(() => {
    if (page) narrate(page.text);
    return stopNarration;
  }, [page]);

  if (!story || !page) return null;
  const last = index === story.pages.length - 1;

  return (
    <article className="story-book">
      <header className="row between">
        <h2>
          <span aria-hidden="true">{story.icon}</span> {story.title}
        </h2>
        <button
          type="button"
          className="round-btn soft"
          aria-label="Cerrar el cuento"
          onClick={() => go("forest")}
        >
          ✕
        </button>
      </header>
      <div className="book-body">
        <StoryArt art={story.art} mood={page.mood} />
        <div className="book-text">
          {subtitles && <p className="story-text">{page.text}</p>}
          {/* La clave reinicia cada interacción al cambiar de página. */}
          <div key={index}>
            <Widget page={page} />
          </div>
        </div>
      </div>
      <footer className="row between">
        <button
          type="button"
          className="round-btn soft"
          aria-label="Escuchar otra vez"
          onClick={() => narrate(page.text, true)}
        >
          🔊
        </button>
        <div
          className="dots"
          role="img"
          aria-label={`Página ${index + 1} de ${story.pages.length}`}
        >
          {story.pages.map((_, i) => (
            <span key={i} className={i === index ? "dot on" : "dot"} />
          ))}
        </div>
        <div className="row">
          <button
            type="button"
            className="btn ghost"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            ← Atrás
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (!last) {
                setIndex(index + 1);
                return;
              }
              if (!finished.current) {
                finished.current = true;
                finishStory(story.id);
              }
              go("forest");
            }}
          >
            {last ? "Terminar" : "Seguir →"}
          </button>
        </div>
      </footer>
    </article>
  );
}
