"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group } from "three";

import type { AccessorySlot, AvatarLook, Emotion } from "@/engine/types";

import { Ball, Block, C, Cyl, mat, type Vec3 } from "./kit";
import { poseAt, type ClipId } from "./poses";

export type Face = Emotion | "calm";

const shade = (hex: string, factor: number) => {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((value >> shift) & 255) * factor);
  const out = (channel(16) << 16) | (channel(8) << 8) | channel(0);
  return `#${out.toString(16).padStart(6, "0")}`;
};

interface FaceShape {
  eye: number;
  brow: number;
  browY: number;
  mouth: "smile" | "bigSmile" | "frown" | "flat" | "o" | "small";
  cheek: number;
}

const FACES: Record<Face, FaceShape> = {
  calm: { eye: 1, brow: 0, browY: 0, mouth: "smile", cheek: 0.45 },
  alegria: { eye: 1.05, brow: -0.1, browY: 0.02, mouth: "bigSmile", cheek: 0.7 },
  tristeza: { eye: 0.92, brow: 0.42, browY: 0.01, mouth: "frown", cheek: 0.25 },
  enojo: { eye: 0.82, brow: -0.5, browY: -0.02, mouth: "flat", cheek: 0.6 },
  miedo: { eye: 1.22, brow: 0.46, browY: 0.04, mouth: "o", cheek: 0.1 },
  verguenza: { eye: 0.9, brow: 0.22, browY: 0, mouth: "small", cheek: 1 },
};

function Mouth({ kind }: { kind: FaceShape["mouth"] }) {
  const ink = mat(C.ink, 0.6);
  if (kind === "o") {
    return (
      <mesh position={[0, -0.13, 0.34]} scale={[0.9, 1.15, 0.45]} material={ink}>
        <sphereGeometry args={[0.052, 14, 12]} />
      </mesh>
    );
  }
  if (kind === "flat" || kind === "small") {
    const width = kind === "flat" ? 0.07 : 0.035;
    return (
      <mesh position={[0, -0.13, 0.345]} rotation-z={Math.PI / 2} material={ink}>
        <capsuleGeometry args={[0.014, width * 2, 4, 8]} />
      </mesh>
    );
  }
  const smile = kind !== "frown";
  const radius = kind === "bigSmile" ? 0.09 : 0.07;
  return (
    <mesh
      position={[0, smile ? -0.1 : -0.17, 0.335]}
      rotation-z={smile ? Math.PI : 0}
      material={ink}
    >
      <torusGeometry args={[radius, 0.016, 8, 16, Math.PI]} />
    </mesh>
  );
}

function Eye({ side, shape }: { side: 1 | -1; shape: FaceShape }) {
  const x = side * 0.135;
  return (
    <group position={[x, 0.02, 0.3]}>
      <mesh scale={[0.92 * shape.eye, 1.1 * shape.eye, 0.5]} material={mat(C.white, 0.35)}>
        <sphereGeometry args={[0.085, 14, 12]} />
      </mesh>
      <mesh position={[0, 0, 0.038]} scale={[1, 1.05, 0.5]} material={mat(C.ink, 0.25)}>
        <sphereGeometry args={[0.052 * Math.min(shape.eye, 1.05), 14, 12]} />
      </mesh>
      <mesh position={[0.016, 0.02, 0.066]} material={mat(C.white, 0.2)}>
        <sphereGeometry args={[0.014, 8, 8]} />
      </mesh>
      <mesh
        position={[0, 0.125 + shape.browY, 0.015]}
        rotation-z={Math.PI / 2 + side * shape.brow}
        material={mat(C.ink, 0.7)}
      >
        <capsuleGeometry args={[0.011, 0.075, 4, 8]} />
      </mesh>
    </group>
  );
}

function Hair({ look }: { look: Pick<AvatarLook, "hairColor" | "hairStyle"> }) {
  const color = look.hairColor;
  const m = mat(color, 0.62);
  const cap = (
    <mesh position={[0, 0.03, -0.015]} rotation-x={-0.32} material={m} castShadow>
      <sphereGeometry args={[0.392, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
    </mesh>
  );
  switch (look.hairStyle) {
    case "short":
      return (
        <>
          {cap}
          <Ball r={0.11} at={[0.17, 0.28, 0.25]} color={color} scale={[1.3, 0.7, 0.9]} />
          <Ball r={0.1} at={[0, 0.3, 0.28]} color={color} scale={[1.4, 0.7, 0.8]} />
        </>
      );
    case "curly":
      return (
        <>
          {cap}
          {[
            [0, 0.38, 0.05],
            [0.2, 0.33, 0.14],
            [-0.2, 0.33, 0.14],
            [0.32, 0.16, 0.05],
            [-0.32, 0.16, 0.05],
            [0.18, 0.28, -0.22],
            [-0.18, 0.28, -0.22],
            [0, 0.24, 0.29],
            [0.35, -0.02, -0.08],
            [-0.35, -0.02, -0.08],
          ].map((at, i) => (
            <Ball key={i} r={0.125} at={at as Vec3} color={color} />
          ))}
        </>
      );
    case "long":
      return (
        <>
          {cap}
          <Ball r={0.36} at={[0, -0.14, -0.14]} color={color} scale={[1.08, 1.35, 0.72]} />
          <Ball r={0.13} at={[0.32, -0.16, 0.08]} color={color} scale={[0.8, 2, 0.9]} />
          <Ball r={0.13} at={[-0.32, -0.16, 0.08]} color={color} scale={[0.8, 2, 0.9]} />
        </>
      );
    case "buns":
      return (
        <>
          {cap}
          <Ball r={0.15} at={[0.26, 0.36, -0.05]} color={color} />
          <Ball r={0.15} at={[-0.26, 0.36, -0.05]} color={color} />
        </>
      );
    case "spiky":
      return (
        <>
          {cap}
          {[
            [0, 0.42, 0.04, 0, 0],
            [0.17, 0.38, 0.08, 0.5, 0],
            [-0.17, 0.38, 0.08, -0.5, 0],
            [0.08, 0.38, -0.14, 0.2, -0.5],
            [-0.08, 0.38, -0.14, -0.2, -0.5],
            [0, 0.32, 0.22, 0, 0.6],
          ].map(([x, y, z, rz, rx], i) => (
            <mesh key={i} position={[x!, y!, z!]} rotation={[rx!, 0, -rz!]} material={m} castShadow>
              <coneGeometry args={[0.095, 0.25, 8]} />
            </mesh>
          ))}
        </>
      );
    case "braids":
      return (
        <>
          {cap}
          {[1, -1].map((side) => (
            <group key={side}>
              <Ball r={0.085} at={[side * 0.36, -0.1, -0.02]} color={color} />
              <Ball r={0.075} at={[side * 0.38, -0.23, -0.01]} color={color} />
              <Ball r={0.065} at={[side * 0.39, -0.34, 0]} color={color} />
              <Ball r={0.05} at={[side * 0.39, -0.43, 0]} color={C.red} />
            </group>
          ))}
        </>
      );
  }
}

/** Sombreros, lentes y antifaz: van en la cabeza. */
function HeadWear({ head, face }: { head?: string; face?: string }) {
  return (
    <>
      {head === "cap" && (
        <>
          <mesh position={[0, 0.16, 0]} material={mat(C.red)} castShadow>
            <sphereGeometry args={[0.4, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
          </mesh>
          <Ball r={0.24} at={[0, 0.2, 0.34]} color={C.yellow} scale={[1, 0.14, 0.95]} />
        </>
      )}
      {head === "starBand" && (
        <>
          <mesh position={[0, 0.24, 0]} rotation-x={Math.PI / 2 - 0.25} material={mat(C.violet)}>
            <torusGeometry args={[0.33, 0.022, 8, 24]} />
          </mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <mesh
              key={x}
              position={[x, 0.42 - Math.abs(x) * 0.25, 0.2]}
              rotation-z={0.3}
              material={mat(C.yellow, 0.3)}
              castShadow
            >
              <octahedronGeometry args={[0.07, 0]} />
            </mesh>
          ))}
        </>
      )}
      {head === "explorerHat" && (
        <>
          <Cyl r={0.56} h={0.04} at={[0, 0.2, 0]} color={C.woodLight} />
          <Cyl r={0.34} top={0.28} h={0.24} at={[0, 0.22, 0]} color={C.woodLight} />
          <Cyl r={0.345} h={0.05} at={[0, 0.23, 0]} color={C.woodDark} />
        </>
      )}
      {head === "crown" && (
        <>
          <Cyl r={0.26} h={0.1} at={[0, 0.34, 0]} color={C.yellow} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.sin(a) * 0.25, 0.49, Math.cos(a) * 0.25]}
                material={mat(C.yellow)}
                castShadow
              >
                <coneGeometry args={[0.07, 0.14, 6]} />
              </mesh>
            );
          })}
          <Ball r={0.04} at={[0, 0.39, 0.26]} color={C.red} />
        </>
      )}
      {head === "wizardHat" && (
        <>
          <Cyl r={0.48} h={0.04} at={[0, 0.2, 0]} color={C.violet} />
          <mesh position={[0, 0.54, -0.02]} rotation-x={-0.1} material={mat(C.violet)} castShadow>
            <coneGeometry args={[0.31, 0.66, 18]} />
          </mesh>
          <Ball r={0.05} at={[0.1, 0.5, 0.22]} color={C.yellow} />
          <Ball r={0.035} at={[-0.08, 0.68, 0.14]} color={C.yellow} />
        </>
      )}
      {(face === "funGlasses" || face === "heartGlasses") &&
        [1, -1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.135, 0.025, 0.36]}
            material={mat(face === "funGlasses" ? C.orange : C.pink, 0.3)}
          >
            {face === "funGlasses" ? (
              <torusGeometry args={[0.105, 0.022, 8, 5]} />
            ) : (
              <torusGeometry args={[0.1, 0.025, 8, 3]} />
            )}
          </mesh>
        ))}
      {(face === "funGlasses" || face === "heartGlasses") && (
        <Block
          size={[0.07, 0.02, 0.02]}
          at={[0, 0.02, 0.37]}
          color={face === "funGlasses" ? C.orange : C.pink}
          radius={0.005}
          shadow={false}
        />
      )}
      {face === "mask" && (
        <mesh
          position={[0, 0.03, 0.03]}
          rotation-x={Math.PI / 2}
          scale={[1, 1, 1]}
          material={mat(C.blue)}
        >
          <cylinderGeometry args={[0.358, 0.358, 0.17, 24, 1, true, -1.15, 2.3]} />
        </mesh>
      )}
    </>
  );
}

function BackWear({ kind, color }: { kind?: string; color: string }) {
  const cape = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (cape.current) cape.current.rotation.x = 0.16 + Math.sin(clock.elapsedTime * 2) * 0.05;
  });
  if (kind === "backpack") {
    return (
      <group position={[0, 0.62, -0.2]}>
        <Block size={[0.32, 0.36, 0.14]} at={[0, -0.1, 0]} color={C.red} radius={0.06} />
        <Block size={[0.32, 0.08, 0.145]} at={[0, 0.02, 0]} color={C.yellow} radius={0.02} />
        <Block size={[0.32, 0.08, 0.145]} at={[0, 0.1, 0]} color={C.blue} radius={0.02} />
      </group>
    );
  }
  if (kind === "cape") {
    return (
      <group ref={cape} position={[0, 0.88, -0.17]}>
        <Block size={[0.46, 0.68, 0.035]} at={[0, -0.68, 0]} color={C.red} radius={0.015} />
        <Ball r={0.05} at={[0.17, 0.01, 0.06]} color={C.yellow} />
        <Ball r={0.05} at={[-0.17, 0.01, 0.06]} color={C.yellow} />
      </group>
    );
  }
  if (kind === "wings") {
    return (
      <group position={[0, 0.7, -0.2]}>
        {[1, -1].map((side) => (
          <group key={side} rotation-y={side * 0.35}>
            <Ball
              r={0.22}
              at={[side * 0.27, 0.12, -0.03]}
              color={C.pink}
              scale={[1.05, 1.15, 0.12]}
            />
            <Ball
              r={0.15}
              at={[side * 0.24, -0.15, -0.03]}
              color={C.violet}
              scale={[1, 1.1, 0.12]}
            />
          </group>
        ))}
      </group>
    );
  }
  return kind ? null : <group userData={{ color }} />;
}

function Companion({ kind }: { kind?: string }) {
  const body = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (body.current) body.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 3)) * 0.05;
  });
  if (!kind) return null;
  const eyes = (y: number, z: number, x = 0.06) => (
    <>
      <Ball r={0.024} at={[x, y, z]} color={C.ink} rough={0.2} />
      <Ball r={0.024} at={[-x, y, z]} color={C.ink} rough={0.2} />
    </>
  );
  return (
    <group position={[-0.58, 0, 0.22]}>
      <group ref={body}>
        {kind === "chick" && (
          <>
            <Ball r={0.15} at={[0, 0.16, 0]} color={C.yellow} />
            <Ball r={0.11} at={[0, 0.34, 0.03]} color={C.yellow} />
            {eyes(0.37, 0.12, 0.05)}
            <mesh position={[0, 0.33, 0.15]} rotation-x={Math.PI / 2} material={mat(C.orange)}>
              <coneGeometry args={[0.03, 0.07, 6]} />
            </mesh>
          </>
        )}
        {kind === "kitten" && (
          <>
            <Ball r={0.15} at={[0, 0.15, -0.04]} color={C.orange} scale={[1, 0.95, 1.2]} />
            <Ball r={0.13} at={[0, 0.34, 0.07]} color={C.orange} />
            {eyes(0.36, 0.19)}
            {[1, -1].map((s) => (
              <mesh key={s} position={[s * 0.08, 0.47, 0.06]} material={mat(C.orange)}>
                <coneGeometry args={[0.045, 0.1, 5]} />
              </mesh>
            ))}
            <mesh position={[0, 0.27, -0.22]} rotation-x={0.7} material={mat(C.orange)}>
              <capsuleGeometry args={[0.022, 0.24, 4, 8]} />
            </mesh>
          </>
        )}
        {kind === "dragon" && (
          <>
            <Ball r={0.18} at={[0, 0.18, -0.03]} color={C.teal} />
            <Ball r={0.14} at={[0, 0.4, 0.07]} color={C.teal} />
            {eyes(0.44, 0.19)}
            <Ball r={0.07} at={[0, 0.36, 0.19]} color={C.leaf2} scale={[1.1, 0.7, 0.8]} />
            {[1, -1].map((s) => (
              <Ball
                key={s}
                r={0.11}
                at={[s * 0.21, 0.27, -0.08]}
                color={C.pink}
                scale={[1, 0.7, 0.2]}
              />
            ))}
            {[0.53, 0.4, 0.28].map((y, i) => (
              <mesh key={y} position={[0, y, -0.03 - i * 0.05]} material={mat(C.yellow)}>
                <coneGeometry args={[0.03, 0.08, 5]} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
}

const OUTFITS: Record<string, { torso: string; legs: string; shoes?: string }> = {
  spaceSuit: { torso: "#eef3f7", legs: "#d8e1e8", shoes: "#9aa6b2" },
  painterSuit: { torso: "#fbf8f1", legs: "#5d9fd6" },
  explorerSuit: { torso: "#b9a26a", legs: "#8b7a52", shoes: "#6b4a2e" },
  dinoSuit: { torso: "#69bf6b", legs: "#4fa95a", shoes: "#4fa95a" },
};

export interface FigureProps {
  look: Omit<AvatarLook, "name">;
  equipped?: Partial<Record<AccessorySlot, string>>;
  clip: ClipId;
  /** Se reinicia la animación al cambiar. */
  take?: number | string;
  face?: Face;
  position?: Vec3;
  /** Giro base del personaje. */
  facing?: number;
  scale?: number;
  /** Para que otras piezas (la ropa, el brillo) sepan dónde está el cuerpo. */
  bodyRef?: RefObject<Group | null>;
  /** Retraso de la reacción respecto de la decisión. */
  delay?: number;
}

/**
 * Personaje de cabeza grande y articulado. Una sola malla por pieza, sin esqueleto: las posturas de
 * `poses.ts` se aplican cuadro a cuadro sin volver a renderizar React.
 */
export function Figure({
  look,
  equipped = {},
  clip,
  take = 0,
  face = "calm",
  position = [0, 0, 0],
  facing = 0,
  scale = 1,
  bodyRef,
  delay = 0,
}: FigureProps) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const started = useRef<{ key: string; at: number } | null>(null);
  const key = `${clip}|${take}`;

  const outfit = equipped.outfit ? OUTFITS[equipped.outfit] : undefined;
  const torso = outfit?.torso ?? look.outfit;
  const legs = outfit?.legs ?? shade(look.outfit, 0.6);
  const shoe =
    equipped.feet === "fastShoes"
      ? C.teal
      : equipped.feet === "rainBoots"
        ? C.yellow
        : (outfit?.shoes ?? C.white);
  const shape = FACES[face];
  const skin = useMemo(() => mat(look.skin, 0.55), [look.skin]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    if (!started.current || started.current.key !== key) started.current = { key, at: now + delay };
    const pose = poseAt(clip, now - started.current.at);
    if (root.current) {
      root.current.position.set(
        position[0] + pose.x * scale,
        position[1],
        position[2] + pose.z * scale,
      );
      root.current.rotation.y = facing + pose.turn;
    }
    if (body.current) {
      body.current.position.y = pose.bob + (pose.height - 1) * 0.42;
      body.current.rotation.x = pose.lean;
    }
    if (head.current) {
      head.current.rotation.x = pose.headNod;
      head.current.rotation.y = pose.headTurn;
    }
    if (armL.current) {
      armL.current.rotation.x = -pose.armL;
      armL.current.rotation.z = pose.spreadL;
    }
    if (armR.current) {
      armR.current.rotation.x = -pose.armR;
      armR.current.rotation.z = -pose.spreadR;
    }
    if (legL.current) legL.current.rotation.x = pose.stride - (1 - pose.height) * 1.6;
    if (legR.current) legR.current.rotation.x = -pose.stride - (1 - pose.height) * 1.6;
  });

  const limb = mat(torso);
  return (
    <group ref={root} position={position} rotation-y={facing} scale={scale}>
      <group ref={bodyRef}>
        <group ref={body}>
          {[
            [legL, 0.115],
            [legR, -0.115],
          ].map(([ref, x]) => (
            <group key={String(x)} ref={ref as RefObject<Group>} position={[x as number, 0.42, 0]}>
              <mesh position={[0, -0.14, 0]} material={mat(legs)} castShadow>
                <capsuleGeometry args={[0.09, 0.17, 6, 12]} />
              </mesh>
              <Ball r={0.11} at={[0, -0.33, 0.045]} color={shoe} scale={[1, 0.72, 1.35]} />
              {equipped.feet === "fastShoes" && (
                <Ball
                  r={0.04}
                  at={[(x as number) > 0 ? 0.09 : -0.09, -0.33, 0.02]}
                  color={C.yellow}
                />
              )}
            </group>
          ))}

          <mesh position={[0, 0.65, 0]} scale={[1, 1, 0.82]} material={limb} castShadow>
            <capsuleGeometry args={[0.2, 0.22, 8, 18]} />
          </mesh>

          {equipped.outfit === "painterSuit" && (
            <>
              <Block size={[0.34, 0.26, 0.04]} at={[0, 0.5, 0.15]} color="#5d9fd6" radius={0.012} />
              <Ball r={0.035} at={[0.09, 0.7, 0.17]} color={C.red} />
              <Ball r={0.03} at={[-0.08, 0.78, 0.17]} color={C.yellow} />
            </>
          )}
          {equipped.outfit === "explorerSuit" && (
            <Block
              size={[0.1, 0.42, 0.04]}
              at={[0, 0.48, 0.155]}
              color={C.woodDark}
              radius={0.012}
            />
          )}
          {equipped.outfit === "spaceSuit" && (
            <>
              <Block
                size={[0.22, 0.14, 0.04]}
                at={[0, 0.62, 0.155]}
                color={C.blue}
                radius={0.012}
              />
              <Ball r={0.024} at={[-0.05, 0.69, 0.18]} color={C.red} />
              <Ball r={0.024} at={[0.05, 0.69, 0.18]} color={C.yellow} />
              <Block size={[0.28, 0.34, 0.12]} at={[0, 0.5, -0.2]} color={C.grey} radius={0.04} />
            </>
          )}
          {equipped.outfit === "dinoSuit" && (
            <>
              <Ball r={0.11} at={[0, 0.48, -0.27]} color={torso} scale={[0.8, 0.8, 1.7]} />
              <Ball r={0.07} at={[0, 0.4, -0.45]} color={torso} scale={[0.7, 0.7, 1.5]} />
              {[0.86, 0.68, 0.52].map((y, i) => (
                <mesh
                  key={y}
                  position={[0, y, -0.17 - i * 0.015]}
                  rotation-x={-0.4}
                  material={mat(C.yellow)}
                >
                  <coneGeometry args={[0.055, 0.13, 6]} />
                </mesh>
              ))}
              <Ball r={0.13} at={[0, 0.58, 0.1]} color={C.leaf2} scale={[1.1, 1.3, 0.7]} />
            </>
          )}

          {[
            [armL, 0.27, "L"],
            [armR, -0.27, "R"],
          ].map(([ref, x, id]) => (
            <group key={String(id)} ref={ref as RefObject<Group>} position={[x as number, 0.84, 0]}>
              <mesh position={[0, -0.15, 0]} material={limb} castShadow>
                <capsuleGeometry args={[0.062, 0.2, 6, 10]} />
              </mesh>
              <mesh position={[0, -0.33, 0]} material={skin} castShadow>
                <sphereGeometry args={[0.072, 12, 10]} />
              </mesh>
            </group>
          ))}

          <BackWear kind={equipped.back} color={torso} />

          <group ref={head} position={[0, 0.92, 0]}>
            <group position={[0, 0.3, 0]}>
              <mesh material={skin} castShadow receiveShadow>
                <sphereGeometry args={[0.38, 28, 22]} />
              </mesh>
              {[1, -1].map((side) => (
                <mesh
                  key={side}
                  position={[side * 0.38, -0.01, 0]}
                  scale={[0.6, 1, 0.9]}
                  material={skin}
                >
                  <sphereGeometry args={[0.07, 10, 10]} />
                </mesh>
              ))}
              <Eye side={1} shape={shape} />
              <Eye side={-1} shape={shape} />
              <mesh position={[0, -0.045, 0.375]} scale={[1, 0.8, 0.8]} material={skin}>
                <sphereGeometry args={[0.03, 8, 8]} />
              </mesh>
              {[1, -1].map((side) => (
                <mesh
                  key={side}
                  position={[side * 0.22, -0.09, 0.28]}
                  scale={[1, 0.65, 0.3]}
                  material={mat(C.cheek, 0.9)}
                  visible={shape.cheek > 0.2}
                >
                  <sphereGeometry args={[0.05 + shape.cheek * 0.025, 10, 8]} />
                </mesh>
              ))}
              <Mouth kind={shape.mouth} />
              {equipped.outfit === "spaceSuit" ? (
                <mesh material={mat(C.glass, 0.1)} scale={1.32}>
                  <torusGeometry args={[0.36, 0.045, 10, 28]} />
                </mesh>
              ) : equipped.outfit === "dinoSuit" ? (
                <>
                  <mesh
                    position={[0, 0.02, -0.02]}
                    rotation-x={-0.32}
                    material={mat(torso)}
                    castShadow
                  >
                    <sphereGeometry args={[0.41, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
                  </mesh>
                  {[0.32, 0.2].map((y, i) => (
                    <mesh
                      key={y}
                      position={[0, y + 0.13, -0.08 - i * 0.2]}
                      material={mat(C.yellow)}
                    >
                      <coneGeometry args={[0.07, 0.17, 6]} />
                    </mesh>
                  ))}
                </>
              ) : (
                <Hair look={look} />
              )}
              <HeadWear head={equipped.head} face={equipped.face} />
            </group>
          </group>
        </group>
      </group>
      <Companion kind={equipped.companion} />
    </group>
  );
}

/** Personajes secundarios: variados, sin nombre y con rasgos sencillos. */
export const NPC_LOOKS = {
  teacher: { skin: "#d99e6e", hairStyle: "long", hairColor: "#3a2416", outfit: "#a06cd5" },
  adult: { skin: "#eebd93", hairStyle: "short", hairColor: "#5a3620", outfit: "#37b8a5" },
  staff: { skin: "#a9714a", hairStyle: "short", hairColor: "#2b1d14", outfit: "#2d6fa3" },
  peer: { skin: "#a9714a", hairStyle: "curly", hairColor: "#2b1d14", outfit: "#f5b83d" },
  peer2: { skin: "#f7d6bf", hairStyle: "buns", hairColor: "#a0642e", outfit: "#59b87a" },
  sibling: { skin: "#d99e6e", hairStyle: "spiky", hairColor: "#3a2416", outfit: "#3fa7d6" },
} as const;
