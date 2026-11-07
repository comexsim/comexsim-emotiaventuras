"use client";

import { useEffect, useState, type CSSProperties } from "react";

import {
  EMOTIONS,
  REPAIR_BY_REACTION,
  SITUATIONS,
  situationById,
  withName,
} from "@/content/catalog";
import { formatCoins, visibleOptions } from "@/engine/economy";
import type { Emotion, Option, Situation } from "@/engine/types";
import { narrate, stopNarration } from "@/state/narrator";
import { coinSound, tapSound } from "@/state/sound";
import { useApp, type Challenge } from "@/state/store";

import { CoinIcon } from "../shared/CoinIcon";

function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="round-btn soft"
      aria-label="Escuchar otra vez"
      onClick={() => narrate(text, true)}
    >
      🔊
    </button>
  );
}

function StoryPhase({ situation, name }: { situation: Situation; name: string }) {
  const setPhase = useApp((state) => state.setPhase);
  const text = withName(situation.story, name);
  useEffect(() => narrate(`${situation.title}. ${text}`), [situation.title, text]);
  return (
    <section className="dock-card">
      <div className="row between">
        <div>
          <p className="kicker">Situación {situation.id}</p>
          <h2>{situation.title}</h2>
        </div>
        <SpeakButton text={`${situation.title}. ${text}`} />
      </div>
      <p className="story-text">{text}</p>
      <button type="button" className="btn big" onClick={() => setPhase("feel")}>
        ¿Cómo se siente {name}?
      </button>
    </section>
  );
}

function FeelPhase({
  situation,
  challenge,
  name,
}: {
  situation: Situation;
  challenge: Challenge;
  name: string;
}) {
  const pick = useApp((state) => state.pickFeeling);
  const setPhase = useApp((state) => state.setPhase);
  const prompt = `¿Cómo crees que se siente ${name}? Toca una carita.`;
  useEffect(() => narrate(prompt), [prompt]);

  const replyFor = (emotion: Emotion) => {
    const match = situation.feels.includes(emotion);
    const named = EMOTIONS.find((item) => item.id === emotion)?.name.toLowerCase();
    const usual = EMOTIONS.find((item) => item.id === situation.feels[0])?.name.toLowerCase();
    // No hay emoción equivocada: cada persona siente distinto (V1 §3).
    return match
      ? `Sí, ${name} puede sentir ${named}. Todas las emociones son válidas.`
      : `Podría ser. Cada persona siente distinto. Otras personas, en este momento, también sentirían ${usual}.`;
  };

  const reply = challenge.feeling ? replyFor(challenge.feeling) : null;
  return (
    <section className="dock-card">
      <div className="row between">
        <h2>¿Cómo se siente {name}?</h2>
        <SpeakButton text={prompt} />
      </div>
      <div className="feelings">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.id}
            type="button"
            className="feeling"
            aria-pressed={challenge.feeling === emotion.id}
            onClick={() => {
              tapSound();
              pick(emotion.id);
              narrate(replyFor(emotion.id));
            }}
          >
            <span aria-hidden="true">{emotion.icon}</span>
            {emotion.name}
          </button>
        ))}
      </div>
      <p className="story-text reply" aria-live="polite">
        {reply ?? " "}
      </p>
      <div className="row end">
        <button
          type="button"
          className="btn big"
          disabled={!challenge.feeling}
          onClick={() => setPhase("choose")}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}

function ChoosePhase({ situation, name }: { situation: Situation; name: string }) {
  const level = useApp((state) => state.save.settings.level);
  const record = useApp((state) => state.save.records[situation.id]);
  const decide = useApp((state) => state.decide);
  const [selected, setSelected] = useState<Option["id"] | null>(null);
  const prompt = `¿Qué podría hacer ${name}?`;
  useEffect(() => narrate(prompt), [prompt]);
  const options = visibleOptions(situation, level);
  return (
    <section className="dock-card wide">
      <div className="row between">
        <h2>{prompt}</h2>
        <SpeakButton text={prompt} />
      </div>
      <div className="options" style={{ "--cols": options.length } as CSSProperties}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="option"
            aria-pressed={selected === option.id}
            onClick={() => {
              tapSound();
              setSelected(option.id);
              narrate(option.text, true);
            }}
          >
            <span className="option-icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="option-text">{option.text}</span>
            {record?.explored.includes(option.id) && (
              <small className="tag">Ya la exploraste</small>
            )}
          </button>
        ))}
      </div>
      <div className="row end">
        <button
          type="button"
          className="btn big"
          disabled={!selected}
          onClick={() => {
            if (selected) decide(selected);
          }}
        >
          ¡Esta es mi decisión!
        </button>
      </div>
    </section>
  );
}

/** La escena continúa con lo que sucede: 5 a 10 segundos con narración (V2 §2). */
function ConsequencePhase({ option, name, take }: { option: Option; name: string; take: number }) {
  const setPhase = useApp((state) => state.setPhase);
  const [canContinue, setCanContinue] = useState(false);
  const text = withName(option.consequence, name);
  useEffect(() => {
    narrate(text);
    const timer = window.setTimeout(() => setCanContinue(true), 3000);
    return () => window.clearTimeout(timer);
  }, [text, take]);
  return (
    <section className="caption">
      <p className="caption-text">
        <span aria-hidden="true">{option.icon}</span> {text}
      </p>
      <button
        type="button"
        className="btn"
        disabled={!canContinue}
        onClick={() => setPhase("feedback")}
      >
        Continuar
      </button>
    </section>
  );
}

function FeedbackPhase({
  situation,
  challenge,
  option,
  name,
}: {
  situation: Situation;
  challenge: Challenge;
  option: Option;
  name: string;
}) {
  const tryAnother = useApp((state) => state.tryAnother);
  const leave = useApp((state) => state.leaveChallenge);
  const start = useApp((state) => state.startSituation);
  const recommended = situation.options.find((item) => item.recommended);
  const repair = option.recommended ? null : REPAIR_BY_REACTION[option.react];
  const narration = [
    situation.validation,
    repair,
    option.recommended ? null : `Otra idea: ${recommended?.text}`,
    withName(situation.learning, name),
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    narrate(narration);
    coinSound(challenge.earned);
  }, [narration, challenge.earned, challenge.take]);

  const next = SITUATIONS.find(
    (item) => item.id === situation.id + 1 && item.world === situation.world,
  );
  return (
    <section className="dock-card wide feedback">
      <div className="feedback-main">
        <div className="row between">
          <h2>{option.recommended ? "¡Muy buena estrategia!" : "Descubriste algo importante"}</h2>
          <SpeakButton text={narration} />
        </div>
        <p className="story-text">{situation.validation}</p>
        {repair && (
          <p className="repair">
            <strong>Para reparar:</strong> {repair}
          </p>
        )}
        {!option.recommended && recommended && (
          <p className="idea">
            <span aria-hidden="true">{recommended.icon}</span> <strong>Otra idea:</strong>{" "}
            {recommended.text}
          </p>
        )}
        <p className="learning">
          <span aria-hidden="true">💡</span> {withName(situation.learning, name)}
        </p>
        <p className="tag strategy">Estrategia: {situation.strategy}</p>
      </div>
      <aside className="reward" aria-live="polite">
        <CoinIcon large />
        {challenge.earned > 0 ? (
          <>
            <strong>+{formatCoins(challenge.earned)}</strong>
            <small>
              {option.recommended ? "por tu respuesta constructiva" : "por explorar y reflexionar"}
            </small>
          </>
        ) : (
          <small>Ya exploraste esta decisión. ¡Sigue practicando!</small>
        )}
      </aside>
      <div className="row end actions">
        <button type="button" className="btn ghost" onClick={tryAnother}>
          🔁 Probar otra decisión
        </button>
        <button type="button" className="btn ghost" onClick={leave}>
          🏝️ Volver al mapa
        </button>
        {next && (
          <button type="button" className="btn" onClick={() => start(next.id)}>
            Siguiente situación ➜
          </button>
        )}
      </div>
    </section>
  );
}

/** Flujo de una situación: problema, emoción, decisión, consecuencia y retroalimentación. */
export function ChallengeScreen() {
  const challenge = useApp((state) => state.challenge);
  const name = useApp((state) => state.save.avatar?.name ?? "");
  useEffect(() => stopNarration, []);
  if (!challenge) return null;
  const situation = situationById(challenge.situation);
  if (!situation) return null;
  const option = situation.options.find((item) => item.id === challenge.option);

  return (
    <div className="challenge" key={challenge.situation}>
      {challenge.entry === "practice" && (
        <p className="practice-tag">Práctica libre · no usa corazones</p>
      )}
      {challenge.phase === "story" && <StoryPhase situation={situation} name={name} />}
      {challenge.phase === "feel" && (
        <FeelPhase situation={situation} challenge={challenge} name={name} />
      )}
      {challenge.phase === "choose" && <ChoosePhase situation={situation} name={name} />}
      {challenge.phase === "consequence" && option && (
        <ConsequencePhase option={option} name={name} take={challenge.take} />
      )}
      {challenge.phase === "feedback" && option && (
        <FeedbackPhase situation={situation} challenge={challenge} option={option} name={name} />
      )}
    </div>
  );
}
