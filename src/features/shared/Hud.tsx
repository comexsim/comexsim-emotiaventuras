"use client";

import { useEffect, useState } from "react";

import { HEARTS } from "@/content/rules";
import { formatCoins } from "@/engine/economy";
import { nextHeartIn, settleHearts } from "@/engine/hearts";
import { stopNarration } from "@/state/narrator";
import { nowMs, useApp } from "@/state/store";

import { CoinIcon } from "./CoinIcon";

function minutesLabel(ms: number) {
  return `${Math.max(1, Math.ceil(ms / 60000))} min`;
}

/** Barra superior: el camino a casa, corazones, monedas y el botón permanente de ayuda (V1 §11). */
export function Hud() {
  const save = useApp((state) => state.save);
  const screen = useApp((state) => state.screen);
  const leave = useApp((state) => state.leaveChallenge);
  const go = useApp((state) => state.go);
  const setHelp = useApp((state) => state.setHelp);
  const setSettings = useApp((state) => state.setSettings);
  const [now, setNow] = useState(nowMs);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(nowMs()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const hearts = settleHearts(save.hearts, now);
  const waiting = nextHeartIn(save.hearts, now);
  const narration = save.settings.narration;

  return (
    <header className="hud">
      {screen !== "map" && (
        <button
          type="button"
          className="round-btn"
          aria-label="Volver al mapa"
          onClick={() => {
            stopNarration();
            if (screen === "challenge") leave();
            else go("map");
          }}
        >
          🏝️
        </button>
      )}
      <div className="chip" role="img" aria-label={`${hearts.count} de ${HEARTS.max} corazones`}>
        {Array.from({ length: HEARTS.max }, (_, i) => (
          <span key={i} className={i < hearts.count ? "heart" : "heart off"} aria-hidden="true">
            ❤️
          </span>
        ))}
        {waiting > 0 && <small className="chip-note">+1 en {minutesLabel(waiting)}</small>}
      </div>
      <div className="chip coins" role="img" aria-label={`${formatCoins(save.coins)} monedas`}>
        <CoinIcon />
        <strong>{formatCoins(save.coins)}</strong>
      </div>
      <span className="grow" />
      <button
        type="button"
        className="round-btn"
        aria-pressed={narration}
        aria-label={narration ? "Silenciar narración" : "Activar narración"}
        onClick={() => {
          if (narration) stopNarration();
          setSettings({ narration: !narration });
        }}
      >
        {narration ? "🔊" : "🔇"}
      </button>
      <button type="button" className="help-btn" onClick={() => setHelp(true)}>
        <span aria-hidden="true">🆘</span> Necesito ayuda
      </button>
    </header>
  );
}
