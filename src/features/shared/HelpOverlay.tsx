"use client";

import { useEffect } from "react";

import { narrate, stopNarration } from "@/state/narrator";
import { useApp } from "@/state/store";

const MESSAGE =
  "Qué bueno que pides ayuda. Si tienes mucho miedo, si alguien te lastima o te hace sentir mal, o si hay peligro, busca ahora a un adulto de confianza y cuéntale lo que pasa. No tienes que resolverlo a solas.";

const PEOPLE = [
  { icon: "🏠", text: "Alguien de tu familia" },
  { icon: "🏫", text: "Tu profesora o profesor" },
  { icon: "💗", text: "Un adulto que te cuida" },
];

/**
 * Las situaciones de miedo intenso, acoso, violencia o peligro no se resuelven en el simulador
 * (V1 §11): aquí solo se anima a buscar a un adulto de confianza.
 */
export function HelpOverlay() {
  const open = useApp((state) => state.help);
  const setHelp = useApp((state) => state.setHelp);
  const openTool = useApp((state) => state.openTool);

  useEffect(() => {
    if (open) narrate(MESSAGE, true);
    return stopNarration;
  }, [open]);

  if (!open) return null;
  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="modal help-modal">
        <span className="modal-icon" aria-hidden="true">
          🤗
        </span>
        <h2 id="help-title">Busca a un adulto de confianza</h2>
        <p>{MESSAGE}</p>
        <ul className="people">
          {PEOPLE.map((person) => (
            <li key={person.text}>
              <span aria-hidden="true">{person.icon}</span>
              {person.text}
            </li>
          ))}
        </ul>
        <div className="row center">
          <button type="button" className="btn ghost" onClick={() => narrate(MESSAGE, true)}>
            🔊 Escuchar otra vez
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setHelp(false);
              openTool("breath");
            }}
          >
            🌬️ Respirar un momento
          </button>
          <button type="button" className="btn" onClick={() => setHelp(false)}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
