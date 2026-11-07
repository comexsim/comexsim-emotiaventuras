"use client";

import { useMemo, useState, type FormEvent } from "react";

import { SKILLS, TOPICS } from "@/content/catalog";
import { DAILY_LIMIT_CHOICES, type Level } from "@/content/rules";
import { formatCoins } from "@/engine/economy";
import { adultCheck, skillCounts, summarize, type Range } from "@/engine/progress";
import { nowMs, useApp } from "@/state/store";

function Gate({ onPass }: { onPass: () => void }) {
  const go = useApp((state) => state.go);
  const [check] = useState(() => adultCheck(nowMs()));
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (Number(value) === check.answer) onPass();
    else setWrong(true);
  };
  return (
    <div className="gate">
      <form className="modal" onSubmit={submit}>
        <span className="modal-icon" aria-hidden="true">
          🔒
        </span>
        <h2>Solo para adultos</h2>
        <label htmlFor="adult-check">
          Para entrar, resuelve: ¿cuánto es {check.a} × {check.b}?
        </label>
        <input
          id="adult-check"
          className="gate-input"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={value}
          onChange={(event) => {
            setWrong(false);
            setValue(event.target.value);
          }}
        />
        {wrong && <p className="muted">Ese no es el resultado. Prueba de nuevo.</p>}
        <div className="row center">
          <button type="button" className="btn ghost" onClick={() => go("map")}>
            Volver
          </button>
          <button type="submit" className="btn">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

const LEVELS: { id: Level; name: string; detail: string }[] = [
  { id: 1, name: "5–6 años", detail: "Exploradores emocionales · 3 alternativas" },
  { id: 2, name: "7–8 años", detail: "Constructores de soluciones · 4 alternativas" },
  { id: 3, name: "8–9 años", detail: "Maestros de las emociones · 5 alternativas" },
];

function Panel() {
  const save = useApp((state) => state.save);
  const go = useApp((state) => state.go);
  const setSettings = useApp((state) => state.setSettings);
  const loadDemo = useApp((state) => state.loadDemo);
  const resetAll = useApp((state) => state.resetAll);
  const [range, setRange] = useState<Range>("week");
  const [confirming, setConfirming] = useState(false);
  const [now] = useState(nowMs);

  const summary = useMemo(
    () => summarize(save.log, save.usage, now, range),
    [save.log, save.usage, now, range],
  );
  const skills = useMemo(() => skillCounts(save.log), [save.log]);
  const top = summary.topics[0]?.topic ?? "frustracion";
  const maxTopic = Math.max(1, ...summary.topics.map((item) => item.count));
  const empty = summary.situations === 0 && summary.stories === 0;

  return (
    <div className="parents">
      <header className="row between">
        <div>
          <p className="kicker">Panel de padres y tutores</p>
          <h1>Acompañar en casa</h1>
        </div>
        <button type="button" className="btn ghost" onClick={() => go("map")}>
          Volver a la aventura
        </button>
      </header>

      <p className="disclaimer">
        Este panel muestra actividades. No es una evaluación psicológica: no diagnostica ni compara.
        Las respuestas son elecciones dentro de una simulación, no necesariamente cómo actúa en la
        vida real.
      </p>

      <div className="tabs" role="tablist" aria-label="Período">
        {(
          [
            ["week", "Esta semana"],
            ["month", "Este mes"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={range === id}
            className="tab"
            onClick={() => setRange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="metrics" aria-label="Resumen">
        <div className="metric">
          <span>Situaciones practicadas</span>
          <strong>{summary.situations}</strong>
        </div>
        <div className="metric">
          <span>Cuentos escuchados</span>
          <strong>{summary.stories}</strong>
        </div>
        <div className="metric">
          <span>Tiempo total de uso</span>
          <strong>{formatTime(summary.usageSeconds)}</strong>
        </div>
        <div className="metric">
          <span>Monedas ganadas</span>
          <strong>{formatCoins(summary.earnedQuarters)}</strong>
        </div>
      </section>

      <div className="parents-grid">
        <section className="panel-card">
          <h2>Temas que más practicó</h2>
          {empty && (
            <p className="muted">
              Todavía no hay actividad en este período. Cuando practique una situación o escuche un
              cuento, aparecerá aquí.
            </p>
          )}
          <ul className="bars">
            {summary.topics.map((item) => (
              <li key={item.topic}>
                <span className="bar-label">{TOPICS[item.topic].name}</span>
                <span className="bar-track">
                  <span
                    className="bar-fill"
                    style={{ width: `${(item.count / maxTopic) * 100}%` }}
                  />
                </span>
                <span className="bar-value">
                  {item.count} {item.count === 1 ? "actividad" : "actividades"}
                </span>
              </li>
            ))}
          </ul>
          <h3>Para conversar en familia</h3>
          <blockquote>{TOPICS[top].family}</blockquote>
          <h3>Superpoderes practicados</h3>
          <ul className="skill-mini">
            {SKILLS.map((skill) => (
              <li key={skill.id}>
                <span aria-hidden="true">{skill.icon}</span> {skill.name}:{" "}
                <strong>{skills[skill.id]}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-card">
          <h2>Configuración</h2>
          <fieldset className="field">
            <legend>Edad orientativa</legend>
            <p className="fine">
              La progresión también depende de las habilidades: practicar en un nivel inicial es
              completamente normal.
            </p>
            <div className="radio-col">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  className="radio"
                  aria-pressed={save.settings.level === level.id}
                  onClick={() => setSettings({ level: level.id })}
                >
                  <strong>{level.name}</strong> <small>{level.detail}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <legend>Límite de uso por día</legend>
            <div className="pill-row">
              {DAILY_LIMIT_CHOICES.map((limit) => (
                <button
                  key={String(limit)}
                  type="button"
                  className="pill"
                  aria-pressed={save.settings.dailyLimit === limit}
                  onClick={() => setSettings({ dailyLimit: limit })}
                >
                  {limit === null ? "Sin límite" : `${limit} min`}
                </button>
              ))}
            </div>
            <p className="fine">
              Una situación ya empezada siempre se puede terminar con tranquilidad.
            </p>
          </fieldset>
          <div className="field">
            <label htmlFor="volume">Volumen de la narración</label>
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={save.settings.volume}
              onChange={(event) => setSettings({ volume: Number(event.target.value) })}
            />
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={save.settings.narration}
              onChange={(event) => setSettings({ narration: event.target.checked })}
            />
            Narración automática
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={save.settings.subtitles}
              onChange={(event) => setSettings({ subtitles: event.target.checked })}
            />
            Subtítulos en los cuentos
          </label>

          <h3>Privacidad</h3>
          <p className="fine">
            No se pide ningún dato personal y el nombre es de fantasía. Todo se guarda solo en este
            dispositivo y nada se envía a internet. Sin anuncios, compras, rachas ni rankings.
          </p>

          <h3>Para demostraciones</h3>
          <div className="row">
            <button type="button" className="btn ghost small" onClick={loadDemo}>
              +25 monedas ficticias y corazones llenos
            </button>
            {!confirming ? (
              <button type="button" className="btn ghost small" onClick={() => setConfirming(true)}>
                Borrar el avance
              </button>
            ) : (
              <button type="button" className="btn danger small" onClick={resetAll}>
                Confirmar: borrar todo
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/** Acceso con una verificación para adultos, sin exponer información del niño (V2 §6). */
export function ParentsScreen() {
  const [passed, setPassed] = useState(false);
  return passed ? <Panel /> : <Gate onPass={() => setPassed(true)} />;
}
