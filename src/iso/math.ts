// Projection orthographique paramétrable (yaw / pitch).
// yaw 45° + pitch 35.26° = isométrie vraie (sx = 0.866(x - y), sy = 0.5(x + y) - z).
// Monde : x vers le bas-droite, y vers le bas-gauche, z vers le haut.
export type V3 = { x: number; y: number; z: number };
export type View = { yaw: number; pitch: number };
export type P2 = { x: number; y: number };

export const v3 = (x: number, y: number, z: number): V3 => ({ x, y, z });
export const add = (a: V3, b: V3): V3 => v3(a.x + b.x, a.y + b.y, a.z + b.z);

export const ISO_PITCH = (Math.asin(Math.tan(Math.PI / 6)) * 180) / Math.PI;
const K = Math.sqrt(1.5);

export const project = (p: V3, v: View) => {
  const a = (v.yaw * Math.PI) / 180;
  const f = (v.pitch * Math.PI) / 180;
  const rx = p.x * Math.cos(a) - p.y * Math.sin(a);
  const ry = p.x * Math.sin(a) + p.y * Math.cos(a);
  return {
    x: K * rx,
    y: K * (ry * Math.sin(f) - p.z * Math.cos(f)),
    // Profondeur vers la caméra (plus grand = plus proche).
    d: ry * Math.cos(f) + p.z * Math.sin(f),
  };
};

// Matrice SVG qui envoie le repère local (u, v) d'une face sur l'écran.
// Projection linéaire : on peut dessiner n'importe quel SVG "à plat" sur une face.
export const faceMatrix = (origin: V3, u: V3, w: V3, view: View) => {
  const o = project(origin, view);
  const pu = project(u, view);
  const pw = project(w, view);
  return `matrix(${pu.x} ${pu.y} ${pw.x} ${pw.y} ${o.x} ${o.y})`;
};

export const AX = {
  X: v3(1, 0, 0),
  Y: v3(0, 1, 0),
  NY: v3(0, -1, 0),
  NZ: v3(0, 0, -1),
};

export const pts = (list: P2[]) =>
  list.map((q) => `${q.x.toFixed(2)},${q.y.toFixed(2)}`).join(" ");

// Enveloppe convexe (chaîne monotone d'Andrew).
export const hull = (input: P2[]): P2[] => {
  const p = [...input].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  if (p.length < 3) return p;
  const cross = (o: P2, a: P2, b: P2) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: P2[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: P2[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
};

// Ordre de peinture pour des pavés alignés sur les axes (algorithme du peintre).
export type Bounds = { x: number; y: number; z: number; w: number; d: number; h: number };

const drawnBefore = (a: Bounds, b: Bounds) => {
  const e = 0.01;
  if (a.z + a.h <= b.z + e) return true;
  if (b.z + b.h <= a.z + e) return false;
  if (a.x + a.w <= b.x + e) return true;
  if (b.x + b.w <= a.x + e) return false;
  if (a.y + a.d <= b.y + e) return true;
  if (b.y + b.d <= a.y + e) return false;
  return a.x + a.y + a.z < b.x + b.y + b.z;
};

export const paintOrder = <T extends Bounds>(items: T[]): T[] => {
  const left = [...items];
  const out: T[] = [];
  while (left.length) {
    let pick = left.findIndex((a) => left.every((b) => b === a || !drawnBefore(b, a)));
    if (pick < 0) {
      pick = 0;
      left.forEach((a, i) => {
        const s = a.x + a.y + a.z;
        const best = left[pick];
        if (s < best.x + best.y + best.z) pick = i;
      });
    }
    out.push(left[pick]);
    left.splice(pick, 1);
  }
  return out;
};
