import React from "react";
import { C, Mat } from "../brand";
import { AX, faceMatrix, hull, P2, project, pts, v3, V3 } from "./math";
import { useView } from "./World";

// Direction horizontale des ombres (lumière venant du haut-gauche de l'image).
const LIGHT = { x: 0.5, y: 0.18 };

type BoxProps = {
  p: V3;
  s: V3;
  mat: Mat;
  // Contenus dessinés à plat sur les faces, en unités monde :
  // dessus (u = x, v = y), face gauche (u = x, v = vers le bas), face droite (u = -y, v = vers le bas).
  top?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  opacity?: number;
};

export const IsoBox: React.FC<BoxProps> = ({ p, s, mat, top, left, right, opacity = 1 }) => {
  const view = useView();
  if (s.x <= 0.01 || s.y <= 0.01 || s.z <= 0.01 || opacity <= 0.001) return null;
  const P = (x: number, y: number, z: number) => project(v3(x, y, z), view);
  const { x, y, z } = p;
  const [w, d, h] = [s.x, s.y, s.z];
  const t1 = P(x, y, z + h);
  const t2 = P(x + w, y, z + h);
  const t3 = P(x + w, y + d, z + h);
  const t4 = P(x, y + d, z + h);
  const b2 = P(x + w, y, z);
  const b3 = P(x + w, y + d, z);
  const b4 = P(x, y + d, z);
  return (
    <g opacity={opacity}>
      {/* Silhouette pleine pour éviter les liserés d'anticrénelage entre les faces. */}
      <polygon points={pts([t1, t2, b2, b3, b4, t4])} fill={mat.right} />
      <polygon points={pts([t4, t3, b3, b4])} fill={mat.left} />
      <polygon points={pts([t2, t3, b3, b2])} fill={mat.right} />
      <polygon points={pts([t1, t2, t3, t4])} fill={mat.top} />
      <polyline
        points={pts([t2, t3, t4])}
        fill="none"
        stroke={mat.edge ?? "rgba(255,255,255,0.7)"}
        strokeWidth={1.4}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {top ? <g transform={faceMatrix(v3(x, y, z + h), AX.X, AX.Y, view)}>{top}</g> : null}
      {left ? <g transform={faceMatrix(v3(x, y + d, z + h), AX.X, AX.NZ, view)}>{left}</g> : null}
      {right ? (
        <g transform={faceMatrix(v3(x + w, y + d, z + h), AX.NY, AX.NZ, view)}>{right}</g>
      ) : null}
    </g>
  );
};

// Ombre portée douce d'un pavé sur un sol horizontal (z = ground).
export const IsoShadow: React.FC<{
  p: V3;
  s: V3;
  ground?: number;
  opacity?: number;
  spread?: number;
}> = ({ p, s, ground = 0, opacity = 0.16, spread = 1 }) => {
  const view = useView();
  const lift = Math.max(0, p.z - ground);
  const corners: P2[] = [];
  for (const hz of [lift, lift + s.z]) {
    const ox = LIGHT.x * hz * spread;
    const oy = LIGHT.y * hz * spread;
    for (const [cx, cy] of [
      [0, 0],
      [s.x, 0],
      [s.x, s.y],
      [0, s.y],
    ]) {
      corners.push(project(v3(p.x + cx + ox, p.y + cy + oy, ground), view));
    }
  }
  const fade = opacity / (1 + lift / 260);
  return (
    <polygon points={pts(hull(corners))} fill={C.navy} opacity={fade} filter="url(#soft)" />
  );
};

// Ombre ovale (sous un cylindre ou une île en lévitation).
export const IsoBlob: React.FC<{ c: V3; rx: number; ry: number; opacity?: number; soft?: boolean }> = ({
  c,
  rx,
  ry,
  opacity = 0.14,
  soft = false,
}) => {
  const view = useView();
  const ring: P2[] = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    ring.push(project(v3(c.x + Math.cos(a) * rx, c.y + Math.sin(a) * ry, c.z), view));
  }
  return (
    <polygon
      points={pts(ring)}
      fill={C.navy}
      opacity={opacity}
      filter={soft ? "url(#softer)" : "url(#soft)"}
    />
  );
};

export const IsoCylinder: React.FC<{
  c: V3; // centre de la base
  r: number;
  h: number;
  side: string;
  top: string;
  topContent?: React.ReactNode;
}> = ({ c, r, h, side, top, topContent }) => {
  const view = useView();
  if (r <= 0.5) return null;
  const ring = (z: number) => {
    const out: P2[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      out.push(project(v3(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, z), view));
    }
    return out;
  };
  const topRing = ring(c.z + h);
  const body = hull([...ring(c.z), ...topRing]);
  return (
    <g>
      {h > 0.5 ? <polygon points={pts(body)} fill={side} /> : null}
      <polygon points={pts(topRing)} fill={top} />
      {topContent ? (
        <g transform={faceMatrix(v3(c.x, c.y, c.z + h), AX.X, AX.Y, view)}>{topContent}</g>
      ) : null}
    </g>
  );
};

// Élément toujours face caméra (étiquettes, badges) ancré sur un point 3D.
export const Billboard: React.FC<{ at: V3; children: React.ReactNode; scale?: number; opacity?: number }> = ({
  at,
  children,
  scale = 1,
  opacity = 1,
}) => {
  const view = useView();
  const q = project(at, view);
  return (
    <g transform={`translate(${q.x} ${q.y}) scale(${scale})`} opacity={opacity}>
      {children}
    </g>
  );
};

// Polygone posé au sol (marquages, rubans).
export const GroundPoly: React.FC<{ points: V3[]; fill: string; opacity?: number }> = ({
  points,
  fill,
  opacity = 1,
}) => {
  const view = useView();
  return <polygon points={pts(points.map((q) => project(q, view)))} fill={fill} opacity={opacity} />;
};

// Face plane d'un repère local, pour dessiner directement sur un plan (sol, mur).
export const Plane: React.FC<{ origin: V3; u: V3; v: V3; children: React.ReactNode }> = ({
  origin,
  u,
  v,
  children,
}) => {
  const view = useView();
  return <g transform={faceMatrix(origin, u, v, view)}>{children}</g>;
};
