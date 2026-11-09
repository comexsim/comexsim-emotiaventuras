"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { Landing } from "./Landing";
import { LANDING_STYLES, landingById, type LandingStyle } from "./landingStyles";
import { SIM_STYLES, simStyleById, type SimStyle, type Swatch } from "./simStyles";
import type { SimSceneId } from "./SimViewer";

const SimViewer = dynamic(() => import("./SimViewer").then((module) => module.SimViewer), {
  ssr: false,
  loading: () => <div className="biz-viewer biz-viewer--loading">Preparando la escena…</div>,
});

type Tab = "simulador" | "web";

const SCENES: { id: SimSceneId; label: string; icon: string }[] = [
  { id: "mapa", label: "Mapa de mundos", icon: "🗺️" },
  { id: "desafio", label: "Desafío en el aula", icon: "🏫" },
  { id: "bosque", label: "Bosque de la Calma", icon: "🌳" },
];

interface View {
  tab: Tab;
  sim: SimStyle;
  scene: SimSceneId;
  landing: LandingStyle;
}

const DEFAULT_VIEW: View = {
  tab: "simulador",
  sim: SIM_STYLES[0]!,
  scene: "mapa",
  landing: LANDING_STYLES[0]!,
};

/** El hash permite compartir un enlace directo a un estilo: #simulador/acuarela/desafio o #web/noche. */
function readHash(current: View): View {
  const [tab, id, scene] = window.location.hash.replace("#", "").split("/");
  if (tab === "web") {
    return { ...current, tab: "web", landing: landingById(id ?? "") ?? current.landing };
  }
  if (tab === "simulador") {
    const nextScene = SCENES.find((item) => item.id === scene)?.id ?? current.scene;
    return {
      ...current,
      tab: "simulador",
      sim: simStyleById(id ?? "") ?? current.sim,
      scene: nextScene,
    };
  }
  return current;
}

function writeHash(view: View) {
  const hash =
    view.tab === "web" ? `#web/${view.landing.id}` : `#simulador/${view.sim.id}/${view.scene}`;
  window.history.replaceState(null, "", hash);
}

function Palette({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="biz-palette">
      {swatches.map((swatch) => (
        <li key={swatch.hex + swatch.name}>
          <span className="biz-swatch" style={{ background: swatch.hex }} />
          <span>
            <strong>{swatch.name}</strong>
            <code>{swatch.hex}</code>
          </span>
        </li>
      ))}
    </ul>
  );
}

function FontSample({
  display,
  body,
  displayVar,
  bodyVar,
  sample,
}: {
  display: string;
  body: string;
  displayVar: string;
  bodyVar: string;
  sample: string;
}) {
  return (
    <div className="biz-fonts">
      <p style={{ fontFamily: displayVar }} className="biz-font-display">
        {display} <span>Aa</span>
      </p>
      <p style={{ fontFamily: bodyVar }} className="biz-font-body">
        <strong>{body}:</strong> {sample}
      </p>
    </div>
  );
}

function SimSection({ view, set }: { view: View; set: (next: Partial<View>) => void }) {
  const style = view.sim;
  return (
    <section aria-labelledby="sim-title">
      <div className="biz-intro">
        <h2 id="sim-title">Estilos gráficos del simulador</h2>
        <p>
          Es la escena real del simulador, en vivo. Cada estilo cambia materiales, luces y paleta
          sobre las mismas piezas: puedes girar la vista con el dedo o el mouse.
        </p>
      </div>
      <div className="biz-chips" role="tablist" aria-label="Estilo del simulador">
        {SIM_STYLES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === style.id}
            className="biz-chip-btn"
            onClick={() => set({ sim: item })}
          >
            <span className="biz-chip-n">{i === 0 ? "Hoy" : i}</span> {item.name}
          </button>
        ))}
      </div>
      <div className="biz-sim">
        <div className="biz-sim-stage">
          <div className="biz-scenes" role="tablist" aria-label="Escena">
            {SCENES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === view.scene}
                onClick={() => set({ scene: item.id })}
              >
                <span aria-hidden="true">{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
          <SimViewer style={style} scene={view.scene} />
        </div>
        <aside className="biz-panel">
          <p className="biz-effort">Esfuerzo para llevarlo a todo el simulador: {style.effort}</p>
          <h3>{style.name}</h3>
          <p className="biz-tagline">{style.tagline}</p>
          <p>{style.description}</p>
          <div className="biz-two">
            <div>
              <h4>A favor</h4>
              <ul>
                {style.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>A cuidar</h4>
              <ul>
                {style.risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <h4>Paleta</h4>
          <Palette swatches={style.palette} />
          <h4>Tipografía</h4>
          <FontSample {...style.fonts} sample="Chispa levanta la mano y pide una pista." />
        </aside>
      </div>
    </section>
  );
}

function WebSection({ view, set }: { view: View; set: (next: Partial<View>) => void }) {
  const style = view.landing;
  return (
    <section aria-labelledby="web-title">
      <div className="biz-intro">
        <h2 id="web-title">Estilos de la página web oficial</h2>
        <p>
          La web la leen los padres y los colegios, que son quienes deciden. Seis direcciones con
          textos reales del producto. El benchmarking está en{" "}
          <code>docs/linea-grafica/benchmarking.md</code>.
        </p>
      </div>
      <div className="biz-chips" role="tablist" aria-label="Estilo de la web">
        {LANDING_STYLES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === style.id}
            className="biz-chip-btn"
            onClick={() => set({ landing: item })}
          >
            <span className="biz-chip-n">{i + 1}</span> {item.name}
          </button>
        ))}
      </div>
      <div className="biz-web-spec">
        <div>
          <h3>{style.name}</h3>
          <p className="biz-tagline">{style.idea}</p>
          <p>
            <strong>Tono de voz:</strong> {style.voice}
          </p>
          <p>
            <strong>Se inspira en:</strong> {style.inspiredBy.join(", ")}
          </p>
        </div>
        <div>
          <h4>Paleta</h4>
          <Palette swatches={style.palette} />
        </div>
        <div>
          <h4>Par tipográfico (Google Fonts)</h4>
          <FontSample {...style.fonts} sample="Un lugar seguro para practicar emociones." />
        </div>
      </div>
      <div className="biz-browser">
        <div className="biz-browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <em>emotiaventuras.com</em>
        </div>
        <Landing key={style.id} style={style} />
      </div>
    </section>
  );
}

export function BusinessPage() {
  const [view, setView] = useState<View>(DEFAULT_VIEW);

  useEffect(() => {
    const sync = () => setView((current) => readHash(current));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const set = useCallback((next: Partial<View>) => {
    setView((current) => {
      const merged = { ...current, ...next };
      writeHash(merged);
      return merged;
    });
  }, []);

  // El acento del marco debe leerse sobre fondo claro: en la propuesta oscura se usa su índigo.
  const landingAccent =
    view.landing.layout === "dark" ? view.landing.tokens.surface : view.landing.tokens.primary;
  const accent = view.tab === "web" ? landingAccent : view.sim.ui.primary;

  return (
    <div className="biz-page" style={{ "--biz-accent": accent } as CSSProperties}>
      <header className="biz-top">
        <div className="biz-brand">
          <span aria-hidden="true">🌟</span>
          <div>
            <strong>EmotiAventuras</strong>
            <span>Línea gráfica · documento interno para decidir</span>
          </div>
        </div>
        <nav className="biz-tabs" role="tablist" aria-label="Apartado">
          <button
            type="button"
            role="tab"
            aria-selected={view.tab === "simulador"}
            onClick={() => set({ tab: "simulador" })}
          >
            🏝️ Simulador <span>{SIM_STYLES.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view.tab === "web"}
            onClick={() => set({ tab: "web" })}
          >
            👪 Web para padres <span>{LANDING_STYLES.length}</span>
          </button>
        </nav>
      </header>
      <main className="biz-main">
        {view.tab === "simulador" ? (
          <SimSection view={view} set={set} />
        ) : (
          <WebSection view={view} set={set} />
        )}
      </main>
    </div>
  );
}
