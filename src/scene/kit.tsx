"use client";

import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export type Vec3 = [number, number, number];

/** Colores del mundo 3D: cálidos y saturados, como una maqueta de juguete. */
export const C = {
  wood: "#c98f5c",
  woodDark: "#8d5f3a",
  woodLight: "#e4bb8a",
  wallWarm: "#fbe6b8",
  wallCool: "#cfe9f2",
  wallPink: "#fbd9d0",
  white: "#fbf8f1",
  board: "#2f6b55",
  chalk: "#f1f5e8",
  grass: "#8ed06b",
  grass2: "#6fbd5c",
  sand: "#f2d995",
  path: "#e8d3a4",
  water: "#74c9e8",
  sky: "#a9e2f7",
  leaf: "#4fb05c",
  leaf2: "#7dc95a",
  trunk: "#90633d",
  red: "#ef6f5b",
  yellow: "#f7c243",
  blue: "#3fa7d6",
  violet: "#a06cd5",
  pink: "#f27fb2",
  teal: "#37b8a5",
  orange: "#f6964a",
  dark: "#2e3440",
  grey: "#9aa6b2",
  glass: "#bfe6f5",
  mush: "#f7efe1",
  ink: "#33262a",
  cheek: "#f59a8b",
} as const;

const materials = new Map<string, MeshStandardMaterial>();

/** Un material por color: decenas de piezas comparten pocos programas (60 FPS en un portátil). */
export function mat(color: string, rough = 0.72, metal = 0): MeshStandardMaterial {
  const key = `${color}|${rough}|${metal}`;
  let found = materials.get(key);
  if (!found) {
    found = new MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    materials.set(key, found);
  }
  return found;
}

/** Caja de esquinas redondeadas apoyada en su base: `at` es el centro de la base. */
export function Block({
  size,
  at = [0, 0, 0],
  color,
  radius = 0.05,
  rotation,
  shadow = true,
}: {
  size: Vec3;
  at?: Vec3;
  color: string;
  radius?: number;
  rotation?: Vec3;
  shadow?: boolean;
}) {
  return (
    <RoundedBox
      args={size}
      radius={Math.min(radius, Math.min(...size) / 2.01)}
      smoothness={2}
      position={[at[0], at[1] + size[1] / 2, at[2]]}
      rotation={rotation}
      material={mat(color)}
      castShadow={shadow}
      receiveShadow
    />
  );
}

export function Ball({
  r,
  at,
  color,
  scale,
  rough,
}: {
  r: number;
  at: Vec3;
  color: string;
  scale?: Vec3;
  rough?: number;
}) {
  return (
    <mesh position={at} scale={scale} material={mat(color, rough)} castShadow receiveShadow>
      <sphereGeometry args={[r, 20, 16]} />
    </mesh>
  );
}

export function Cyl({
  r,
  h,
  at = [0, 0, 0],
  color,
  top,
  rotation,
  segments = 18,
}: {
  r: number;
  h: number;
  at?: Vec3;
  color: string;
  top?: number;
  rotation?: Vec3;
  segments?: number;
}) {
  return (
    <mesh
      position={[at[0], at[1] + h / 2, at[2]]}
      rotation={rotation}
      material={mat(color)}
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[top ?? r, r, h, segments]} />
    </mesh>
  );
}

/** Suelo circular que se funde con el fondo, sin bordes visibles. */
export function Floor({ color, size = 40, y = 0 }: { color: string; size?: number; y?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={mat(color, 0.95)} receiveShadow>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}

export function Tree({
  at,
  scale = 1,
  color = C.leaf,
}: {
  at: Vec3;
  scale?: number;
  color?: string;
}) {
  return (
    <group position={at} scale={scale}>
      <Cyl r={0.16} top={0.12} h={0.9} color={C.trunk} />
      <Ball r={0.62} at={[0, 1.25, 0]} color={color} />
      <Ball r={0.44} at={[0.36, 1.02, 0.1]} color={color} />
      <Ball r={0.4} at={[-0.34, 1.05, -0.08]} color={color} />
    </group>
  );
}

export function Bush({ at, color = C.leaf2 }: { at: Vec3; color?: string }) {
  return (
    <group position={at}>
      <Ball r={0.3} at={[0, 0.22, 0]} color={color} />
      <Ball r={0.22} at={[0.26, 0.16, 0.04]} color={color} />
      <Ball r={0.2} at={[-0.24, 0.14, 0.02]} color={color} />
    </group>
  );
}

export function Cloud({ at, scale = 1 }: { at: Vec3; scale?: number }) {
  return (
    <group position={at} scale={scale}>
      <Ball r={0.5} at={[0, 0, 0]} color={C.white} rough={1} />
      <Ball r={0.38} at={[0.5, -0.06, 0]} color={C.white} rough={1} />
      <Ball r={0.36} at={[-0.52, -0.08, 0]} color={C.white} rough={1} />
    </group>
  );
}
