import type { CSSProperties } from "react";

import { SKILLS, WORLDS } from "@/content/catalog";

import { HOW_STEPS, NUMBERS, TRUST_POINTS, type LandingStyle } from "./landingStyles";

/** Ilustración de la isla en SVG, teñida con los colores de cada propuesta. */
function IslandArt({ style }: { style: LandingStyle }) {
  const t = style.tokens;
  const dark = style.layout === "dark";
  return (
    <svg viewBox="0 0 400 300" className="lp-art" role="img" aria-label="La isla de EmotiAventuras">
      <defs>
        <linearGradient id={`sky-${style.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? "#2c2c5e" : t.soft} />
          <stop offset="1" stopColor={dark ? "#1b1b3a" : t.surface} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="28" fill={`url(#sky-${style.id})`} />
      {dark ? (
        <g fill={t.primary}>
          <circle cx="320" cy="62" r="26" />
          <circle cx="331" cy="55" r="24" fill="#2c2c5e" />
          {[
            [60, 40],
            [120, 80],
            [210, 34],
            [260, 96],
            [36, 120],
            [370, 130],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
          ))}
        </g>
      ) : (
        <g>
          <circle cx="322" cy="66" r="30" fill={t.accent} opacity="0.9" />
          <ellipse cx="96" cy="70" rx="40" ry="14" fill="#ffffff" opacity="0.9" />
          <ellipse cx="124" cy="62" rx="26" ry="12" fill="#ffffff" opacity="0.9" />
        </g>
      )}
      <ellipse
        cx="200"
        cy="246"
        rx="190"
        ry="34"
        fill={dark ? "#3d3d78" : t.accent}
        opacity="0.35"
      />
      <ellipse cx="200" cy="226" rx="150" ry="42" fill={dark ? "#4b6b8c" : "#f2d995"} />
      <ellipse cx="200" cy="214" rx="138" ry="34" fill={dark ? "#3f7f6c" : "#8ed06b"} />
      {/* Los cuatro mundos y el bosque */}
      <g>
        <rect x="92" y="168" width="40" height="30" rx="6" fill={dark ? "#ffe9a8" : "#fbe6b8"} />
        <path d="M88 170 L112 150 L136 170 Z" fill={t.primary} />
        <rect x="262" y="172" width="38" height="26" rx="6" fill={dark ? "#b9a9ff" : "#fbd9d0"} />
        <path d="M258 174 L281 156 L304 174 Z" fill={t.accent} />
        <circle cx="200" cy="160" r="22" fill={dark ? "#7fe0c4" : "#4fb05c"} />
        <circle cx="184" cy="172" r="15" fill={dark ? "#5cc2a6" : "#7dc95a"} />
        <circle cx="218" cy="172" r="15" fill={dark ? "#5cc2a6" : "#7dc95a"} />
        <rect x="196" y="176" width="8" height="18" rx="3" fill="#90633d" />
      </g>
      {/* El personaje saludando */}
      <g transform="translate(200 206)">
        <ellipse cx="0" cy="28" rx="18" ry="5" fill="#000" opacity="0.12" />
        <rect x="-11" y="2" width="22" height="24" rx="9" fill={t.primary} />
        <circle cx="0" cy="-10" r="15" fill="#d99e6e" />
        <path d="M-15 -14 Q0 -32 15 -14 Q8 -20 0 -20 Q-8 -20 -15 -14 Z" fill="#2b1d14" />
        <circle cx="-5" cy="-10" r="2" fill="#33262a" />
        <circle cx="5" cy="-10" r="2" fill="#33262a" />
        <path
          d="M-5 -4 Q0 0 5 -4"
          stroke="#33262a"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="10"
          y="-6"
          width="6"
          height="16"
          rx="3"
          fill={t.primary}
          transform="rotate(-35 13 2)"
        />
      </g>
    </svg>
  );
}

function Hero({ style }: { style: LandingStyle }) {
  const c = style.copy;
  return (
    <header className="lp-hero">
      <div className="lp-hero-text">
        <p className="lp-kicker">{c.kicker}</p>
        <h3 className="lp-title">{c.title}</h3>
        <p className="lp-lead">{c.lead}</p>
        <div className="lp-actions">
          <span className="lp-btn">{c.cta}</span>
          <span className="lp-btn lp-btn--ghost">{c.secondary}</span>
        </div>
        <ul className="lp-badges">
          <li>🔒 Sin datos personales</li>
          <li>🚫 Sin anuncios</li>
          <li>🌱 Sin presión</li>
        </ul>
      </div>
      <div className="lp-hero-art">
        <IslandArt style={style} />
      </div>
    </header>
  );
}

function Numbers() {
  return (
    <div className="lp-numbers">
      {NUMBERS.map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function How({ style }: { style: LandingStyle }) {
  return (
    <section className="lp-section">
      <h4 className="lp-h">{style.copy.howTitle}</h4>
      <ol className="lp-steps">
        {HOW_STEPS.map((step, i) => (
          <li key={step.title} className="lp-card">
            <span className="lp-step-icon" aria-hidden="true">
              {step.icon}
            </span>
            <span className="lp-step-n">Paso {i + 1}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="lp-worlds">
        {WORLDS.map((world) => (
          <span key={world.id} className="lp-world">
            <span aria-hidden="true">{world.icon}</span> {world.name}
          </span>
        ))}
      </div>
    </section>
  );
}

function Learn({ style }: { style: LandingStyle }) {
  return (
    <section className="lp-section lp-section--soft">
      <h4 className="lp-h">{style.copy.learnTitle}</h4>
      <ul className="lp-skills">
        {SKILLS.map((skill) => (
          <li key={skill.id} className="lp-card">
            <span aria-hidden="true" className="lp-step-icon">
              {skill.icon}
            </span>
            <strong>{skill.name}</strong>
            <p>{skill.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Trust({ style }: { style: LandingStyle }) {
  const c = style.copy;
  return (
    <section className="lp-section">
      <div className="lp-trust">
        <div>
          <h4 className="lp-h">{c.trustTitle}</h4>
          <p className="lp-lead">{c.trustLead}</p>
          <p className="lp-note">
            Antes del lanzamiento, un profesional de psicología infantil revisa cada situación y
            cada cuento.
          </p>
        </div>
        <ul className="lp-trust-list">
          {TRUST_POINTS.map((point) => (
            <li key={point.text}>
              <span aria-hidden="true">{point.icon}</span> {point.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="lp-school">
        <div>
          <strong className="lp-h lp-h--small">{c.schoolTitle}</strong>
          <p>{c.schoolLead}</p>
        </div>
        <span className="lp-btn">Hablar con el equipo</span>
      </div>
    </section>
  );
}

export function Landing({ style }: { style: LandingStyle }) {
  const t = style.tokens;
  const vars = {
    "--lp-bg": t.bg,
    "--lp-surface": t.surface,
    "--lp-ink": t.ink,
    "--lp-muted": t.muted,
    "--lp-primary": t.primary,
    "--lp-on-primary": t.onPrimary,
    "--lp-accent": t.accent,
    "--lp-soft": t.soft,
    "--lp-line": t.line,
    "--lp-display": style.fonts.displayVar,
    "--lp-body": style.fonts.bodyVar,
  } as CSSProperties;
  return (
    <div className={`lp lp--${style.layout}`} style={vars}>
      <nav className="lp-nav" aria-label="Menú de la maqueta">
        <span className="lp-logo">
          <span aria-hidden="true">🌟</span> EmotiAventuras
        </span>
        <span className="lp-nav-links">
          <span>Cómo funciona</span>
          <span>Seguridad</span>
          <span>Colegios</span>
        </span>
        <span className="lp-btn lp-btn--small">{style.copy.cta}</span>
      </nav>
      <Hero style={style} />
      <Numbers />
      <How style={style} />
      <Learn style={style} />
      <Trust style={style} />
      <footer className="lp-footer">
        EmotiAventuras · Bienestar emocional para niños de 5 a 9 años · Privacidad · Contacto
      </footer>
    </div>
  );
}
