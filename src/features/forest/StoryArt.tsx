import type { Mood, Story } from "@/content/stories";

const MOUTHS: Record<Mood, string> = {
  calm: "M-12 8 q12 9 24 0",
  joy: "M-16 5 q16 20 32 0",
  sad: "M-12 15 q12 -11 24 0",
  angry: "M-13 11 h26",
  scared: "M-6 11 a6 7 0 1 0 12 0 a6 7 0 1 0 -12 0",
};

/** Cara compartida por los protagonistas: el ánimo de la página se lee sin saber leer. */
function FaceAt({ x, y, mood, scale = 1 }: { x: number; y: number; mood: Mood; scale?: number }) {
  const ink = "var(--ink)";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="-16" cy="-6" r={mood === "scared" ? 7 : 5.5} fill={ink} />
      <circle cx="16" cy="-6" r={mood === "scared" ? 7 : 5.5} fill={ink} />
      {mood === "angry" && (
        <path
          d="M-25 -19 l15 6 M25 -19 l-15 6"
          stroke={ink}
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
      {mood === "sad" && (
        <path
          d="M-24 -14 l14 -5 M24 -14 l-14 -5"
          stroke={ink}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      <path d={MOUTHS[mood]} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      {mood === "sad" && <ellipse cx="-20" cy="9" rx="3.2" ry="5" fill="var(--sky)" />}
    </g>
  );
}

const LIGHT: Record<Mood, number> = { angry: 0, scared: 0, sad: 1, calm: 1, joy: 2 };

function Scene({ art, mood }: { art: Story["art"]; mood: Mood }) {
  switch (art) {
    case "traffic": {
      const lit = LIGHT[mood];
      return (
        <>
          <rect x="185" y="175" width="30" height="85" fill="var(--grey)" />
          <rect x="150" y="30" width="100" height="165" rx="24" fill="var(--ink)" />
          {["var(--coral)", "var(--sun)", "var(--leaf)"].map((color, i) => (
            <circle
              key={color}
              cx="200"
              cy={65 + i * 48}
              r="20"
              fill={color}
              opacity={lit === i ? 1 : 0.28}
            />
          ))}
          <g transform="translate(290 215)">
            <ellipse rx="22" ry="27" fill="var(--wood)" />
            <path d="M16 12 q34 -10 18 -42 q-18 -10 -18 20" fill="var(--wood)" />
            <FaceAt x={0} y={-5} mood={mood} scale={0.48} />
          </g>
        </>
      );
    }
    case "volcano":
      return (
        <>
          <path d="M60 270 L165 75 h70 L340 270 Z" fill="var(--wood-dark)" />
          <path
            d="M165 75 h70 l-12 28 q-23 16 -46 0 Z"
            fill={mood === "angry" ? "var(--coral)" : "var(--sun)"}
          />
          {mood === "angry" && (
            <g fill="var(--coral)">
              <circle cx="180" cy="50" r="9" />
              <circle cx="205" cy="30" r="12" />
              <circle cx="228" cy="52" r="8" />
            </g>
          )}
          {mood !== "angry" && (
            <ellipse cx="205" cy="52" rx="24" ry="13" fill="var(--surface)" opacity="0.8" />
          )}
          <g transform="translate(200 170)">
            <circle r="40" fill="var(--wood-light)" />
          </g>
          <FaceAt x={200} y={170} mood={mood} scale={1.2} />
        </>
      );
    case "turtle":
      return (
        <>
          <ellipse cx="295" cy="205" rx="26" ry="20" fill="var(--leaf-light)" />
          <rect x="130" y="222" width="30" height="28" rx="10" fill="var(--leaf-light)" />
          <rect x="235" y="222" width="30" height="28" rx="10" fill="var(--leaf-light)" />
          <path d="M100 232 a100 90 0 0 1 200 0 Z" fill="var(--leaf)" />
          <g fill="var(--leaf-dark)">
            <circle cx="165" cy="190" r="17" />
            <circle cx="225" cy="185" r="18" />
            <circle cx="195" cy="155" r="13" />
          </g>
          <FaceAt x={298} y={205} mood={mood} scale={0.5} />
        </>
      );
    case "tower": {
      const count = mood === "sad" ? 2 : mood === "joy" ? 6 : 4;
      const colors = [
        "var(--coral)",
        "var(--sun)",
        "var(--sky)",
        "var(--leaf)",
        "var(--violet)",
        "var(--coral)",
      ];
      return (
        <>
          {Array.from({ length: count }, (_, i) => (
            <rect
              key={i}
              x={118 + (i % 2) * 6}
              y={236 - i * 36}
              width="86"
              height="34"
              rx="6"
              fill={colors[i]}
            />
          ))}
          {mood === "sad" && (
            <>
              <rect
                x="218"
                y="240"
                width="46"
                height="30"
                rx="6"
                fill="var(--sky)"
                transform="rotate(18 240 255)"
              />
              <rect
                x="70"
                y="243"
                width="42"
                height="30"
                rx="6"
                fill="var(--leaf)"
                transform="rotate(-14 90 258)"
              />
            </>
          )}
          <g transform="translate(290 190)">
            <rect x="-22" y="26" width="44" height="52" rx="18" fill="var(--sky)" />
            <circle r="36" fill="var(--skin)" />
            <path d="M-36 -8 a36 36 0 0 1 72 0 q-36 -18 -72 0" fill="var(--wood-dark)" />
            <FaceAt x={0} y={4} mood={mood} scale={0.62} />
          </g>
        </>
      );
    }
    case "hedgehog":
      return (
        <>
          <g fill="var(--wood-dark)">
            {Array.from({ length: 13 }, (_, i) => {
              const angle = -3 + (i / 12) * 2.9;
              const out = mood === "angry" ? 125 : 104;
              const x = 180 + Math.cos(angle) * 78;
              const y = 205 + Math.sin(angle) * 72;
              const tx = 180 + Math.cos(angle) * out;
              const ty = 205 + Math.sin(angle) * out;
              const px = -Math.sin(angle) * 11;
              const py = Math.cos(angle) * 11;
              return (
                <path key={i} d={`M${x + px} ${y + py} L${tx} ${ty} L${x - px} ${y - py} Z`} />
              );
            })}
          </g>
          <ellipse cx="180" cy="205" rx="84" ry="66" fill="var(--wood)" />
          <ellipse cx="238" cy="222" rx="50" ry="44" fill="var(--wood-light)" />
          <FaceAt x={240} y={220} mood={mood} scale={0.75} />
          <circle cx="288" cy="226" r="8" fill="var(--ink)" />
        </>
      );
    case "cloud": {
      const color =
        mood === "joy"
          ? "var(--sun)"
          : mood === "sad"
            ? "var(--sky)"
            : mood === "angry"
              ? "var(--coral)"
              : mood === "scared"
                ? "var(--violet)"
                : "var(--surface)";
      return (
        <>
          <g fill={color}>
            <circle cx="135" cy="135" r="55" />
            <circle cx="205" cy="105" r="72" />
            <circle cx="275" cy="135" r="55" />
            <rect x="95" y="135" width="220" height="55" rx="27" />
          </g>
          <FaceAt x={205} y={135} mood={mood} />
          {mood === "sad" && (
            <g fill="var(--sky-dark)">
              <ellipse cx="140" cy="215" rx="6" ry="11" />
              <ellipse cx="195" cy="235" rx="6" ry="11" />
              <ellipse cx="250" cy="215" rx="6" ry="11" />
            </g>
          )}
        </>
      );
    }
  }
}

/** Ilustración de cada página: los personajes de los cuentos cambian de cara con la historia. */
export function StoryArt({ art, mood }: { art: Story["art"]; mood: Mood }) {
  return (
    <svg className="story-art" viewBox="0 0 400 290" role="img" aria-hidden="true">
      <rect width="400" height="290" fill="var(--forest-sky)" />
      <circle cx="350" cy="50" r="24" fill="var(--sun)" opacity="0.8" />
      <rect y="250" width="400" height="40" fill="var(--leaf-light)" />
      <Scene art={art} mood={mood} />
    </svg>
  );
}
