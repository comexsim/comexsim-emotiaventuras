import {
  BackSide,
  CanvasTexture,
  CylinderGeometry,
  DataTexture,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  NearestFilter,
  RedFormat,
  RepeatWrapping,
  Vector3,
  type BufferGeometry,
  type Material,
  type Object3D,
} from "three";

import { skinColor, type SimStyle, type Skin } from "./simStyles";

/**
 * Re-viste una escena ya montada sin tocar sus componentes: cada malla guarda su material y su
 * geometría originales y recibe una copia derivada según el estilo. Con el estilo «actual» se
 * devuelven los originales. Así el simulador de «/» no cambia en nada.
 */

interface SkinData {
  originalMaterial?: Material;
  originalGeometry?: BufferGeometry;
  skinnedMaterial?: Material;
  skinStyle?: string;
  hull?: boolean;
}

const derived = new Map<string, Material>();
const geometries = new Map<string, BufferGeometry>();
const gradients = new Map<number, DataTexture>();
let clayBump: CanvasTexture | null = null;
const scaleTmp = new Vector3();

function dataOf(object: Object3D): SkinData {
  return object.userData as SkinData;
}

function gradient(steps: number): DataTexture {
  let found = gradients.get(steps);
  if (!found) {
    const values = new Uint8Array(steps);
    for (let i = 0; i < steps; i += 1) values[i] = Math.round(((i + 1) / steps) * 255);
    found = new DataTexture(values, steps, 1, RedFormat);
    found.minFilter = NearestFilter;
    found.magFilter = NearestFilter;
    found.needsUpdate = true;
    gradients.set(steps, found);
  }
  return found;
}

/** Huellas y grumos de plastilina, generados una vez con una semilla fija. */
function clayTexture(): CanvasTexture {
  if (clayBump) return clayBump;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1 + rand() * 7;
      const shade = Math.round(110 + rand() * 40);
      ctx.fillStyle = `rgba(${shade},${shade},${shade},0.35)`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.4 + rand()), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  clayBump = new CanvasTexture(canvas);
  clayBump.wrapS = RepeatWrapping;
  clayBump.wrapT = RepeatWrapping;
  clayBump.repeat.set(3, 3);
  return clayBump;
}

function colorOf(material: Material): string {
  const withColor = material as Material & { color?: { getHexString(): string } };
  return withColor.color ? `#${withColor.color.getHexString()}` : "#ffffff";
}

function derive(original: Material, style: SimStyle, skin: Skin, palette: string[]): Material {
  const key = `${original.uuid}|${style.id}`;
  const found = derived.get(key);
  if (found) return found;
  const color = skinColor(colorOf(original), skin, palette);
  const shared = { transparent: original.transparent, opacity: original.opacity };
  let next: Material;
  if (original instanceof MeshBasicMaterial) {
    next = new MeshBasicMaterial({ ...shared, color });
  } else if (skin.material === "toon") {
    next = new MeshToonMaterial({ ...shared, color, gradientMap: gradient(skin.steps ?? 3) });
  } else if (skin.material === "lambert") {
    next = new MeshLambertMaterial({ ...shared, color, flatShading: skin.faceted ?? false });
  } else {
    next = new MeshStandardMaterial({
      ...shared,
      color,
      roughness: skin.roughness ?? 0.8,
      metalness: 0,
      flatShading: skin.faceted ?? false,
      bumpMap: skin.bump ? clayTexture() : null,
      bumpScale: skin.bump ? 9 : 1,
    });
  }
  derived.set(key, next);
  return next;
}

/** En el low-poly, esferas y cilindros pasan a tener muy pocas caras. */
function facetedGeometry(original: BufferGeometry): BufferGeometry {
  const params = (original as BufferGeometry & { parameters?: Record<string, number> }).parameters;
  if (!params) return original;
  const key = `${original.type}|${JSON.stringify(params)}`;
  const found = geometries.get(key);
  if (found) return found;
  let next: BufferGeometry = original;
  if (original.type === "SphereGeometry" && params.radius !== undefined) {
    next = new IcosahedronGeometry(params.radius, 1);
  } else if (original.type === "CylinderGeometry" && params.radiusTop !== undefined) {
    const segments = params.radiusBottom! > 4 ? 14 : 7;
    next = new CylinderGeometry(
      params.radiusTop,
      params.radiusBottom,
      params.height,
      segments,
      1,
      Boolean(params.openEnded),
    );
  }
  geometries.set(key, next);
  return next;
}

const hullMaterials = new Map<string, MeshBasicMaterial>();
function hullMaterial(color: string): MeshBasicMaterial {
  let found = hullMaterials.get(color);
  if (!found) {
    found = new MeshBasicMaterial({ color, side: BackSide });
    hullMaterials.set(color, found);
  }
  return found;
}

const FLAT_TYPES = new Set(["PlaneGeometry", "CircleGeometry", "RingGeometry"]);

/** Contorno de grosor casi constante: un casco invertido levemente más grande que la pieza. */
function addHull(mesh: Mesh, outline: { color: string; width: number }) {
  const geometry = mesh.geometry;
  if (FLAT_TYPES.has(geometry.type)) return;
  if (!geometry.boundingSphere) geometry.computeBoundingSphere();
  const radius = geometry.boundingSphere?.radius ?? 0;
  mesh.getWorldScale(scaleTmp);
  const world = radius * Math.max(scaleTmp.x, scaleTmp.y, scaleTmp.z);
  if (world > 6 || world < 0.005) return;
  const hull = new Mesh(geometry, hullMaterial(outline.color));
  hull.scale.setScalar(Math.min(1.35, 1 + outline.width / Math.max(world, 0.04)));
  hull.raycast = () => undefined;
  dataOf(hull).hull = true;
  mesh.add(hull);
}

function removeHulls(mesh: Mesh) {
  for (const child of [...mesh.children]) {
    if (dataOf(child).hull) mesh.remove(child);
  }
}

export function applySkin(root: Object3D, style: SimStyle) {
  const meshes: Mesh[] = [];
  root.traverse((object) => {
    if (object instanceof Mesh && !dataOf(object).hull) meshes.push(object);
  });
  const palette = style.palette.map((swatch) => swatch.hex);
  for (const mesh of meshes) {
    if (Array.isArray(mesh.material)) continue;
    const data = dataOf(mesh);
    // React pudo volver a asignar el material: ese pasa a ser el original.
    if (data.skinnedMaterial !== mesh.material) {
      data.originalMaterial = mesh.material;
      data.skinStyle = undefined;
    }
    if (data.skinStyle === style.id) continue;
    data.originalGeometry ??= mesh.geometry;
    removeHulls(mesh);
    const original = data.originalMaterial ?? mesh.material;
    const skin = style.skin;
    if (!skin) {
      mesh.material = original;
      mesh.geometry = data.originalGeometry;
    } else {
      mesh.geometry = skin.faceted ? facetedGeometry(data.originalGeometry) : data.originalGeometry;
      mesh.material = derive(original, style, skin, palette);
      if (skin.outline) addHull(mesh, skin.outline);
    }
    data.skinnedMaterial = mesh.material;
    data.skinStyle = style.id;
  }
}
