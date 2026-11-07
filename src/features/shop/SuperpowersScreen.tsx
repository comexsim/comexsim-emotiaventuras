"use client";

import { useMemo } from "react";

import { SKILLS } from "@/content/catalog";
import { skillCounts } from "@/engine/progress";
import { narrate } from "@/state/narrator";
import { useApp } from "@/state/store";

/** Muestra lo practicado, sin etiquetar al niño como bueno, malo o inmaduro (V1 §8). */
export function SuperpowersScreen() {
  const log = useApp((state) => state.save.log);
  const counts = useMemo(() => skillCounts(log), [log]);
  const empty = log.length === 0;
  return (
    <aside className="side-panel">
      <p className="kicker">💖 Lo que vas practicando</p>
      <h2>Mis superpoderes</h2>
      {empty && (
        <p className="muted">
          Cada aventura te ayuda a practicar uno o dos superpoderes. ¡Empieza cuando quieras!
        </p>
      )}
      <ul className="skills">
        {SKILLS.map((skill) => (
          <li key={skill.id}>
            <button
              type="button"
              className="skill"
              onClick={() => narrate(`${skill.name}. ${skill.detail}`, true)}
            >
              <span
                className={counts[skill.id] > 0 ? "skill-badge on" : "skill-badge"}
                aria-hidden="true"
              >
                {skill.icon}
              </span>
              <span>
                <strong>{skill.name}</strong>
                <small>{skill.detail}</small>
              </span>
              <span className="skill-count">
                {counts[skill.id]}
                <small>{counts[skill.id] === 1 ? "vez" : "veces"}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
