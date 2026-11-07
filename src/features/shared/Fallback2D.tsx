"use client";

import { useDraftLook } from "@/features/creator/draft";
import { useApp } from "@/state/store";

/** Respaldo 2D sin aceleración gráfica: mismo recorrido, con el personaje dibujado. */
export function Fallback2D() {
  const saved = useApp((state) => state.save.avatar);
  const draft = useDraftLook();
  const look = draft ?? saved;
  return (
    <div className="fallback" aria-hidden="true">
      {look && (
        <svg viewBox="0 0 200 240" width="240">
          <rect x="62" y="130" width="76" height="92" rx="30" fill={look.outfit} />
          <circle cx="100" cy="84" r="66" fill={look.hairColor} />
          <circle cx="100" cy="94" r="58" fill={look.skin} />
          <circle cx="78" cy="92" r="9" fill="var(--ink)" />
          <circle cx="122" cy="92" r="9" fill="var(--ink)" />
          <path
            d="M78 116c8 14 36 14 44 0"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
