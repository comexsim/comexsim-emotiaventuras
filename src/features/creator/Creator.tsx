"use client";

import { useEffect } from "react";

import {
  FANTASY_NAMES,
  HAIR_COLORS,
  HAIR_STYLES,
  OUTFIT_COLORS,
  SKIN_TONES,
} from "@/content/catalog";
import type { AvatarLook } from "@/engine/types";
import { narrate } from "@/state/narrator";
import { tapSound } from "@/state/sound";
import { useApp } from "@/state/store";

import { useDraft } from "./draft";

const INTRO =
  "¡Conviértete en un héroe de las emociones! Encontrarás pequeños desafíos de la vida diaria. Algunas cosas saldrán bien, otras serán difíciles, pero siempre podrás intentarlo otra vez. Primero, crea tu personaje.";

function Swatches({
  label,
  colors,
  value,
  onPick,
}: {
  label: string;
  colors: string[];
  value: string;
  onPick: (color: string) => void;
}) {
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="swatches">
        {colors.map((color, i) => (
          <button
            key={color}
            type="button"
            className="swatch"
            style={{ background: color }}
            aria-label={`${label} ${i + 1}`}
            aria-pressed={value === color}
            onClick={() => {
              tapSound();
              onPick(color);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** Creador del personaje. El nombre se elige de una lista: nunca se escribe el nombre real. */
export function Creator() {
  const draft = useDraft((state) => state.look);
  const setDraft = useDraft((state) => state.set);
  const createAvatar = useApp((state) => state.createAvatar);

  useEffect(() => {
    setDraft({
      name: FANTASY_NAMES[0]!,
      skin: SKIN_TONES[1]!,
      hairStyle: "curly",
      hairColor: HAIR_COLORS[1]!,
      outfit: OUTFIT_COLORS[0]!,
    });
    return () => setDraft(null);
  }, [setDraft]);

  if (!draft) return null;
  const patch = (next: Partial<AvatarLook>) => setDraft({ ...draft, ...next });

  return (
    <section className="side-panel creator">
      <header>
        <p className="kicker">La Academia de los Superpoderes Emocionales</p>
        <h1>EmotiAventuras</h1>
        <p className="lead">
          ¡Conviértete en un héroe de las emociones!
          <button
            type="button"
            className="mini-speak"
            aria-label="Escuchar"
            onClick={() => narrate(INTRO, true)}
          >
            🔊
          </button>
        </p>
      </header>

      <fieldset className="field">
        <legend>Nombre de fantasía</legend>
        <div className="pill-row">
          {FANTASY_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              className="pill"
              aria-pressed={draft.name === name}
              onClick={() => {
                tapSound();
                patch({ name });
                narrate(name, true);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Peinado</legend>
        <div className="pill-row">
          {HAIR_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              className="pill"
              aria-pressed={draft.hairStyle === style.id}
              onClick={() => {
                tapSound();
                patch({ hairStyle: style.id });
              }}
            >
              <span aria-hidden="true">{style.icon}</span> {style.name}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="swatch-grid">
        <Swatches
          label="Piel"
          colors={SKIN_TONES}
          value={draft.skin}
          onPick={(skin) => patch({ skin })}
        />
        <Swatches
          label="Cabello"
          colors={HAIR_COLORS}
          value={draft.hairColor}
          onPick={(hairColor) => patch({ hairColor })}
        />
        <Swatches
          label="Ropa"
          colors={OUTFIT_COLORS}
          value={draft.outfit}
          onPick={(outfit) => patch({ outfit })}
        />
      </div>

      <button
        type="button"
        className="btn big"
        onClick={() => {
          narrate(`¡Hola, ${draft.name}! Elige un mundo para empezar.`);
          createAvatar(draft);
        }}
      >
        ¡Comenzar la aventura!
      </button>
      <p className="fine">
        Simulador educativo. Las monedas son virtuales: no hay compras reales, anuncios ni rankings.
        Tus avances se guardan solo en este dispositivo.
      </p>
    </section>
  );
}
