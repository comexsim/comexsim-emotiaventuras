"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { BufferAttribute } from "three";
import { type Group, type Points } from "three";

import type { PropId, SceneSet } from "@/engine/types";

import { Ball, Block, Bush, C, Cloud, Cyl, Floor, mat, Tree, type Vec3 } from "./kit";

/* ---------- Muebles y piezas ---------- */

function Desk({ at, color = C.woodLight }: { at: Vec3; color?: string }) {
  return (
    <group position={at}>
      <Block size={[0.95, 0.06, 0.55]} at={[0, 0.58, 0]} color={color} radius={0.02} />
      {[
        [-0.4, -0.2],
        [0.4, -0.2],
        [-0.4, 0.2],
        [0.4, 0.2],
      ].map(([x, z]) => (
        <Cyl key={`${x}${z}`} r={0.03} h={0.58} at={[x!, 0, z!]} color={C.grey} />
      ))}
    </group>
  );
}

function Window({ at, size = [1.3, 1.15] }: { at: Vec3; size?: [number, number] }) {
  return (
    <group position={at}>
      <Block
        size={[size[0] + 0.14, size[1] + 0.14, 0.05]}
        color={C.white}
        radius={0.02}
        shadow={false}
      />
      <Block
        size={[size[0], size[1], 0.06]}
        at={[0, 0.07, 0]}
        color={C.sky}
        radius={0.01}
        shadow={false}
      />
      <Block
        size={[0.04, size[1], 0.07]}
        at={[0, 0.07, 0.003]}
        color={C.white}
        radius={0.005}
        shadow={false}
      />
      <Block
        size={[size[0], 0.04, 0.07]}
        at={[0, size[1] / 2 + 0.05, 0.003]}
        color={C.white}
        radius={0.005}
        shadow={false}
      />
    </group>
  );
}

function Picture({ at, color, accent }: { at: Vec3; color: string; accent: string }) {
  return (
    <group position={at}>
      <Block size={[0.8, 0.62, 0.04]} color={C.woodDark} radius={0.015} shadow={false} />
      <Block
        size={[0.68, 0.5, 0.05]}
        at={[0, 0.06, 0]}
        color={color}
        radius={0.01}
        shadow={false}
      />
      <Ball r={0.13} at={[0.08, 0.31, 0.04]} color={accent} scale={[1, 1, 0.2]} />
    </group>
  );
}

/** Asiento con un compañero de fondo: da vida al aula sin distraer de la escena. */
function Shelf({ at }: { at: Vec3 }) {
  const books = [C.red, C.blue, C.yellow, C.teal, C.violet, C.orange, C.pink];
  return (
    <group position={at}>
      <Block size={[1.2, 1.7, 0.34]} color={C.wood} radius={0.02} />
      {[0.5, 1.1].map((y, row) => (
        <group key={y}>
          <Block
            size={[1.08, 0.02, 0.3]}
            at={[0, y, 0.03]}
            color={C.woodDark}
            radius={0.005}
            shadow={false}
          />
          {books.map((color, i) => (
            <Block
              key={i}
              size={[0.11, 0.3 + ((i + row) % 3) * 0.04, 0.2]}
              at={[-0.42 + i * 0.14, y + 0.02, 0.09]}
              color={color}
              radius={0.01}
              shadow={false}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Plant({ at }: { at: Vec3 }) {
  return (
    <group position={at}>
      <Cyl r={0.14} top={0.18} h={0.26} color={C.orange} />
      <Ball r={0.22} at={[0, 0.45, 0]} color={C.leaf} />
      <Ball r={0.15} at={[0.14, 0.62, 0.03]} color={C.leaf2} />
      <Ball r={0.13} at={[-0.14, 0.6, 0]} color={C.leaf2} />
    </group>
  );
}

/* ---------- Escenarios ---------- */

function Classroom() {
  return (
    <group>
      <Floor color="#e6c18f" />
      <Block
        size={[20, 4.6, 0.2]}
        at={[0, 0, -3.1]}
        color={C.wallWarm}
        radius={0.01}
        shadow={false}
      />
      <Block
        size={[20, 0.5, 0.21]}
        at={[0, 0, -3.09]}
        color="#f0b98a"
        radius={0.01}
        shadow={false}
      />
      <Block
        size={[3.2, 1.5, 0.08]}
        at={[-0.35, 1.05, -2.96]}
        color={C.woodDark}
        radius={0.03}
        shadow={false}
      />
      <Block
        size={[3, 1.3, 0.09]}
        at={[-0.35, 1.15, -2.95]}
        color={C.board}
        radius={0.01}
        shadow={false}
      />
      {[
        [-1.3, 2.1, 0.8],
        [-0.3, 2.1, 0.4],
        [-1.2, 1.75, 0.55],
        [0.25, 1.72, 0.9],
        [0.65, 2.1, 0.4],
      ].map(([x, y, w], i) => (
        <Block
          key={i}
          size={[w!, 0.035, 0.012]}
          at={[x!, y!, -2.89]}
          color={C.chalk}
          radius={0.008}
          shadow={false}
        />
      ))}
      <Window at={[-3.1, 1.15, -2.97]} />
      <Window at={[2.65, 1.15, -2.97]} />
      <Shelf at={[4.25, 0, -2.75]} />
      <Ball r={0.17} at={[4.1, 1.88, -2.72]} color={C.blue} />
      {[C.red, C.blue, C.yellow, C.teal, C.pink, C.violet, C.orange].map((color, i) => (
        <mesh
          key={i}
          position={[-3.5 + i * 1.1, 2.92 + (i % 2) * 0.03, -2.92]}
          rotation-z={Math.PI}
          material={mat(color)}
        >
          <coneGeometry args={[0.17, 0.3, 3]} />
        </mesh>
      ))}
      <Desk at={[-2.65, 0, -1.5]} />
      <Desk at={[-0.75, 0, -1.75]} />
      <Desk at={[1.2, 0, -1.75]} />
      <Desk at={[2.95, 0, -1.5]} />
      <Block
        size={[3.9, 0.02, 2.5]}
        at={[0, 0.003, 0.35]}
        color="#8fd2c9"
        radius={0.01}
        shadow={false}
      />
    </group>
  );
}

function Playground() {
  return (
    <group>
      <Floor color={C.grass} />
      <mesh
        rotation-x={-Math.PI / 2}
        position={[-3.6, 0.01, -1.6]}
        material={mat(C.sand, 1)}
        receiveShadow
      >
        <circleGeometry args={[1.5, 28]} />
      </mesh>
      <Block size={[9, 2.4, 0.3]} at={[0.8, 0, -6]} color={C.wallPink} radius={0.03} />
      <Block size={[9.4, 0.3, 0.9]} at={[0.8, 2.4, -5.9]} color={C.red} radius={0.05} />
      {[-2, 0, 2, 3.7].map((x) => (
        <Block
          key={x}
          size={[0.9, 0.9, 0.06]}
          at={[x, 0.95, -5.84]}
          color={C.sky}
          radius={0.02}
          shadow={false}
        />
      ))}

      {/* Columpio */}
      <group position={[-3.7, 0, -2]}>
        <Cyl r={0.05} h={1.9} at={[-0.8, 0, 0.05]} color={C.blue} />
        <Cyl r={0.05} h={1.9} at={[0.8, 0, 0.05]} color={C.blue} />
        <Cyl r={0.05} h={1.7} at={[0, 1.85, 0.05]} color={C.blue} rotation={[0, 0, Math.PI / 2]} />
        <Cyl r={0.012} h={1.3} at={[-0.18, 0.6, 0.05]} color={C.grey} />
        <Cyl r={0.012} h={1.3} at={[0.18, 0.6, 0.05]} color={C.grey} />
        <Block size={[0.46, 0.04, 0.2]} at={[0, 0.58, 0.05]} color={C.red} radius={0.015} />
      </group>

      {/* Tobogán */}
      <group position={[3.7, 0, -2.4]} rotation-y={-0.4}>
        <Block size={[0.7, 1.35, 0.7]} at={[-0.1, 0, -0.1]} color={C.yellow} radius={0.05} />
        <Block
          size={[0.5, 0.05, 1.8]}
          at={[-0.1, 0.65, 0.92]}
          rotation={[0.72, 0, 0]}
          color={C.red}
          radius={0.02}
        />
      </group>

      {/* Arco */}
      <group position={[0.2, 0, -3.7]}>
        <Cyl r={0.04} h={1} at={[-1, 0, 0]} color={C.white} />
        <Cyl r={0.04} h={1} at={[1, 0, 0]} color={C.white} />
        <Cyl r={0.04} h={2} at={[0, 0.97, 0]} color={C.white} rotation={[0, 0, Math.PI / 2]} />
      </group>

      <Tree at={[-5.5, 0, -3.6]} scale={1.5} />
      <Tree at={[5.6, 0, -4.2]} scale={1.7} color={C.leaf2} />
      <Tree at={[6.2, 0, -1]} scale={1.2} />
      <Bush at={[-5.2, 0, -0.7]} />
      <Bush at={[-1.8, 0, -3.8]} color={C.leaf} />
      <Bush at={[2.4, 0, -3.8]} />
      <Cloud at={[-3, 4.1, -8]} scale={1.2} />
      <Cloud at={[3.5, 4.5, -9]} scale={1.5} />
    </group>
  );
}

function Bus({ at }: { at: Vec3 }) {
  return (
    <group position={at}>
      <Block size={[4.4, 1.5, 1.4]} at={[0, 0.35, 0]} color={C.yellow} radius={0.14} />
      <Block
        size={[4.42, 0.14, 1.42]}
        at={[0, 0.82, 0]}
        color={C.dark}
        radius={0.02}
        shadow={false}
      />
      {[-1.5, -0.7, 0.1, 0.9].map((x) => (
        <Block
          key={x}
          size={[0.62, 0.48, 1.44]}
          at={[x, 1.1, 0]}
          color={C.glass}
          radius={0.03}
          shadow={false}
        />
      ))}
      <Block
        size={[0.72, 1.18, 1.44]}
        at={[1.72, 0.4, 0]}
        color={C.glass}
        radius={0.03}
        shadow={false}
      />
      {[-1.4, 1.4].flatMap((x) =>
        [-0.7, 0.7].map((z) => (
          <Cyl
            key={`${x}${z}`}
            r={0.32}
            h={0.18}
            at={[x, 0.32, z]}
            rotation={[Math.PI / 2, 0, 0]}
            color={C.dark}
          />
        )),
      )}
    </group>
  );
}

function BusStop({ rain }: { rain?: boolean }) {
  return (
    <group>
      <Floor color={rain ? "#92bb82" : C.grass} />
      <Block
        size={[24, 0.02, 2.2]}
        at={[0, 0.01, -3]}
        color="#7f8794"
        radius={0.005}
        shadow={false}
      />
      {[-6, -3, 0, 3, 6].map((x) => (
        <Block
          key={x}
          size={[1.2, 0.01, 0.1]}
          at={[x, 0.035, -3]}
          color={C.white}
          radius={0.004}
          shadow={false}
        />
      ))}
      <Block size={[24, 0.1, 0.34]} at={[0, 0, -1.75]} color="#d7dbe0" radius={0.03} />
      <Bus at={[0.4, 0, -3]} />
      <Tree at={[-5, 0, -5.2]} scale={1.6} />
      <Tree at={[5.6, 0, -5.6]} scale={1.8} color={C.leaf2} />
      <Tree at={[-2.3, 0, -6.2]} scale={1.3} />
      <Bush at={[-5.3, 0, -0.9]} />
      <Bush at={[5.3, 0, -1]} color={C.leaf} />
      {/* Parada */}
      <group position={[-3.5, 0, -1.2]}>
        <Cyl r={0.04} h={1.9} at={[-0.7, 0, 0]} color={C.grey} />
        <Cyl r={0.04} h={1.9} at={[0.7, 0, 0]} color={C.grey} />
        <Block size={[1.8, 0.07, 0.9]} at={[0, 1.88, 0]} color={C.teal} radius={0.03} />
        <Block size={[1.2, 0.06, 0.32]} at={[0, 0.45, 0]} color={C.woodLight} radius={0.02} />
      </group>
      {!rain && <Cloud at={[3, 4.6, -9]} scale={1.5} />}
      {rain && (
        <>
          <Cloud at={[-2.6, 3.8, -5]} scale={1.8} />
          <Cloud at={[3, 4, -6]} scale={2.1} />
          <Rain />
        </>
      )}
    </group>
  );
}

function Rain() {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(500 * 3);
    // Distribución fija, sin azar: la escena siempre es la misma.
    for (let i = 0; i < 500; i += 1) {
      data[i * 3] = ((i * 73) % 140) / 10 - 7;
      data[i * 3 + 1] = ((i * 37) % 50) / 10;
      data[i * 3 + 2] = ((i * 91) % 80) / 10 - 6;
    }
    return data;
  }, []);
  useFrame((_, delta) => {
    const geometry = points.current?.geometry;
    const attribute = geometry?.getAttribute("position") as BufferAttribute | undefined;
    if (!attribute) return;
    for (let i = 0; i < attribute.count; i += 1) {
      const y = attribute.getY(i) - delta * 6;
      attribute.setY(i, y < 0 ? 5 : y);
    }
    attribute.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#4f8fc4" size={0.085} />
    </points>
  );
}

function Museum() {
  return (
    <group>
      <Floor color="#e9dfd0" />
      <Block
        size={[20, 4.2, 0.2]}
        at={[0, 0, -3.3]}
        color={C.wallCool}
        radius={0.01}
        shadow={false}
      />
      <Picture at={[-3, 1.25, -3.17]} color={C.yellow} accent={C.red} />
      <Picture at={[-0.9, 1.25, -3.17]} color={C.sky} accent={C.white} />
      <Picture at={[1.2, 1.25, -3.17]} color={C.pink} accent={C.violet} />
      <Picture at={[3.3, 1.25, -3.17]} color={C.teal} accent={C.yellow} />
      {/* Esqueleto de dinosaurio sobre una plataforma */}
      <group position={[-3.3, 0, -1.9]}>
        <Block size={[1.8, 0.2, 1]} color={C.white} radius={0.03} />
        {[-0.5, -0.25, 0, 0.25, 0.5].map((x) => (
          <Cyl key={x} r={0.03} h={0.75} at={[x, 0.2, 0]} color="#efe6d2" />
        ))}
        <Cyl r={0.06} h={1.5} at={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]} color="#efe6d2" />
        <Ball r={0.17} at={[0.84, 1.13, 0]} color="#efe6d2" scale={[1.4, 0.9, 0.9]} />
      </group>
      {/* Vitrina */}
      <group position={[3.5, 0, -1.9]}>
        <Block size={[1, 0.82, 0.8]} color={C.white} radius={0.03} />
        <Block size={[0.9, 0.62, 0.7]} at={[0, 0.82, 0]} color={C.glass} radius={0.02} />
        <Ball r={0.18} at={[0, 1.02, 0]} color={C.orange} />
      </group>
      <Block
        size={[20, 0.015, 3]}
        at={[0, 0.002, 0.4]}
        color="#d4c6e8"
        radius={0.005}
        shadow={false}
      />
    </group>
  );
}

function GiftShop() {
  const shelf = (x: number) => (
    <group position={[x, 0, -2.7]}>
      <Block size={[2.2, 2, 0.45]} color={C.woodLight} radius={0.02} />
      {[0.55, 1.2].map((y, row) => (
        <group key={y}>
          <Block
            size={[2.1, 0.03, 0.42]}
            at={[0, y, 0.05]}
            color={C.wood}
            radius={0.008}
            shadow={false}
          />
          {[-0.7, -0.25, 0.25, 0.7].map((px, i) => (
            <Ball
              key={px}
              r={0.13}
              at={[px, y + 0.15, 0.15]}
              color={[C.red, C.yellow, C.blue, C.pink, C.teal, C.orange][(i + row * 3) % 6]!}
            />
          ))}
        </group>
      ))}
    </group>
  );
  return (
    <group>
      <Floor color="#efdcc0" />
      <Block
        size={[20, 4, 0.2]}
        at={[0, 0, -3.2]}
        color={C.wallPink}
        radius={0.01}
        shadow={false}
      />
      {shelf(-3)}
      {shelf(0)}
      {shelf(3)}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh
          key={x}
          position={[x, 3.1, -3]}
          rotation-z={Math.PI}
          material={mat([C.red, C.yellow, C.teal, C.violet, C.orange][i]!)}
        >
          <coneGeometry args={[0.24, 0.34, 3]} />
        </mesh>
      ))}
    </group>
  );
}

function Park() {
  return (
    <group>
      <Floor color={C.grass} />
      <Block
        size={[20, 0.02, 2.5]}
        at={[0, 0.005, 0.1]}
        color={C.path}
        radius={0.005}
        shadow={false}
      />
      <Tree at={[-4, 0, -2.6]} scale={1.7} />
      <Tree at={[-1.2, 0, -3.8]} scale={1.3} color={C.leaf2} />
      <Tree at={[1.8, 0, -3.3]} scale={1.8} />
      <Tree at={[4.6, 0, -2.3]} scale={1.4} color={C.leaf2} />
      <Bush at={[-5.4, 0, -1.2]} />
      <Bush at={[3.2, 0, -1.7]} color={C.leaf} />
      <group position={[-2.5, 0, -1.7]}>
        <Block size={[1.4, 0.06, 0.4]} at={[0, 0.4, 0]} color={C.wood} radius={0.02} />
        <Block size={[0.08, 0.4, 0.34]} at={[-0.55, 0, 0]} color={C.dark} radius={0.015} />
        <Block size={[0.08, 0.4, 0.34]} at={[0.55, 0, 0]} color={C.dark} radius={0.015} />
      </group>
      <Cloud at={[-3, 4.4, -8]} scale={1.3} />
      <Cloud at={[3.5, 4.6, -9]} scale={1.6} />
    </group>
  );
}

function Home() {
  return (
    <group>
      <Floor color="#d6a877" />
      <Block
        size={[20, 4.2, 0.2]}
        at={[0, 0, -3.2]}
        color={C.wallPink}
        radius={0.01}
        shadow={false}
      />
      <Block
        size={[20, 0.28, 0.21]}
        at={[0, 0, -3.19]}
        color={C.white}
        radius={0.01}
        shadow={false}
      />
      <Window at={[-3.05, 1.2, -3.07]} size={[1.25, 1.2]} />
      {/* Televisor */}
      <group position={[0.2, 0, -2.85]}>
        <Block size={[2.1, 0.5, 0.5]} color={C.wood} radius={0.03} />
        <Block size={[1.75, 1.02, 0.08]} at={[0, 0.6, -0.04]} color={C.dark} radius={0.03} />
        <Block
          size={[1.6, 0.87, 0.09]}
          at={[0, 0.67, -0.03]}
          color="#4c7fb5"
          radius={0.01}
          shadow={false}
        />
      </group>
      {/* Sofá */}
      <group position={[3.3, 0, -2.2]}>
        <Block size={[2.1, 0.45, 0.85]} color={C.teal} radius={0.09} />
        <Block size={[2.1, 0.78, 0.26]} at={[0, 0.2, -0.32]} color={C.teal} radius={0.09} />
        <Block size={[0.26, 0.65, 0.85]} at={[-1, 0, 0]} color="#2c9c8c" radius={0.08} />
        <Block size={[0.26, 0.65, 0.85]} at={[1, 0, 0]} color="#2c9c8c" radius={0.08} />
        <Block
          size={[0.48, 0.42, 0.14]}
          at={[-0.4, 0.46, -0.11]}
          rotation={[-0.25, 0.1, 0]}
          color={C.yellow}
          radius={0.06}
        />
      </group>
      <Shelf at={[-4.5, 0, -2.85]} />
      <Plant at={[-2.1, 0, -2.75]} />
      <Picture at={[2.25, 1.65, -3.07]} color={C.sky} accent={C.yellow} />
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.008, 0.4]}
        scale={[1.7, 1, 1]}
        material={mat("#f4c78d", 1)}
        receiveShadow
      >
        <circleGeometry args={[1.5, 36]} />
      </mesh>
    </group>
  );
}

export function Backdrop({ set, rain }: { set: SceneSet; rain?: boolean }) {
  switch (set) {
    case "classroom":
      return <Classroom />;
    case "playground":
      return <Playground />;
    case "busStop":
      return <BusStop rain={rain} />;
    case "museum":
      return <Museum />;
    case "giftShop":
      return <GiftShop />;
    case "park":
      return <Park />;
    case "home":
      return <Home />;
  }
}

/* ---------- Bosque de la Calma ---------- */

function Fireflies() {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    group.current?.children.forEach((child, i) => {
      const t = clock.elapsedTime * 0.4 + i * 1.7;
      child.position.set(
        ((i * 2.3) % 9) - 4.5 + Math.sin(t) * 0.5,
        0.7 + ((i * 1.1) % 2) + Math.sin(t * 1.3) * 0.25,
        -3 + ((i * 1.9) % 5) + Math.cos(t) * 0.4,
      );
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#fff2a8" />
        </mesh>
      ))}
    </group>
  );
}

export function Forest() {
  return (
    <group>
      <Floor color="#a7dc8d" />
      <mesh
        rotation-x={-Math.PI / 2}
        position={[2.7, 0.012, -1]}
        scale={[1.45, 1, 0.8]}
        material={mat(C.water, 0.2)}
        receiveShadow
      >
        <circleGeometry args={[1.5, 40]} />
      </mesh>
      {[
        [-5, -3, 2, C.leaf],
        [-3, -4.4, 2.3, "#5cb9a0"],
        [-0.4, -5, 2.6, C.leaf2],
        [2.2, -5, 2.2, "#5cb9a0"],
        [5, -4, 2.6, C.leaf],
        [6.2, -1.6, 1.8, C.leaf2],
        [-6.2, -0.8, 1.7, "#5cb9a0"],
      ].map(([x, z, s, color], i) => (
        <Tree
          key={i}
          at={[x as number, 0, z as number]}
          scale={s as number}
          color={color as string}
        />
      ))}
      {[
        [-3.1, -1, C.red, 0.26],
        [-2.5, -0.3, C.yellow, 0.2],
        [-4.1, 0.5, C.violet, 0.24],
        [4.9, 0.8, C.red, 0.21],
      ].map(([x, z, color, r], i) => (
        <group key={i} position={[x as number, 0, z as number]}>
          <Cyl r={(r as number) * 0.42} h={(r as number) * 1.1} color={C.mush} />
          <Ball
            r={r as number}
            at={[0, (r as number) * 1.1, 0]}
            color={color as string}
            scale={[1, 0.65, 1]}
          />
        </group>
      ))}
      {[
        [-1, 1.5, C.pink],
        [-1.5, 1.1, C.yellow],
        [1.2, 1.6, C.violet],
        [1.7, 1.15, C.pink],
        [-4, 1.7, C.yellow],
        [3.6, 1.4, C.white],
      ].map(([x, z, color], i) => (
        <Ball key={i} r={0.07} at={[x as number, 0.1, z as number]} color={color as string} />
      ))}
      <Block size={[0.82, 0.3, 0.46]} at={[2.7, 0.01, -1]} color="#c7bfa7" radius={0.14} />
      <group position={[2.7, 0.3, -1]}>
        <Ball r={0.22} at={[0, 0.12, 0]} color="#59a568" scale={[1.2, 0.72, 1.3]} />
        <Ball r={0.1} at={[0.04, 0.16, 0.32]} color="#8fce84" />
      </group>
      <Bush at={[-5.1, 0, 1.2]} color="#5cb9a0" />
      <Bush at={[5.4, 0, -0.1]} />
      <Cloud at={[-2.5, 4.4, -8]} scale={1.3} />
      <Fireflies />
    </group>
  );
}

/* ---------- Mapa: la isla de los cuatro mundos ---------- */

function MiniSchool({ at }: { at: Vec3 }) {
  return (
    <group position={at}>
      <Block size={[3, 1.5, 1.8]} color={C.wallWarm} radius={0.05} />
      <mesh position={[0, 1.95, 0]} rotation-y={Math.PI / 4} material={mat(C.red)} castShadow>
        <coneGeometry args={[2.35, 0.95, 4]} />
      </mesh>
      <Block size={[0.6, 0.85, 0.05]} at={[0, 0, 0.92]} color={C.woodDark} radius={0.02} />
      {[-1, 1].map((x) => (
        <Block key={x} size={[0.5, 0.5, 0.05]} at={[x, 0.65, 0.92]} color={C.sky} radius={0.02} />
      ))}
      <Cyl r={0.03} h={0.8} at={[0, 2.25, 0]} color={C.grey} />
      <Block size={[0.45, 0.28, 0.02]} at={[0.24, 2.75, 0]} color={C.yellow} radius={0.008} />
    </group>
  );
}

function MiniPlayground({ at }: { at: Vec3 }) {
  return (
    <group position={at}>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.02, 0]}
        material={mat(C.sand, 1)}
        receiveShadow
      >
        <circleGeometry args={[1.9, 28]} />
      </mesh>
      <group position={[-0.65, 0, -0.4]}>
        <Block size={[0.7, 1.05, 0.7]} color={C.yellow} radius={0.05} />
        <Block
          size={[0.5, 0.06, 1.5]}
          at={[0, 0.48, 0.92]}
          rotation={[0.7, 0, 0]}
          color={C.red}
          radius={0.02}
        />
      </group>
      <group position={[0.95, 0, -0.25]}>
        <Cyl r={0.05} h={1.3} at={[-0.55, 0, 0]} color={C.blue} />
        <Cyl r={0.05} h={1.3} at={[0.55, 0, 0]} color={C.blue} />
        <Cyl r={0.05} h={1.15} at={[0, 1.25, 0]} color={C.blue} rotation={[0, 0, Math.PI / 2]} />
        <Block size={[0.32, 0.04, 0.15]} at={[0, 0.45, 0]} color={C.red} radius={0.015} />
      </group>
      <Ball r={0.2} at={[0.4, 0.2, 0.95]} color={C.white} />
    </group>
  );
}

function MiniHome({ at }: { at: Vec3 }) {
  return (
    <group position={at}>
      <Block size={[2.1, 1.3, 1.7]} color={C.wallPink} radius={0.05} />
      <mesh position={[0, 1.72, 0]} rotation-y={Math.PI / 4} material={mat(C.blue)} castShadow>
        <coneGeometry args={[1.9, 0.9, 4]} />
      </mesh>
      <Block size={[0.5, 0.8, 0.05]} at={[0, 0, 0.87]} color={C.teal} radius={0.02} />
      <Block size={[0.45, 0.42, 0.05]} at={[-0.68, 0.55, 0.87]} color={C.sky} radius={0.015} />
      <Block size={[0.45, 0.42, 0.05]} at={[0.68, 0.55, 0.87]} color={C.sky} radius={0.015} />
      <Block size={[0.28, 0.7, 0.28]} at={[0.6, 1.5, -0.2]} color={C.woodDark} radius={0.03} />
      <Bush at={[-1.3, 0, 0.8]} />
    </group>
  );
}

export function Island() {
  return (
    <group>
      <Floor color={C.water} size={160} y={-0.3} />
      <Cyl r={15.5} top={15} h={0.55} at={[0, -0.55, 0]} color={C.sand} segments={56} />
      <Cyl r={14.7} h={0.1} at={[0, -0.04, 0]} color={C.grass} segments={56} />
      <Cyl r={2.6} h={0.05} at={[0, 0.04, 2]} color={C.path} segments={36} />
      {[
        [-3.6, -1.6, 0.68],
        [3.6, -1.6, -0.68],
        [-3.8, 4.6, -0.82],
        [3.8, 4.6, 0.82],
        [0, -2.8, 0],
      ].map(([x, z, r], i) => (
        <Block
          key={i}
          size={[i === 4 ? 1.1 : 1.15, 0.02, i === 4 ? 6 : 7]}
          at={[x!, 0.05, z!]}
          rotation={[0, r!, 0]}
          color={C.path}
          radius={0.008}
          shadow={false}
        />
      ))}
      <MiniSchool at={[-7.2, 0, -5.3]} />
      <MiniPlayground at={[7.2, 0, -5.3]} />
      <group position={[-7.5, 0, 7.1]} rotation-y={0.35} scale={0.75}>
        <Bus at={[0, 0, 0]} />
      </group>
      <MiniHome at={[7.4, 0, 7]} />

      {/* Entrada al Bosque de la Calma */}
      <group position={[0, 0, -7.8]}>
        {[
          [-2.1, 0.9, 1.5, "#5cb9a0"],
          [2.1, 0.8, 1.6, C.leaf],
          [-0.9, -0.7, 2, C.leaf],
          [0.9, -1, 1.9, "#5cb9a0"],
          [-3.2, -1.1, 1.4, C.leaf2],
          [3.2, -0.9, 1.3, C.leaf2],
        ].map(([x, z, s, color], i) => (
          <Tree
            key={i}
            at={[x as number, 0, z as number]}
            scale={s as number}
            color={color as string}
          />
        ))}
      </group>

      {[
        [-12, 1.3, 1.5],
        [12, 1, 1.4],
        [-11.6, -5.5, 1.2],
        [11.8, -4.9, 1.4],
        [-3, 10.6, 1],
        [3, 11.4, 1.1],
      ].map(([x, z, s], i) => (
        <Tree key={i} at={[x!, 0, z!]} scale={s!} color={i % 2 ? C.leaf : C.leaf2} />
      ))}
      <Bush at={[-3.7, 0, 2.4]} />
      <Bush at={[3.8, 0, 2.3]} color={C.leaf} />
      <Cloud at={[-9, 7, -10]} scale={2.1} />
      <Cloud at={[10, 8, -9]} scale={2.5} />
    </group>
  );
}

/* ---------- Objeto de la situación ---------- */

function PropShape({ id }: { id: PropId }) {
  switch (id) {
    case "notebook":
      return (
        <>
          <Block size={[0.38, 0.03, 0.5]} color={C.blue} radius={0.008} />
          <Block size={[0.34, 0.012, 0.46]} at={[0, 0.03, 0]} color={C.white} radius={0.004} />
        </>
      );
    case "drawing":
    case "paper":
      return (
        <>
          <Block size={[0.5, 0.01, 0.38]} color={C.white} radius={0.004} />
          {id === "drawing" && (
            <>
              <Ball r={0.07} at={[-0.04, 0.012, 0]} color={C.orange} scale={[1, 0.12, 0.9]} />
              <Ball r={0.04} at={[0.1, 0.012, -0.06]} color={C.orange} scale={[1, 0.12, 1]} />
            </>
          )}
        </>
      );
    case "pencil":
      return (
        <group rotation-z={Math.PI / 2} position={[0.2, 0.04, 0]}>
          <Cyl r={0.025} h={0.34} color={C.yellow} />
          <mesh position={[0, 0.38, 0]} material={mat(C.woodLight)}>
            <coneGeometry args={[0.025, 0.06, 8]} />
          </mesh>
        </group>
      );
    case "ball":
      return (
        <>
          <Ball r={0.17} at={[0, 0.17, 0]} color={C.white} />
          <Ball r={0.06} at={[0.05, 0.27, 0.11]} color={C.dark} />
          <Ball r={0.05} at={[-0.1, 0.15, 0.12]} color={C.dark} />
        </>
      );
    case "toy":
    case "souvenir":
      return (
        <>
          <Ball r={0.13} at={[0, 0.13, 0]} color={C.pink} />
          <Ball r={0.1} at={[0, 0.3, 0]} color={C.pink} />
          <Ball r={0.04} at={[0.08, 0.39, 0]} color={C.pink} />
          <Ball r={0.04} at={[-0.08, 0.39, 0]} color={C.pink} />
          <Ball r={0.015} at={[0.04, 0.32, 0.09]} color={C.ink} />
          <Ball r={0.015} at={[-0.04, 0.32, 0.09]} color={C.ink} />
        </>
      );
    case "lunch":
      return (
        <>
          <Block size={[0.4, 0.15, 0.28]} color={C.red} radius={0.04} />
          <Block size={[0.14, 0.04, 0.05]} at={[0, 0.15, 0]} color={C.yellow} radius={0.015} />
        </>
      );
    case "tablet":
    case "laptop":
      return id === "tablet" ? (
        <>
          <Block size={[0.5, 0.025, 0.36]} color={C.dark} radius={0.008} />
          <Block size={[0.44, 0.012, 0.3]} at={[0, 0.023, 0]} color={C.blue} radius={0.003} />
        </>
      ) : (
        <>
          <Block size={[0.5, 0.025, 0.34]} color={C.grey} radius={0.008} />
          <Block
            size={[0.5, 0.33, 0.02]}
            at={[0, 0.02, -0.17]}
            rotation={[-0.2, 0, 0]}
            color={C.dark}
            radius={0.006}
          />
        </>
      );
    case "controller":
      return <Block size={[0.3, 0.05, 0.14]} color={C.dark} radius={0.02} />;
    case "blocks":
      return (
        <>
          <Block size={[0.2, 0.2, 0.2]} at={[-0.14, 0, 0]} color={C.red} radius={0.015} />
          <Block size={[0.2, 0.2, 0.2]} at={[0.1, 0, 0.05]} color={C.blue} radius={0.015} />
          <Block size={[0.2, 0.2, 0.2]} at={[-0.02, 0.2, 0.02]} color={C.yellow} radius={0.015} />
          <Block size={[0.2, 0.2, 0.2]} at={[0.28, 0, -0.08]} color={C.teal} radius={0.015} />
        </>
      );
    case "remote":
      return <Block size={[0.12, 0.04, 0.34]} color={C.dark} radius={0.015} />;
    case "plaster":
      return null;
    case "none":
      return null;
  }
}

const HIGH_PROPS: PropId[] = [
  "notebook",
  "drawing",
  "paper",
  "pencil",
  "tablet",
  "laptop",
  "remote",
  "controller",
  "blocks",
  "souvenir",
];

/** El objeto sobre su mesita, o en el suelo. Con `drop`, cae con una sola sacudida. */
export function SceneProp({ id, drop, take }: { id: PropId; drop?: boolean; take: number }) {
  const moving = useRef<Group>(null);
  const started = useRef<{ take: number; at: number } | null>(null);
  const high = HIGH_PROPS.includes(id);
  const baseY = high ? 0.62 : 0;
  useFrame(({ clock }) => {
    if (!moving.current) return;
    if (!started.current || started.current.take !== take) {
      started.current = { take, at: clock.elapsedTime };
    }
    const t = clock.elapsedTime - started.current.at;
    if (!drop || t < 0.75) {
      moving.current.position.set(0, baseY, 0);
      moving.current.rotation.z = 0;
      return;
    }
    const fall = Math.min((t - 0.75) / 0.45, 1);
    moving.current.position.set(-0.3 * fall, baseY * (1 - fall * fall), 0.25 * fall);
    moving.current.rotation.z = 0.9 * fall;
  });
  if (id === "none" || id === "plaster") return null;
  return (
    <group position={[-0.12, 0, 0.32]}>
      {high && (
        <>
          <Block size={[0.85, 0.05, 0.56]} at={[0, 0.56, 0]} color={C.woodLight} radius={0.02} />
          {[
            [-0.34, -0.2],
            [0.34, -0.2],
            [-0.34, 0.2],
            [0.34, 0.2],
          ].map(([x, z]) => (
            <Cyl key={`${x}${z}`} r={0.025} h={0.56} at={[x!, 0, z!]} color={C.grey} />
          ))}
        </>
      )}
      <group ref={moving}>
        <PropShape id={id} />
      </group>
    </group>
  );
}

/** Brillo suave alrededor del personaje cuando prueba una estrategia útil. */
export function Sparkles({ at, take }: { at: Vec3; take: number }) {
  const group = useRef<Group>(null);
  const started = useRef<{ take: number; at: number } | null>(null);
  useFrame(({ clock }) => {
    if (!started.current || started.current.take !== take)
      started.current = { take, at: clock.elapsedTime };
    const t = clock.elapsedTime - started.current.at;
    group.current?.children.forEach((child, i) => {
      const a = i * 1.26 + t * 0.7;
      const rise = ((t * 0.32 + i * 0.17) % 1) * 1.9;
      child.position.set(Math.cos(a) * 0.65, 0.25 + rise, Math.sin(a) * 0.5 + 0.1);
      child.rotation.y = t * 2;
      child.scale.setScalar(Math.sin((rise / 1.9) * Math.PI) * Math.min(t, 1));
    });
  });
  return (
    <group ref={group} position={at}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} material={mat(i % 2 ? C.yellow : C.white, 0.25)}>
          <octahedronGeometry args={[0.055, 0]} />
        </mesh>
      ))}
    </group>
  );
}
