// Kichik 3D "qurilish bloklari": materiallar, shakllar, matnli teksturalar.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const C = {
  bg: '#eaf0fb',
  base: '#f1f5fd',
  baseSide: '#d6e0f5',
  lawn: '#dcf3e6',
  road: '#d3dcf0',
  lane: '#ffffff',
  path: '#fbfcff',
  wall: '#f8fafc',
  wallShade: '#e7edf8',
  trim: '#1d4ed8',
  navy: '#1e2a4a',
  glass: '#9cc3f5',
  glassDark: '#3b5b9a',
  tree: '#6fd3a0',
  treeDark: '#4fbf88',
  trunk: '#c9b8a6',
  metal: '#9aa7bd',
  dark: '#334155',
};

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.02, ...opts }));
  }
  return matCache.get(key);
}

function shadowed(mesh, cast = true) {
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  return mesh;
}

const geoCache = new Map();
function cachedGeo(key, make) {
  if (!geoCache.has(key)) geoCache.set(key, make());
  return geoCache.get(key);
}

export function box(w, h, d, color, { r = 0.12, opts, cast = true } = {}) {
  const radius = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
  const geo = cachedGeo(`b${w},${h},${d},${radius}`, () =>
    radius > 0.01 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d),
  );
  return shadowed(new THREE.Mesh(geo, typeof color === 'string' ? mat(color, opts) : color), cast);
}

export function cyl(rt, rb, h, color, seg = 20, opts) {
  const geo = cachedGeo(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
  return shadowed(new THREE.Mesh(geo, typeof color === 'string' ? mat(color, opts) : color));
}

export function sph(r, color, opts, detail = 1) {
  const geo = cachedGeo(`s${r},${detail}`, () => new THREE.IcosahedronGeometry(r, detail));
  return shadowed(new THREE.Mesh(geo, typeof color === 'string' ? mat(color, { flatShading: true, ...opts }) : color));
}

export function at(obj, x, y, z) {
  obj.position.set(x, y, z);
  return obj;
}

// Ikki nuqta orasidagi tekis yo'lak
export function strip(ax, az, bx, bz, width, color, y = 0.03, h = 0.06) {
  const len = Math.hypot(bx - ax, bz - az);
  const m = box(width, h, len, color, { r: 0.02, cast: false });
  m.position.set((ax + bx) / 2, y, (az + bz) / 2);
  m.rotation.y = Math.atan2(bx - ax, bz - az);
  return m;
}

// Kanvasda chizilgan matn → tekstura
export function textTexture(text, { bg = '#ffffff', fg = '#1d4ed8', w = 512, h = 128, font = 700, size = 64 } = {}) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = `${font} ${size}px Inter, system-ui, sans-serif`;
  const fit = (w * 0.9) / ctx.measureText(text).width;
  if (fit < 1) ctx.font = `${font} ${Math.floor(size * fit)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 4);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function sign(text, w, h, opts) {
  const tex = textTexture(text, opts);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  return m;
}

export function tree(scale = 1, color = C.tree) {
  const g = new THREE.Group();
  g.add(at(cyl(0.12, 0.16, 1.2, C.trunk, 8), 0, 0.6, 0));
  g.add(at(sph(0.85, color, undefined, 1), 0, 1.75, 0));
  g.scale.setScalar(scale);
  return g;
}

export function person(shirt, skin = '#f1c9a5') {
  const g = new THREE.Group();
  const legs = at(box(0.36, 0.5, 0.22, C.navy, { r: 0.08 }), 0, 0.25, 0);
  const body = at(box(0.46, 0.55, 0.28, shirt, { r: 0.12 }), 0, 0.75, 0);
  const head = at(sph(0.19, skin, { flatShading: false }, 2), 0, 1.22, 0);
  g.add(legs, body, head);
  return g;
}
