"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import { Vector3, type Group } from "three";

import { situationById } from "@/content/catalog";
import type { NpcRole, WorldId } from "@/engine/types";
import { useDraftLook } from "@/features/creator/draft";
import { Fallback2D } from "@/features/shared/Fallback2D";
import { useApp, type Challenge } from "@/state/store";
import { initialDpr, nextDpr } from "@/world/quality";
import { useWebGLSupport } from "@/world/runtime";

import { Figure, NPC_LOOKS, type Face } from "./Figure";
import type { Vec3 } from "./kit";
import { MAP_PINS } from "./pins";
import { STAGING, type ClipId } from "./poses";
import { Backdrop, Forest, Island, SceneProp, Sparkles } from "./sets";

interface Shot {
  position: Vec3;
  target: Vec3;
  /** Píxeles tapados abajo y a la derecha por la interfaz. */
  bottom?: number;
  right?: number;
}

const WORLD_FOCUS: Record<WorldId, Shot> = {
  aula: { position: [-6, 7.5, 7.5], target: [-7.2, 1, -5.3], right: 440 },
  recreo: { position: [6, 7.5, 7.5], target: [7.2, 0.6, -5.3], right: 440 },
  paseos: { position: [-6, 7, 19.5], target: [-7.5, 0.8, 7.1], right: 440 },
  casa: { position: [6, 7, 19.5], target: [7.4, 1, 7], right: 440 },
};

function useShot(): Shot {
  const screen = useApp((state) => state.screen);
  const focus = useApp((state) => state.focusWorld);
  const challenge = useApp((state) => state.challenge);
  if (screen === "map") {
    return focus ? WORLD_FOCUS[focus] : { position: [0, 17, 26], target: [0, 0, 0.5] };
  }
  if (screen === "creator") return { position: [0, 1.2, 6.2], target: [0, 0.92, 0], right: 560 };
  if (screen === "shop" || screen === "superpowers") {
    return { position: [0, 1.2, 6.2], target: [0, 0.92, 0], right: 640 };
  }
  if (screen === "challenge" && challenge) {
    const close = challenge.phase === "consequence";
    const choosing = challenge.phase === "choose" || challenge.phase === "feel";
    if (close) return { position: [0.1, 1.45, 6.2], target: [0.1, 0.98, 0], bottom: 110 };
    if (choosing) return { position: [0, 1.5, 7.6], target: [0, 1.02, 0], bottom: 300 };
    if (challenge.phase === "feedback")
      return { position: [-0.2, 1.4, 8], target: [-0.1, 1.02, 0], bottom: 340 };
    return { position: [0, 1.5, 6.6], target: [0, 1, 0], bottom: 170 };
  }
  return { position: [0, 2, 9], target: [0, 1.1, -1], bottom: 200 };
}

const tmpPos = new Vector3();
const tmpTarget = new Vector3();

/** Cámara con suavizado independiente de los FPS; se aleja en pantallas verticales. */
function Rig() {
  const shot = useShot();
  const target = useRef(new Vector3(0, 1, 0));
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const applied = useRef("");
  const first = useRef(true);

  useFrame((_, delta) => {
    const portrait = size.width / size.height;
    const away = portrait < 1.25 ? 1.25 / portrait : 1;
    tmpTarget.set(...shot.target);
    tmpPos.set(...shot.position);
    tmpPos.sub(tmpTarget).multiplyScalar(away).add(tmpTarget);
    const k = first.current ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 3.4);
    first.current = false;
    camera.position.lerp(tmpPos, k);
    target.current.lerp(tmpTarget, k);
    camera.lookAt(target.current);

    // En pantallas angostas los paneles laterales pasan a ser hojas inferiores.
    const compact = size.width < 900;
    const right = compact ? 0 : (shot.right ?? 0);
    const bottom =
      compact && shot.right ? size.height * 0.52 : (shot.bottom ?? 0) * (compact ? 1.4 : 1);
    const key = `${size.width}x${size.height}|${right}|${bottom}`;
    if (key !== applied.current) {
      applied.current = key;
      if (right === 0 && bottom === 0) camera.clearViewOffset();
      else
        camera.setViewOffset(
          size.width,
          size.height,
          right / 2,
          bottom / 2,
          size.width,
          size.height,
        );
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** Baja la densidad de píxeles si no llega a los FPS: pensado para un portátil común o una tableta. */
function Quality() {
  const setDpr = useThree((state) => state.setDpr);
  const meter = useRef({ elapsed: 0, frames: 0, time: 0, dpr: 0 });
  useFrame((_, delta) => {
    const state = meter.current;
    if (state.dpr === 0) state.dpr = initialDpr(window.devicePixelRatio);
    state.elapsed += delta;
    if (state.elapsed < 2) return;
    state.frames += 1;
    state.time += delta;
    if (state.time < 1) return;
    const next = nextDpr(state.dpr, state.frames / state.time);
    state.frames = 0;
    state.time = 0;
    if (next !== state.dpr) {
      state.dpr = next;
      setDpr(next);
    }
  });
  return null;
}

/** La figura del niño con lo que tiene equipado. */
function Hero(props: {
  clip: ClipId;
  face?: Face;
  position?: Vec3;
  facing?: number;
  take?: number | string;
  scale?: number;
}) {
  const avatar = useApp((state) => state.save.avatar);
  const equipped = useApp((state) => state.save.equipped);
  const draft = useDraftLook();
  const look = draft ?? avatar;
  if (!look) return null;
  return <Figure look={look} equipped={equipped} {...props} />;
}

/** Giro suave en el estudio, para que también se vea lo que se lleva en la espalda. */
function Turntable({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.75;
  });
  return <group ref={group}>{children}</group>;
}

function Studio() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#fff0d2" roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.4, 1.45, 0.06, 48]} />
        <meshStandardMaterial color="#ffcf6b" />
      </mesh>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <cylinderGeometry args={[1.12, 1.12, 0.03, 48]} />
        <meshStandardMaterial color="#fff5dc" />
      </mesh>
    </group>
  );
}

const NPC_MARKS: { position: Vec3; facing: number }[] = [
  { position: [1.12, 0, 0.06], facing: -0.75 },
  { position: [2.15, 0, -0.55], facing: -0.7 },
  { position: [-2.05, 0, -0.6], facing: 0.7 },
];

const HERO_MARK: Vec3 = [-1.05, 0, 0.1];

function npcScale(role: NpcRole) {
  return role === "teacher" || role === "adult" || role === "staff" ? 1.2 : 1;
}

function ChallengeScene({ challenge }: { challenge: Challenge }) {
  const situation = situationById(challenge.situation);
  if (!situation) return null;
  const option = situation.options.find((item) => item.id === challenge.option);
  const staging = option ? STAGING[option.react] : null;
  const acting = challenge.phase === "consequence" || challenge.phase === "feedback";
  const feeling = challenge.feeling;
  const firstFeel = situation.feels[0] ?? "tristeza";

  let clip: ClipId = "worry";
  let face: Face = feeling ?? firstFeel;
  if (acting && staging) {
    clip = staging.me;
    face = staging.meFace;
  } else if (challenge.phase === "choose") {
    clip = "idle";
  }

  return (
    <group>
      <Backdrop set={situation.set} rain={situation.rain} />
      <SceneProp id={situation.prop} drop={acting && staging?.drop} take={challenge.take} />
      <Hero clip={clip} face={face} position={HERO_MARK} facing={0.42} take={challenge.take} />
      {situation.npcs.map((role, i) => {
        const mark = NPC_MARKS[i];
        if (!mark) return null;
        // Solo reacciona quien está junto al personaje; los demás miran.
        const npcClip: ClipId =
          acting && staging ? (i === 0 ? staging.them : i === 1 ? "look" : "idle") : "idle";
        const npcFace: Face = acting && staging && i < 2 ? staging.themFace : "calm";
        return (
          <Figure
            key={`${role}${i}`}
            look={NPC_LOOKS[role]}
            clip={npcClip}
            face={npcFace}
            position={mark.position}
            facing={mark.facing}
            scale={npcScale(role)}
            take={challenge.take}
          />
        );
      })}
      {acting && staging?.sparkle && <Sparkles at={HERO_MARK} take={challenge.take} />}
    </group>
  );
}

const projected = new Vector3();

/** Ubica las etiquetas del mapa (botones HTML normales) sobre su lugar en la isla. */
function PinProjector() {
  useFrame(({ camera, size }) => {
    for (const pin of MAP_PINS) {
      const element = document.getElementById(pin.domId);
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

function SceneContent() {
  const screen = useApp((state) => state.screen);
  const challenge = useApp((state) => state.challenge);

  if (screen === "challenge" && challenge) return <ChallengeScene challenge={challenge} />;
  if (screen === "map") {
    return (
      <group>
        <Island />
        <Hero clip="wave" face="alegria" position={[0, 0.06, 2]} scale={1.5} />
        <PinProjector />
      </group>
    );
  }
  if (screen === "forest" || screen === "story" || screen === "tool" || screen === "room") {
    return (
      <group>
        <Forest />
        <Hero clip="breathe" face="calm" position={[-0.4, 0, 0.4]} scale={1.1} facing={0.2} />
      </group>
    );
  }
  return (
    <group>
      <Studio />
      <Turntable>
        <Hero clip="wave" face="alegria" position={[0, 0.09, 0]} />
      </Turntable>
    </group>
  );
}

function skyFor(screen: string, rain: boolean) {
  if (rain) return "#c6d8e2";
  if (screen === "creator" || screen === "shop" || screen === "superpowers") return "#fff0d2";
  if (screen === "forest" || screen === "story" || screen === "tool" || screen === "room")
    return "#c7ecdc";
  return "#a9e2f7";
}

function Sun() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#d9c6a5", 1.55]} />
      <directionalLight
        color="#fff4e2"
        intensity={2.1}
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
        shadow-radius={4}
      />
    </>
  );
}

/** Escenario único montado todo el tiempo: el lienzo no se recrea al cambiar de pantalla. */
export function World() {
  const support = useWebGLSupport();
  const screen = useApp((state) => state.screen);
  const rain = useApp((state) =>
    state.challenge ? Boolean(situationById(state.challenge.situation)?.rain) : false,
  );
  const [lost, setLost] = useState(false);

  if (support === false || lost) return <Fallback2D />;
  if (support === null) return null;
  const hide = screen === "parents";
  return (
    <div className="world" aria-hidden="true" style={{ visibility: hide ? "hidden" : "visible" }}>
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        frameloop={hide ? "never" : "always"}
        camera={{ fov: 30, near: 0.1, far: 200, position: [0, 2, 9] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", () => setLost(true));
        }}
      >
        <color attach="background" args={[skyFor(screen, rain)]} />
        <Sun />
        <Rig />
        <SceneContent />
        <Quality />
      </Canvas>
    </div>
  );
}
