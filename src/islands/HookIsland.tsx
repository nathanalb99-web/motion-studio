import React from "react";
import { useVideoConfig } from "remotion";
import { E, settle, tween, useTime } from "../anim";
import { C, MAT, Mat } from "../brand";
import { AX, Bounds, paintOrder, v3 } from "../iso/math";
import { IsoBlob, IsoBox, IsoCylinder, IsoShadow, Plane } from "../iso/primitives";
import { useView } from "../iso/World";
import { ISLAND, T } from "../timeline";

const O = ISLAND.hook;
const at = (x: number, y: number, z: number) => v3(O.x + x, O.y + y, O.z + z);

const SCREEN = { w: 680, d: 480, h: 26 };
const BLOCK_H = 26;

type BlockDef = { cx: number; cy: number; w: number; d: number; layer: number; mat: Mat };

// Les « blocs de texte » qui noient le produit : 3 couches posées sur l'écran.
const BLOCKS: BlockDef[] = [
  { cx: -215, cy: -140, w: 230, d: 150, layer: 0, mat: MAT.white },
  { cx: 25, cy: -150, w: 210, d: 130, layer: 0, mat: MAT.grey },
  { cx: 240, cy: -130, w: 170, d: 170, layer: 0, mat: MAT.white },
  { cx: -200, cy: 85, w: 260, d: 160, layer: 0, mat: MAT.grey },
  { cx: 60, cy: 70, w: 200, d: 150, layer: 0, mat: MAT.navy },
  { cx: 250, cy: 120, w: 160, d: 150, layer: 0, mat: MAT.white },
  { cx: -120, cy: -70, w: 240, d: 140, layer: 1, mat: MAT.white },
  { cx: 170, cy: -40, w: 220, d: 120, layer: 1, mat: MAT.grey },
  { cx: -60, cy: 150, w: 230, d: 120, layer: 1, mat: MAT.white },
  { cx: 210, cy: 190, w: 180, d: 110, layer: 1, mat: MAT.grey },
  { cx: -290, cy: -200, w: 150, d: 110, layer: 1, mat: MAT.white },
  { cx: 30, cy: -60, w: 220, d: 120, layer: 2, mat: MAT.navy },
  { cx: -150, cy: 110, w: 190, d: 110, layer: 2, mat: MAT.grey },
  { cx: 200, cy: 90, w: 170, d: 110, layer: 2, mat: MAT.white },
];

const LAYER_START = [0.0, 1.12, 1.62];
const LAYER_STAGGER = [0.07, 0.08, 0.1];

// Lignes de « texte » dessinées sur le dessus d'un bloc (aucun faux texte lisible).
const TextLines: React.FC<{ w: number; d: number; dark: boolean; seed: number }> = ({ w, d, dark, seed }) => {
  const head = dark ? "rgba(255,255,255,0.75)" : "#9AA6B8";
  const body = dark ? "rgba(255,255,255,0.32)" : "#C3CCDA";
  const widths = [0.86, 0.72, 0.8, 0.64, 0.78];
  const rows: React.ReactNode[] = [];
  for (let y = 46, i = 0; y < d - 14; y += 20, i++) {
    rows.push(
      <rect key={i} x={18} y={y} width={(w - 36) * widths[(i + seed) % widths.length]} height={8} rx={4} fill={body} />,
    );
  }
  return (
    <g>
      <rect x={18} y={20} width={(w - 36) * 0.55} height={13} rx={6.5} fill={head} />
      {rows}
    </g>
  );
};

const CHART = [0.28, 0.42, 0.36, 0.58, 0.5, 0.72, 0.66, 0.9];

// Interface SaaS dessinée à plat sur le dessus de l'écran.
const Dashboard: React.FC<{ chartK: number }> = ({ chartK }) => {
  const x0 = 172;
  const x1 = 628;
  const base = 424;
  const line = CHART.map((v, i) => {
    const x = x0 + ((x1 - x0) * i) / (CHART.length - 1);
    return `${i === 0 ? "M" : "L"}${x},${base - v * 190}`;
  }).join(" ");
  const len = 620;
  return (
    <g>
      <rect x={16} y={16} width={648} height={448} rx={12} fill={C.bg} />
      <rect x={16} y={16} width={124} height={448} rx={12} fill="#EEF2F9" />
      <circle cx={44} cy={46} r={10} fill={C.coral} />
      <rect x={60} y={41} width={56} height={10} rx={5} fill="#C9D2E1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          {i === 1 ? <rect x={28} y={84 + i * 34} width={100} height={24} rx={8} fill="#FFE3E9" /> : null}
          <rect x={38} y={91 + i * 34} width={i === 1 ? 62 : 70} height={10} rx={5} fill={i === 1 ? C.coral : "#C9D2E1"} />
        </g>
      ))}
      <rect x={156} y={32} width={250} height={28} rx={14} fill="#EEF2F9" />
      <circle cx={630} cy={46} r={14} fill="#D3DBE8" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${156 + i * 166} 78)`}>
          <rect width={152} height={88} rx={10} fill={C.white} stroke="#E3E8F0" strokeWidth={2} />
          <rect x={14} y={16} width={58} height={9} rx={4.5} fill="#C9D2E1" />
          <rect x={14} y={36} width={i === 1 ? 70 : 96} height={20} rx={6} fill={C.navy} />
          <rect x={14} y={66} width={40} height={7} rx={3.5} fill={i === 0 ? C.coral : "#DCE3EF"} />
        </g>
      ))}
      <rect x={156} y={182} width={488} height={266} rx={12} fill={C.white} stroke="#E3E8F0" strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x0} y={248 + i * 48} width={x1 - x0} height={2} fill="#EEF2F9" />
      ))}
      <rect x={172} y={200} width={90} height={10} rx={5} fill="#C9D2E1" />
      <path d={`${line} L${x1},${base} L${x0},${base} Z`} fill={C.coral} opacity={0.12 * chartK} />
      <path
        d={line}
        fill="none"
        stroke={C.coral}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - chartK)}
      />
    </g>
  );
};

export const HookIsland: React.FC = () => {
  const t = useTime();
  const { fps } = useVideoConfig();
  const view = useView();

  // --- Blocs : chute, empilement, effondrement --------------------------------
  const collapseRank = BLOCKS.map((b, i) => ({ i, k: b.layer * 10000 + (b.cx + b.cy) }))
    .sort((a, b) => b.k - a.k)
    .map((r) => r.i);

  const blocks = BLOCKS.map((b, i) => {
    const order = BLOCKS.filter((o, j) => o.layer === b.layer && j < i).length;
    const t0 = LAYER_START[b.layer] + order * LAYER_STAGGER[b.layer];
    const fall = tween(t, t0, t0 + 0.42, 1, 0, E.fall);
    const zLand = SCREEN.h + b.layer * BLOCK_H;

    const c0 = T.collapse + collapseRank.indexOf(i) * 0.028;
    const push = tween(t, c0, c0 + 0.42, 0, 1, E.out);
    const drop = tween(t, c0 + 0.1, c0 + 0.6, 0, 1, E.fall);
    const toX = b.cx >= b.cy;
    const dx = toX ? push * 760 : 0;
    const dy = toX ? 0 : push * 760;

    const visible = t >= t0 ? tween(t, t0, t0 + 0.12, 0, 1) * tween(t, c0 + 0.32, c0 + 0.55, 1, 0) : 0;
    return {
      x: b.cx - b.w / 2 + dx,
      y: b.cy - b.d / 2 + dy,
      z: zLand + fall * 760 - drop * 1500,
      w: b.w,
      d: b.d,
      h: BLOCK_H,
      mat: b.mat,
      i,
      visible,
    } satisfies Bounds & { mat: Mat; i: number; visible: number };
  }).filter((b) => b.visible > 0.001);

  // --- Bouton Play ------------------------------------------------------------
  const playK = settle(t, 3.18, fps, 0.5);
  const playH = settle(t, 3.3, fps, 0.55);
  const r = 112 * playK;
  const ripple = tween(t, 3.22, 3.95, 0, 1, E.out);
  const chartK = tween(t, 0.15, 1.0, 0, 1, E.out);

  const a = (view.yaw * Math.PI) / 180;
  const dir = { x: Math.cos(a), y: -Math.sin(a) };
  const perp = { x: Math.sin(a), y: Math.cos(a) };
  const tri = [
    [dir.x * 48, dir.y * 48],
    [-dir.x * 26 + perp.x * 42, -dir.y * 26 + perp.y * 42],
    [-dir.x * 26 - perp.x * 42, -dir.y * 26 - perp.y * 42],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <g>
      {/* Île en lévitation */}
      <IsoBlob c={at(60, 60, -320)} rx={520} ry={520} opacity={0.05} soft />
      <IsoBox p={at(-460, -460, -44)} s={v3(920, 920, 44)} mat={MAT.slab} />
      <IsoShadow p={at(-SCREEN.w / 2, -SCREEN.d / 2, 0)} s={v3(SCREEN.w, SCREEN.d, SCREEN.h)} opacity={0.2} />
      <IsoBox
        p={at(-SCREEN.w / 2, -SCREEN.d / 2, 0)}
        s={v3(SCREEN.w, SCREEN.d, SCREEN.h)}
        mat={MAT.navy}
        top={<Dashboard chartK={chartK} />}
      />

      {/* Onde corail quand le Play surgit */}
      {ripple > 0 && ripple < 1 ? (
        <Plane origin={at(0, 0, SCREEN.h + 0.5)} u={AX.X} v={AX.Y}>
          <circle r={110 + ripple * 190} fill="none" stroke={C.coral} strokeWidth={6} opacity={(1 - ripple) * 0.7} />
        </Plane>
      ) : null}

      {blocks.map((b) => (
        <IsoShadow key={`s${b.i}`} p={at(b.x, b.y, b.z)} s={v3(b.w, b.d, b.h)} ground={SCREEN.h} opacity={0.22 * b.visible} />
      ))}
      {paintOrder(blocks).map((b) => (
        <IsoBox
          key={b.i}
          p={at(b.x, b.y, b.z)}
          s={v3(b.w, b.d, b.h)}
          mat={b.mat}
          opacity={b.visible}
          top={<TextLines w={b.w} d={b.d} dark={b.mat === MAT.navy} seed={b.i} />}
        />
      ))}

      {r > 1 ? (
        <>
          <IsoBlob c={at(14, 8, SCREEN.h)} rx={r * 1.05} ry={r * 1.05} opacity={0.22} />
          <IsoCylinder
            c={at(0, 0, SCREEN.h)}
            r={r}
            h={4 + 56 * playH}
            side="url(#cylCoral)"
            top={C.coralTop}
            topContent={<polygon points={tri} fill={C.white} transform={`scale(${r / 112})`} />}
          />
        </>
      ) : null}
    </g>
  );
};
