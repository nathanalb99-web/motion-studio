import React from "react";
import { useVideoConfig } from "remotion";
import { E, settle, tween, useTime } from "../anim";
import { C, MAT } from "../brand";
import { INTER } from "../fonts";
import { v3 } from "../iso/math";
import { Billboard, IsoBlob, IsoBox, IsoCylinder, IsoShadow } from "../iso/primitives";
import { BELT, CUBE, ISLAND, STATIONS_X } from "../timeline";

const O = ISLAND.pipeline;
const at = (x: number, y: number, z: number) => v3(O.x + x, O.y + y, O.z + z);
const PLINTH_H = 24;
const S = STATIONS_X;

// Déplacements du cube projet sur le tapis (secondes locales à la séquence).
export const MOVES = [
  [0.7, 1.1],
  [1.5, 1.9],
  [2.4, 2.8],
] as const;

export const cubeXAt = (t: number) =>
  S[0] + MOVES.reduce((acc, [t0, t1], i) => acc + (S[i + 1] - S[i]) * tween(t, t0, t1, 0, 1, E.inOut), 0);

// Centre du dessus du cube, en coordonnées monde (utilisé par la caméra).
export const cubeTopAt = (t: number) => at(cubeXAt(t), (BELT.y0 + BELT.y1) / 2, BELT.h + CUBE);

const Plinth: React.FC<{ s: number }> = ({ s }) => (
  <>
    <IsoShadow p={at(s - 160, -340, 0)} s={v3(320, 320, PLINTH_H)} opacity={0.12} />
    <IsoBox p={at(s - 160, -340, 0)} s={v3(320, 320, PLINTH_H)} mat={MAT.pink} />
  </>
);

const Badge: React.FC<{ s: number; n: string; k: number }> = ({ s, n, k }) => (
  <Billboard at={at(s - 128, -62, PLINTH_H + 4)} scale={k} opacity={k}>
    <circle r={30} fill={C.coral} />
    <text
      y={9}
      textAnchor="middle"
      fontFamily={INTER}
      fontWeight={800}
      fontSize={25}
      fill={C.white}
      letterSpacing={-0.5}
    >
      {n}
    </text>
  </Billboard>
);

// --- 01 Brief : ordinateur portable + chrono -----------------------------------
const Brief: React.FC<{ t: number }> = ({ t }) => {
  const s = S[0];
  const fill = [0, 1, 2].map((i) => tween(t, 0.12 + i * 0.12, 0.38 + i * 0.12, 0, 1, E.out));
  const sent = tween(t, 0.58, 0.7, 0, 1);
  const hand = tween(t, 0.05, 0.75, 0, 360, E.inOut);
  const form = (
    <g>
      <rect x={10} y={10} width={200} height={130} rx={6} fill={C.bg} />
      <rect x={22} y={22} width={80} height={10} rx={5} fill={C.navy} />
      {fill.map((k, i) => (
        <g key={i}>
          <rect x={22} y={44 + i * 22} width={176} height={16} rx={5} fill={C.white} stroke="#DCE3EF" strokeWidth={1.5} />
          <rect x={28} y={49 + i * 22} width={(i === 1 ? 120 : 150) * k} height={6} rx={3} fill="#9AA6B8" />
        </g>
      ))}
      <rect x={22} y={112} width={86} height={18} rx={9} fill={sent > 0.5 ? C.coral : "#F2B8C5"} />
      <rect x={36} y={119} width={44} height={5} rx={2.5} fill={C.white} />
    </g>
  );
  return (
    <g>
      <Plinth s={s} />
      <IsoShadow p={at(s - 110, -250, PLINTH_H)} s={v3(220, 160, 160)} ground={PLINTH_H} opacity={0.14} />
      <IsoBox p={at(s - 110, -232, PLINTH_H)} s={v3(220, 140, 10)} mat={MAT.white}
        top={
          <g>
            <rect x={18} y={14} width={184} height={80} rx={6} fill="#E3E8F0" />
            <rect x={80} y={102} width={60} height={26} rx={5} fill="#E3E8F0" />
          </g>
        }
      />
      <IsoBox p={at(s - 110, -250, PLINTH_H + 8)} s={v3(220, 14, 150)} mat={MAT.navy} left={form} />
      <IsoBlob c={at(s + 106, -70, PLINTH_H)} rx={40} ry={40} opacity={0.18} />
      <IsoCylinder
        c={at(s + 100, -76, PLINTH_H)}
        r={38}
        h={16}
        side="url(#cylWhite)"
        top={C.white}
        topContent={
          <g>
            <circle r={30} fill="none" stroke="#DCE3EF" strokeWidth={3} />
            <circle r={4} fill={C.navy} />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-24}
              stroke={C.coral}
              strokeWidth={5}
              strokeLinecap="round"
              transform={`rotate(${hand - 45})`}
            />
          </g>
        }
      />
    </g>
  );
};

// --- 02 Script : document + tampon « validé » -----------------------------------
const Script: React.FC<{ t: number }> = ({ t }) => {
  const s = S[1];
  const down = tween(t, 1.08, 1.24, 0, 1, E.in);
  const up = tween(t, 1.32, 1.6, 0, 1, E.out);
  const lift = 120 * (1 - down) + 120 * up;
  const mark = tween(t, 1.24, 1.32, 0, 1);
  const doc = (
    <g>
      <rect x={20} y={20} width={90} height={12} rx={6} fill={C.navy} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={20} y={48 + i * 20} width={[130, 110, 124, 96, 130, 84, 118][i]} height={7} rx={3.5} fill="#C3CCDA" />
      ))}
      <g opacity={mark} transform="translate(86 108)">
        <rect x={-50} y={-34} width={100} height={68} rx={10} fill="none" stroke={C.coral} strokeWidth={5} />
        <path d="M-20,0 L-6,14 L22,-14" fill="none" stroke={C.coral} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
  return (
    <g>
      <Plinth s={s} />
      <IsoShadow p={at(s - 86, -280, PLINTH_H)} s={v3(172, 230, 6)} ground={PLINTH_H} opacity={0.12} />
      <IsoBox p={at(s - 86, -280, PLINTH_H)} s={v3(172, 230, 6)} mat={MAT.white} top={doc} />
      <IsoShadow p={at(s - 50, -206, PLINTH_H + 6 + lift)} s={v3(100, 70, 86)} ground={PLINTH_H + 6} opacity={0.2} />
      <IsoBox p={at(s - 50, -206, PLINTH_H + 6 + lift)} s={v3(100, 70, 24)} mat={MAT.coral} />
      <IsoCylinder c={at(s, -171, PLINTH_H + 30 + lift)} r={17} h={52} side="url(#cylNavy)" top="#26324F" />
      <IsoCylinder c={at(s, -171, PLINTH_H + 82 + lift)} r={30} h={14} side="url(#cylNavy)" top="#26324F" />
    </g>
  );
};

// --- 03 Animation : écran de montage + enceinte -----------------------------------
const Animation: React.FC<{ t: number }> = ({ t }) => {
  const s = S[2];
  const play = tween(t, 1.85, 2.5, 0, 1, E.inOut);
  const live = tween(t, 1.75, 1.9, 0, 1) * tween(t, 2.5, 2.7, 1, 0);
  const pulse = 1 + 0.12 * live * Math.abs(Math.sin(t * 14));
  const editor = (
    <g>
      <rect x={10} y={10} width={240} height={142} rx={6} fill="#1B2540" />
      <rect x={20} y={20} width={110} height={64} rx={5} fill={C.coral} />
      <polygon points="66,38 66,66 90,52" fill={C.white} />
      {Array.from({ length: 13 }).map((_, i) => {
        const hgt = 8 + 40 * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.7 + t * 9))) * (0.35 + 0.65 * live);
        return <rect key={i} x={142 + i * 8} y={52 - hgt / 2} width={5} height={hgt} rx={2.5} fill={i % 3 === 0 ? C.coral2 : "#C9D2E1"} />;
      })}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={20} y={96 + i * 17} width={220} height={11} rx={4} fill="#26324F" />
      ))}
      <rect x={30} y={96} width={90} height={11} rx={4} fill={C.coral} />
      <rect x={70} y={113} width={120} height={11} rx={4} fill={C.coral2} opacity={0.8} />
      <rect x={40} y={130} width={70} height={11} rx={4} fill="#C9D2E1" />
      <rect x={130} y={130} width={60} height={11} rx={4} fill="#C9D2E1" />
      <rect x={20 + 216 * play} y={90} width={4} height={56} rx={2} fill={C.white} />
    </g>
  );
  return (
    <g>
      <Plinth s={s} />
      <IsoShadow p={at(s - 130, -236, PLINTH_H)} s={v3(260, 30, 200)} ground={PLINTH_H} opacity={0.12} />
      <IsoBox p={at(s - 70, -232, PLINTH_H)} s={v3(140, 70, 8)} mat={MAT.navy} />
      <IsoBox p={at(s - 14, -214, PLINTH_H + 8)} s={v3(28, 14, 56)} mat={MAT.navy} />
      <IsoBox p={at(s - 130, -230, PLINTH_H + 64)} s={v3(260, 16, 162)} mat={MAT.navy} left={editor} />
      <IsoShadow p={at(s + 70, -110, PLINTH_H)} s={v3(64, 64, 84)} ground={PLINTH_H} opacity={0.16} />
      <IsoBox
        p={at(s + 70, -110, PLINTH_H)}
        s={v3(64, 64, 84)}
        mat={MAT.navy}
        left={
          <g transform="translate(32 42)">
            <circle r={22 * pulse} fill="#26324F" />
            <circle r={11} fill={C.coral} />
          </g>
        }
      />
    </g>
  );
};

// --- 04 Livraison : 3 formats ---------------------------------------------------
const FORMATS = [
  { label: "16:9", x: -150, y: -270, w: 168, h: 96, at: 2.88 },
  { label: "1:1", x: 34, y: -205, w: 104, h: 104, at: 3.0 },
  { label: "9:16", x: -96, y: -128, w: 72, h: 128, at: 3.12 },
];

const Delivery: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const s = S[3];
  return (
    <g>
      <Plinth s={s} />
      {FORMATS.map((f) => {
        const k = settle(t, f.at, fps, 0.42);
        const H = (f.h + 16) * k;
        const screen = (
          <g opacity={k}>
            <rect x={8} y={8} width={f.w} height={f.h} rx={5} fill={C.coral} />
            <polygon
              points={`${8 + f.w / 2 - 9},${8 + f.h / 2 - 12} ${8 + f.w / 2 - 9},${8 + f.h / 2 + 12} ${8 + f.w / 2 + 13},${8 + f.h / 2}`}
              fill={C.white}
            />
          </g>
        );
        return (
          <g key={f.label}>
            <IsoShadow p={at(s + f.x, f.y, PLINTH_H)} s={v3(f.w + 16, 14, H)} ground={PLINTH_H} opacity={0.14} />
            <IsoBox p={at(s + f.x, f.y, PLINTH_H)} s={v3(f.w + 16, 14, H)} mat={MAT.navy} left={H > f.h ? screen : null} />
            <Billboard at={at(s + f.x + (f.w + 16) / 2, f.y + 14, PLINTH_H + H + 26)} opacity={k}>
              <rect x={-38} y={-20} width={76} height={34} rx={17} fill={C.navy} />
              <text y={5} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={20} fill={C.white}>
                {f.label}
              </text>
            </Billboard>
          </g>
        );
      })}
    </g>
  );
};

export const PipelineIsland: React.FC = () => {
  const t = useTime();
  const { fps } = useVideoConfig();
  const cubeX = cubeXAt(t);
  const cubeOut = tween(t, 2.84, 3.08, 1, 0, E.in);
  const cubeS = CUBE * cubeOut;
  const beltLen = 2180;
  const slat = 54;
  const shift = ((cubeX % slat) + slat) % slat;

  return (
    <g>
      <IsoBlob c={at(0, -40, -340)} rx={1250} ry={420} opacity={0.05} soft />
      <IsoBox p={at(-1160, -390, -44)} s={v3(2320, 700, 44)} mat={MAT.slab} />
      <Brief t={t} />
      <Script t={t} />
      <Animation t={t} />
      <Delivery t={t} fps={fps} />
      {/* Pastilles devant les stations, avant le tapis qui doit pouvoir les masquer. */}
      {S.map((s, i) => (
        <Badge key={i} s={s} n={`0${i + 1}`} k={settle(t, 0.1 + i * 0.12, fps)} />
      ))}

      <IsoShadow p={at(-beltLen / 2, BELT.y0, 0)} s={v3(beltLen, BELT.y1 - BELT.y0, BELT.h)} opacity={0.18} />
      <IsoBox
        p={at(-beltLen / 2, BELT.y0, 0)}
        s={v3(beltLen, BELT.y1 - BELT.y0, BELT.h)}
        mat={MAT.navy}
        top={
          <g>
            {Array.from({ length: Math.ceil(beltLen / slat) }).map((_, i) => {
              const u = i * slat + shift;
              return u < beltLen - 4 ? <rect key={i} x={u} y={14} width={4} height={112} fill="rgba(255,255,255,0.09)" /> : null;
            })}
            <rect x={0} y={4} width={beltLen} height={6} fill="#3A4766" />
            <rect x={0} y={130} width={beltLen} height={6} fill="#3A4766" />
          </g>
        }
      />

      {cubeS > 1 ? (
        <>
          <IsoShadow
            p={at(cubeX - cubeS / 2, (BELT.y0 + BELT.y1) / 2 - cubeS / 2, BELT.h)}
            s={v3(cubeS, cubeS, cubeS)}
            ground={BELT.h}
            opacity={0.3}
          />
          <IsoBox
            p={at(cubeX - cubeS / 2, (BELT.y0 + BELT.y1) / 2 - cubeS / 2, BELT.h)}
            s={v3(cubeS, cubeS, cubeS)}
            mat={MAT.coral}
          />
        </>
      ) : null}
    </g>
  );
};
