"use client";

import { SITUATIONS, WORLDS } from "@/content/catalog";
import { nextHeartIn } from "@/engine/hearts";
import { MAP_PINS } from "@/scene/pins";
import { narrate } from "@/state/narrator";
import { nowMs, useApp } from "@/state/store";

/** Etiquetas de los mundos: la escena las mueve sobre la isla (`PinProjector`). */
function Pins() {
  const setFocus = useApp((state) => state.setFocusWorld);
  const go = useApp((state) => state.go);
  return (
    <div className="pins">
      {MAP_PINS.map((pin) => {
        if (pin.id === "forest") {
          return (
            <button
              key={pin.id}
              id={pin.domId}
              type="button"
              className="world-pin forest"
              onClick={() => go("forest")}
            >
              <span aria-hidden="true">🌳</span>
              Bosque de la Calma
            </button>
          );
        }
        const world = WORLDS.find((item) => item.id === pin.id);
        const id = pin.id;
        return (
          <button
            key={id}
            id={pin.domId}
            type="button"
            className="world-pin"
            style={{ background: world?.tint }}
            onClick={() => setFocus(id)}
          >
            <span aria-hidden="true">{world?.icon}</span>
            {world?.name}
          </button>
        );
      })}
    </div>
  );
}

function Notice() {
  const notice = useApp((state) => state.notice);
  const dismiss = useApp((state) => state.dismissNotice);
  const go = useApp((state) => state.go);
  const hearts = useApp((state) => state.save.hearts);
  if (!notice) return null;
  const minutes = Math.max(1, Math.ceil(nextHeartIn(hearts, nowMs()) / 60000));
  const title =
    notice === "forest" ? "Tus corazones están descansando" : "Por hoy ya practicaste bastante";
  const body =
    notice === "forest"
      ? `Un corazón vuelve en ${minutes} minutos. Mientras tanto, te invitamos al Bosque de la Calma, con cuentos y actividades tranquilas. También puedes volver a practicar las situaciones que ya viviste.`
      : "Llegaste al tiempo que acordaste con un adulto. ¡Buen trabajo! Mañana podrás seguir con tus aventuras. Si un adulto lo decide, puede cambiar el tiempo desde su panel.";
  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-labelledby="notice-title">
      <div className="modal">
        <span className="modal-icon" aria-hidden="true">
          {notice === "forest" ? "🌳" : "🌙"}
        </span>
        <h2 id="notice-title">{title}</h2>
        <p>{body}</p>
        <div className="row center">
          <button type="button" className="btn ghost" onClick={dismiss}>
            Volver al mapa
          </button>
          {notice === "forest" && (
            <button type="button" className="btn" onClick={() => go("forest")}>
              Ir al Bosque de la Calma
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WorldPanel() {
  const focus = useApp((state) => state.focusWorld);
  const setFocus = useApp((state) => state.setFocusWorld);
  const records = useApp((state) => state.save.records);
  const start = useApp((state) => state.startSituation);
  const world = WORLDS.find((item) => item.id === focus);
  if (!world) return null;
  const situations = SITUATIONS.filter((item) => item.world === world.id);
  return (
    <aside className="side-panel world-panel">
      <button
        type="button"
        className="round-btn close"
        aria-label="Volver a la isla"
        onClick={() => setFocus(null)}
      >
        ✕
      </button>
      <p className="kicker">
        <span aria-hidden="true">{world.icon}</span> Mundo {WORLDS.indexOf(world) + 1}
      </p>
      <h2>{world.name}</h2>
      <p className="muted">{world.theme}</p>
      <ol className="stops">
        {situations.map((situation) => {
          const record = records[situation.id];
          const explored = record?.explored.length ?? 0;
          return (
            <li key={situation.id}>
              <button type="button" className="stop" onClick={() => start(situation.id)}>
                <span className="stop-n" style={{ background: world.tint }}>
                  {situation.id}
                </span>
                <span className="stop-text">
                  {situation.title}
                  {record && record.plays > 0 ? (
                    <small>Práctica libre · {explored}/5 decisiones exploradas</small>
                  ) : (
                    <small>
                      <span aria-hidden="true">❤️</span> Nueva aventura
                    </small>
                  )}
                </span>
              </button>
              <button
                type="button"
                className="mini-speak"
                aria-label={`Escuchar: ${situation.title}`}
                onClick={() => narrate(situation.title, true)}
              >
                🔊
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/** Mapa de la Academia: una isla con cuatro mundos, el Bosque y los accesos. */
export function MapScreen() {
  const focus = useApp((state) => state.focusWorld);
  const go = useApp((state) => state.go);
  const records = useApp((state) => state.save.records);
  const name = useApp((state) => state.save.avatar?.name);
  const done = Object.values(records).filter((record) => record.plays > 0).length;
  return (
    <>
      {!focus && (
        <div className="map-title">
          <h1>¡Hola, {name}!</h1>
          <p>
            Elige un mundo para empezar · <strong>{done}/30</strong> aventuras vividas
          </p>
        </div>
      )}
      {!focus && <Pins />}
      <WorldPanel />
      {!focus && (
        <nav className="dock" aria-label="Accesos">
          <button type="button" className="dock-btn" onClick={() => go("shop")}>
            <span aria-hidden="true">🛍️</span> Tienda mágica
          </button>
          <button type="button" className="dock-btn" onClick={() => go("superpowers")}>
            <span aria-hidden="true">💖</span> Mis superpoderes
          </button>
          <button type="button" className="dock-btn" onClick={() => go("forest")}>
            <span aria-hidden="true">🌳</span> Bosque de la Calma
          </button>
          <button type="button" className="dock-btn quiet" onClick={() => go("parents")}>
            <span aria-hidden="true">🔒</span> Adultos
          </button>
        </nav>
      )}
      <Notice />
    </>
  );
}
