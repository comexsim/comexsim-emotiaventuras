"use client";

import { useEffect, useState } from "react";

import {
  CLOUD_FEELINGS,
  HEDGEHOG_PHRASES,
  TOWER_STRATEGIES,
  TRAFFIC_LIGHTS,
  VOLCANO_HELPERS,
  type ChoiceWidget,
} from "@/content/stories";
import { narrate } from "@/state/narrator";
import { tapSound } from "@/state/sound";

/** Ninguna de estas interacciones tiene respuestas penalizadas (V2 §3). */

export function TrafficWidget() {
  const [active, setActive] = useState<(typeof TRAFFIC_LIGHTS)[number]["id"] | null>(null);
  const current = TRAFFIC_LIGHTS.find((light) => light.id === active);
  return (
    <div className="widget traffic">
      <div className="traffic-box">
        {TRAFFIC_LIGHTS.map((light) => (
          <button
            key={light.id}
            type="button"
            className={`lamp ${light.id}${active === light.id ? " on" : ""}`}
            aria-label={light.name}
            aria-pressed={active === light.id}
            onClick={() => {
              tapSound();
              setActive(light.id);
              narrate(light.say, true);
            }}
          />
        ))}
      </div>
      <p className="widget-reply" aria-live="polite">
        {current?.say ?? "Toca una luz."}
      </p>
    </div>
  );
}

export function VolcanoWidget() {
  const [heat, setHeat] = useState(90);
  const [said, setSaid] = useState("Bumi tiene mucho calor. ¿Qué podría ayudarle?");
  const pick = (text: string, drop: number) => {
    tapSound();
    const next = Math.max(15, heat - drop);
    setHeat(next);
    const reply =
      next <= 20 ? "Bumi ya se siente mucho más tranquilo." : `${text}: el calor baja un poco.`;
    setSaid(reply);
    narrate(reply, true);
  };
  return (
    <div className="widget volcano">
      <div className="thermo" role="img" aria-label={`Temperatura: ${heat} de 100`}>
        <div className="thermo-fill" style={{ height: `${heat}%` }} />
      </div>
      <div className="widget-col">
        <div className="pill-row">
          {VOLCANO_HELPERS.map((helper) => (
            <button
              key={helper.text}
              type="button"
              className="pill"
              onClick={() => pick(helper.text, helper.drop)}
            >
              <span aria-hidden="true">{helper.icon}</span> {helper.text}
            </button>
          ))}
        </div>
        <p className="widget-reply" aria-live="polite">
          {said}
        </p>
        {heat < 90 && (
          <button type="button" className="btn ghost small" onClick={() => setHeat(90)}>
            Empezar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}

const BREATH_SECONDS = 4;

/** Acompaña sin obligar: el niño empieza si quiere y puede salir cuando quiera (V2 §3). */
export function BreathWidget() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setPhase((current) => {
        if (current === "out") setCount((value) => value + 1);
        return current === "in" ? "out" : "in";
      });
    }, BREATH_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  const done = count >= 3;
  return (
    <div className="widget breath">
      <div className={`breath-ball${running && !done ? ` ${phase}` : ""}`} aria-hidden="true">
        🐢
      </div>
      <p className="widget-reply" aria-live="polite">
        {done
          ? "Tres respiraciones. Bien hecho, a tu ritmo."
          : running
            ? phase === "in"
              ? "Toma aire despacio…"
              : "Suéltalo suavemente…"
            : "Cuando quieras, y solo si tienes ganas."}
      </p>
      <div className="row center">
        {!running || done ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setCount(0);
              setPhase("in");
              setRunning(true);
            }}
          >
            {done ? "Otra vez" : "Respirar con Tula"}
          </button>
        ) : (
          <button type="button" className="btn ghost" onClick={() => setRunning(false)}>
            Pausar
          </button>
        )}
      </div>
    </div>
  );
}

export function TowerWidget() {
  const [height, setHeight] = useState(1);
  const [reply, setReply] = useState("La torre se cayó. ¿Qué estrategia prueba Nino?");
  const colors = [
    "var(--coral)",
    "var(--sun)",
    "var(--sky)",
    "var(--leaf)",
    "var(--violet)",
    "var(--coral)",
    "var(--sun)",
  ];
  return (
    <div className="widget tower">
      <div className="tower-stack" aria-label={`Torre de ${height} bloques`} role="img">
        {Array.from({ length: height }, (_, i) => (
          <span key={i} style={{ background: colors[i % colors.length] }} className="tower-block" />
        ))}
      </div>
      <div className="widget-col">
        <div className="pill-row">
          {TOWER_STRATEGIES.map((strategy) => (
            <button
              key={strategy.text}
              type="button"
              className="pill"
              onClick={() => {
                tapSound();
                setHeight((value) => Math.min(value + 2, 7));
                setReply(strategy.reply);
                narrate(strategy.reply, true);
              }}
            >
              <span aria-hidden="true">{strategy.icon}</span> {strategy.text}
            </button>
          ))}
        </div>
        <p className="widget-reply" aria-live="polite">
          {reply}
        </p>
        {height >= 5 && (
          <button
            type="button"
            className="btn ghost small"
            onClick={() => {
              setHeight(1);
              setReply("¡Crash! Se cayó otra vez. No importa: ¿qué probamos ahora?");
            }}
          >
            Se cae otra vez
          </button>
        )}
      </div>
    </div>
  );
}

export function PhrasesWidget() {
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked === null ? null : HEDGEHOG_PHRASES[picked];
  return (
    <div className="widget phrases">
      <div className="phrase-list">
        {HEDGEHOG_PHRASES.map((phrase, i) => (
          <button
            key={phrase.text}
            type="button"
            className="phrase"
            aria-pressed={picked === i}
            onClick={() => {
              tapSound();
              setPicked(i);
              narrate(`${phrase.text} ${phrase.reply}`, true);
            }}
          >
            {phrase.text}
          </button>
        ))}
      </div>
      <p className="widget-reply" aria-live="polite">
        {current?.reply ?? "Toca una frase para escuchar cómo suena."}
      </p>
    </div>
  );
}

export function CloudWidget() {
  const [active, setActive] = useState<(typeof CLOUD_FEELINGS)[number] | null>(null);
  return (
    <div className="widget cloud-widget">
      <div
        className="cloud-face"
        style={{ background: active?.color ?? "var(--surface)" }}
        aria-hidden="true"
      >
        {active?.face ?? "☁️"}
      </div>
      <div className="widget-col">
        <div className="pill-row">
          {CLOUD_FEELINGS.map((feeling) => (
            <button
              key={feeling.id}
              type="button"
              className="pill"
              aria-pressed={active?.id === feeling.id}
              onClick={() => {
                tapSound();
                setActive(feeling);
                narrate(`${feeling.name}. ${feeling.body} ${feeling.when}`, true);
              }}
            >
              <span aria-hidden="true">{feeling.face}</span> {feeling.name}
            </button>
          ))}
        </div>
        <p className="widget-reply" aria-live="polite">
          {active ? `${active.body} ${active.when}` : "Toca una emoción para ver a Nimbo."}
        </p>
      </div>
    </div>
  );
}

export function ChoiceInteraction({ choice }: { choice: ChoiceWidget }) {
  const [picked, setPicked] = useState<number | null>(null);
  const current = picked === null ? null : choice.options[picked];
  return (
    <div className="widget">
      <p className="muted">{choice.prompt}</p>
      <div className="pill-row">
        {choice.options.map((option, i) => (
          <button
            key={option.text}
            type="button"
            className="pill"
            aria-pressed={picked === i}
            onClick={() => {
              tapSound();
              setPicked(i);
              narrate(`${option.text}. ${option.reply}`, true);
            }}
          >
            <span aria-hidden="true">{option.icon}</span> {option.text}
          </button>
        ))}
      </div>
      <p className="widget-reply" aria-live="polite">
        {current?.reply ?? " "}
      </p>
    </div>
  );
}
