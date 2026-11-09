"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

import { situationById, WORLDS } from "@/content/catalog";
import type { AvatarLook } from "@/engine/types";
import { Figure, NPC_LOOKS } from "@/scene/Figure";
import { Backdrop, Forest, Island, SceneProp } from "@/scene/sets";
import { CoinIcon } from "@/features/shared/CoinIcon";
import { useWebGLSupport } from "@/world/runtime";

import { applySkin } from "./skin";
import type { SimStyle } from "./simStyles";

export type SimSceneId = "mapa" | "desafio" | "bosque";

const HERO: Omit<AvatarLook, "name"> = {
  skin: "#d99e6e",
  hairStyle: "curly",
  hairColor: "#2b1d14",
  outfit: "#3fa7d6",
};

interface Shot {
  position: [number, number, number];
  target: [number, number, number];
}

const SHOTS: Record<SimSceneId, Shot> = {
  mapa: { position: [0, 16, 25], target: [0, 0, 0.5] },
  desafio: { position: [0.2, 1.75, 7.4], target: [0.1, 0.72, 0] },
  bosque: { position: [0, 2.1, 8.6], target: [0, 0.9, -1] },
};

/** Etiquetas de los mundos sobre la isla, con la tipografía y los colores del estilo. */
const PINS: { id: string; label: string; icon: string; at: [number, number, number] }[] = [
  ...WORLDS.map((world, i) => ({
    id: world.id,
    label: world.name,
    icon: world.icon,
    at: (
      [
        [-7.2, 3.8, -5.3],
        [7.2, 2.6, -5.3],
        [-7.5, 2.9, 7.1],
        [7.4, 3.6, 7],
      ] as const
    )[i] as [number, number, number],
  })),
  { id: "forest", label: "Bosque de la Calma", icon: "🌳", at: [0, 3.6, -8] },
];

const projected = new Vector3();

function PinProjector({ container }: { container: React.RefObject<HTMLDivElement | null> }) {
  useFrame(({ camera, size }) => {
    const root = container.current;
    if (!root) return;
    for (const pin of PINS) {
      const element = root.querySelector<HTMLElement>(`[data-pin="${pin.id}"]`);
      if (!element) continue;
      projected.set(...pin.at).project(camera);
      const x = ((projected.x + 1) / 2) * size.width;
      const y = ((1 - projected.y) / 2) * size.height;
      element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      element.style.visibility = "visible";
    }
  });
  return null;
}

/** Re-aplica el estilo de vez en cuando: React puede montar piezas nuevas (p. ej. al animar). */
function Skinner({ style }: { style: SimStyle }) {
  const scene = useThree((state) => state.scene);
  const frame = useRef(0);
  useEffect(() => applySkin(scene, style), [scene, style]);
  useFrame(() => {
    frame.current += 1;
    if (frame.current % 30 === 0) applySkin(scene, style);
  });
  return null;
}

/** Al cambiar de escena, la cámara vuelve a su plano; con el dedo o el mouse se puede girar. */
function Camera({ scene }: { scene: SimSceneId }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as unknown as {
    target: Vector3;
    update(): void;
  } | null;
  const size = useThree((state) => state.size);
  useEffect(() => {
    const shot = SHOTS[scene];
    const aspect = size.width / size.height;
    const away = aspect < 1.2 ? 1.2 / aspect : 1;
    const target = new Vector3(...shot.target);
    const position = new Vector3(...shot.position).sub(target).multiplyScalar(away).add(target);
    camera.position.copy(position);
    if (controls) {
      controls.target.copy(target);
      controls.update();
    } else {
      camera.lookAt(target);
    }
  }, [camera, controls, scene, size.width, size.height]);
  return null;
}

function SceneContent({ scene }: { scene: SimSceneId }) {
  if (scene === "mapa") {
    return (
      <group>
        <Island />
        <Figure look={HERO} clip="wave" face="alegria" position={[0, 0.06, 2]} scale={1.5} />
      </group>
    );
  }
  if (scene === "bosque") {
    return (
      <group>
        <Forest />
        <Figure look={HERO} clip="breathe" face="calm" position={[-0.4, 0, 0.4]} scale={1.1} />
      </group>
    );
  }
  const situation = situationById(1);
  return (
    <group>
      <Backdrop set="classroom" />
      {situation && <SceneProp id={situation.prop} take={0} />}
      <Figure look={HERO} clip="worry" face="tristeza" position={[-1.05, 0, 0.1]} facing={0.42} />
      <Figure
        look={NPC_LOOKS.teacher}
        clip="idle"
        face="calm"
        position={[1.12, 0, 0.06]}
        facing={-0.75}
        scale={1.2}
      />
      <Figure
        look={NPC_LOOKS.peer}
        clip="idle"
        face="calm"
        position={[2.15, 0, -0.55]}
        facing={-0.7}
      />
    </group>
  );
}

export function SimViewer({ style, scene }: { style: SimStyle; scene: SimSceneId }) {
  const support = useWebGLSupport();
  const container = useRef<HTMLDivElement>(null);
  const [lost, setLost] = useState(false);
  const ui = style.ui;
  const fonts = style.fonts;

  if (support === false || lost) {
    return (
      <div className="biz-viewer biz-viewer--fallback">
        <p>Este equipo no tiene aceleración 3D: la vista en vivo no está disponible.</p>
      </div>
    );
  }

  return (
    <div
      ref={container}
      className={`biz-viewer biz-overlay--${style.overlay}`}
      style={{ background: style.scene.background }}
    >
      <div className="biz-canvas">
        {support && (
          <Canvas
            shadows="percentage"
            dpr={[1, 2]}
            camera={{ fov: 30, near: 0.1, far: 200, position: SHOTS[scene].position }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", () => setLost(true));
            }}
          >
            <color attach="background" args={[style.scene.background]} />
            {style.scene.fog && (
              <fog
                attach="fog"
                args={[style.scene.fog.color, style.scene.fog.near, style.scene.fog.far]}
              />
            )}
            <hemisphereLight
              args={[style.scene.hemi.sky, style.scene.hemi.ground, style.scene.hemi.intensity]}
            />
            <directionalLight
              color={style.scene.sun.color}
              intensity={style.scene.sun.intensity}
              position={[-5, 11, 8]}
              castShadow
              shadow-mapSize={[1536, 1536]}
              shadow-camera-left={-18}
              shadow-camera-right={18}
              shadow-camera-top={18}
              shadow-camera-bottom={-18}
              shadow-camera-near={1}
              shadow-camera-far={42}
              shadow-bias={-0.0005}
              shadow-normalBias={0.03}
            />
            <SceneContent key={scene} scene={scene} />
            <Skinner style={style} />
            <OrbitControls
              makeDefault
              enablePan={false}
              enableZoom={false}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 2.1}
            />
            <Camera scene={scene} />
            {scene === "mapa" && <PinProjector container={container} />}
          </Canvas>
        )}
      </div>

      {scene === "mapa" &&
        PINS.map((pin) => (
          <span
            key={pin.id}
            data-pin={pin.id}
            className="biz-pin"
            style={{
              background: ui.surface,
              color: ui.ink,
              border: ui.border,
              borderRadius: ui.radius,
              boxShadow: ui.shadow,
              fontFamily: fonts.displayVar,
            }}
          >
            <span aria-hidden="true">{pin.icon}</span> {pin.label}
          </span>
        ))}

      <div className="biz-hud" style={{ fontFamily: fonts.displayVar }}>
        <span
          className="biz-chip"
          style={{ background: ui.surface, color: ui.ink, border: ui.border, boxShadow: ui.shadow }}
        >
          <CoinIcon /> 25
        </span>
        <span
          className="biz-chip"
          style={{ background: ui.surface, color: ui.ink, border: ui.border, boxShadow: ui.shadow }}
        >
          ❤️ 5
        </span>
      </div>

      {scene === "desafio" && <DecisionCard style={style} />}
      {scene === "bosque" && (
        <div
          className="biz-card biz-card--forest"
          style={{
            background: ui.surface,
            color: ui.ink,
            border: ui.border,
            borderRadius: ui.radius,
            boxShadow: ui.shadow,
            fontFamily: fonts.bodyVar,
          }}
        >
          <strong style={{ fontFamily: fonts.displayVar }}>Respira conmigo</strong>
          <span style={{ color: ui.muted }}>
            Inhala mientras la burbuja crece… y suelta despacio.
          </span>
        </div>
      )}
      <div className={`biz-grain biz-grain--${style.overlay}`} aria-hidden="true" />
    </div>
  );
}

function DecisionCard({ style }: { style: SimStyle }) {
  const situation = situationById(1);
  const ui = style.ui;
  if (!situation) return null;
  const options = situation.options.slice(0, 3);
  return (
    <div
      className="biz-card"
      style={{
        background: ui.surface,
        color: ui.ink,
        border: ui.border,
        borderRadius: ui.radius,
        boxShadow: ui.shadow,
        fontFamily: style.fonts.bodyVar,
      }}
    >
      <strong style={{ fontFamily: style.fonts.displayVar }}>{situation.title}</strong>
      <span style={{ color: ui.muted }}>¿Qué puede hacer Chispa?</span>
      <div className="biz-options">
        {options.map((option) => (
          <span
            key={option.id}
            className="biz-option"
            style={{ color: ui.ink, border: `2px solid ${ui.accent}`, borderRadius: ui.radius }}
          >
            <span aria-hidden="true">{option.icon}</span> {option.text}
          </span>
        ))}
      </div>
      <span
        className="biz-help"
        style={{ background: ui.primary, color: ui.onPrimary, borderRadius: ui.radius }}
      >
        🙋 Necesito ayuda
      </span>
    </div>
  );
}
