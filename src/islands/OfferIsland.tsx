import React from "react";
import { interpolateColors, useVideoConfig } from "remotion";
import { E, settle, tween, useTime } from "../anim";
import { C, MAT, Mat } from "../brand";
import { INTER } from "../fonts";
import { v3 } from "../iso/math";
import { IsoBlob, IsoBox, IsoShadow } from "../iso/primitives";
import { ISLAND } from "../timeline";

const O = ISLAND.offer;
const at = (x: number, y: number, z: number) => v3(O.x + x, O.y + y, O.z + z);

const SLAB = { w: 700, d: 340, h: 120 };
const PLINTH_H = 84;
const CARD = { w: 600, d: 40, h: 700 };

// Secondes locales (la séquence démarre à T.offer = 9.3 s).
const DROP = [0.05, 0.3, 0.55];
const MERGE = 2.7;
const CARD_AT = 2.76;

const ICON_STROKE = 5;
const DocIcon: React.FC<{ c: string }> = ({ c }) => (
  <g fill="none" stroke={c} strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round">
    <rect x={-17} y={-23} width={34} height={46} rx={6} />
    <line x1={-8} y1={-9} x2={8} y2={-9} />
    <line x1={-8} y1={1} x2={8} y2={1} />
    <line x1={-8} y1={11} x2={3} y2={11} />
  </g>
);
const ClockIcon: React.FC<{ c: string }> = ({ c }) => (
  <g fill="none" stroke={c} strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round">
    <circle r={22} />
    <polyline points="0,-12 0,0 9,6" />
  </g>
);
const GlobeIcon: React.FC<{ c: string }> = ({ c }) => (
  <g fill="none" stroke={c} strokeWidth={ICON_STROKE} strokeLinecap="round">
    <circle r={22} />
    <ellipse rx={10} ry={22} />
    <line x1={-22} y1={0} x2={22} y2={0} />
  </g>
);

type Guarantee = { mat: Mat; ink: string; icon: React.FC<{ c: string }>; title: string; sub?: string };
const GUARANTEES: Guarantee[] = [
  { mat: MAT.navy, ink: C.white, icon: DocIcon, title: "Script inclus" },
  { mat: MAT.white, ink: C.navy, icon: ClockIcon, title: "Délai garanti" },
  { mat: MAT.coral, ink: C.white, icon: GlobeIcon, title: "100\u00A0% en ligne", sub: "sans appel" },
];

const Label: React.FC<{ g: Guarantee; opacity: number }> = ({ g, opacity }) => {
  const Icon = g.icon;
  return (
    <g opacity={opacity}>
      <g transform={`translate(78 ${SLAB.h / 2})`}>
        <Icon c={g.ink} />
      </g>
      <text
        x={130}
        y={g.sub ? 64 : 80}
        fontFamily={INTER}
        fontWeight={900}
        fontSize={g.sub ? 52 : 58}
        letterSpacing={-1.8}
        fill={g.ink}
      >
        {g.title}
      </text>
      {g.sub ? (
        <text x={132} y={102} fontFamily={INTER} fontWeight={700} fontSize={30} letterSpacing={-0.5} fill={g.ink} opacity={0.85}>
          {g.sub}
        </text>
      ) : null}
    </g>
  );
};

const mix = (a: Mat, b: Mat, k: number): Mat => ({
  top: interpolateColors(k, [0, 1], [a.top, b.top]),
  left: interpolateColors(k, [0, 1], [a.left, b.left]),
  right: interpolateColors(k, [0, 1], [a.right, b.right]),
  edge: b.edge,
});

// Milliers séparés par un vrai espace visuel (l'interlettrage serré mange les espaces fines).
const priceParts = (n: number) => {
  const v = Math.round(n);
  return v >= 1000 ? [String(Math.floor(v / 1000)), String(v % 1000).padStart(3, "0")] : [String(v)];
};

const Card: React.FC<{ t: number; fps: number; base: number }> = ({ t, fps, base }) => {
  const rise = settle(t, CARD_AT, fps, 0.45);
  const h = CARD.h * rise;
  const show = (s: number) => tween(t, s, s + 0.22, 0, 1, E.out);
  const slide = (s: number) => (1 - show(s)) * 26;
  const price = tween(t, CARD_AT + 0.2, CARD_AT + 1.05, 0, 1290, E.out);
  const face = (
    <g>
      <g opacity={show(CARD_AT + 0.06)} transform={`translate(0 ${slide(CARD_AT + 0.06)})`}>
        <rect x={44} y={46} width={298} height={60} rx={30} fill={C.coral} />
        <text x={193} y={87} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={29} letterSpacing={-0.3} fill={C.white}>
          La plus choisie
        </text>
      </g>
      <g opacity={show(CARD_AT + 0.1)} transform={`translate(0 ${slide(CARD_AT + 0.1)})`}>
        <text x={42} y={196} fontFamily={INTER} fontWeight={900} fontSize={66} letterSpacing={-2.6} fill={C.navy}>
          Offre Signature
        </text>
        <text x={44} y={250} fontFamily={INTER} fontWeight={600} fontSize={38} letterSpacing={-0.8} fill={C.grey}>
          Vidéo de 45 s
        </text>
      </g>
      <rect x={44} y={292} width={512 * show(CARD_AT + 0.14)} height={4} rx={2} fill="#EEF2F9" />
      <text
        x={38}
        y={446}
        fontFamily={INTER}
        fontWeight={900}
        fontSize={138}
        letterSpacing={-5}
        fill={C.navy}
        opacity={show(CARD_AT + 0.1)}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {priceParts(price).map((part, i) => (
          <tspan key={i} dx={i === 0 ? 0 : 26}>
            {part}
          </tspan>
        ))}
        <tspan dx={22}>€</tspan>
        <tspan dx={16} fontSize={44} letterSpacing={-1} fill={C.grey}>
          HT
        </tspan>
      </text>
      <g opacity={show(CARD_AT + 1.2)} transform={`translate(0 ${slide(CARD_AT + 1.2)})`}>
        <g transform="translate(70 540)">
          <ClockIcon c={C.coral} />
        </g>
        <text x={110} y={554} fontFamily={INTER} fontWeight={800} fontSize={38} letterSpacing={-1} fill={C.navy}>
          Livrée en 7 jours ouvrés
        </text>
      </g>
      <path
        d={`M0,${CARD.h - 70} C90,${CARD.h - 104} 190,${CARD.h - 36} 290,${CARD.h - 66} S470,${CARD.h - 104} ${CARD.w},${CARD.h - 74} L${CARD.w},${CARD.h} L0,${CARD.h} Z`}
        fill={C.pink}
      />
      <path
        d={`M0,${CARD.h - 40} C110,${CARD.h - 70} 210,${CARD.h - 12} 320,${CARD.h - 38} S480,${CARD.h - 66} ${CARD.w},${CARD.h - 44} L${CARD.w},${CARD.h} L0,${CARD.h} Z`}
        fill={C.coral}
        opacity={0.9}
      />
    </g>
  );
  if (h < 1) return null;
  return (
    <>
      <IsoShadow p={at(-CARD.w / 2, -CARD.d / 2, base)} s={v3(CARD.w, CARD.d, h)} ground={base} opacity={0.18} />
      <IsoBox
        p={at(-CARD.w / 2, -CARD.d / 2, base)}
        s={v3(CARD.w, CARD.d, h)}
        mat={{ top: "#FFFFFF", left: "#FFFFFF", right: "#DDE3EE" }}
        left={
          <g>
            {/* Le contenu monte avec la carte : il apparaît par le haut au fil de la sortie du socle. */}
            <clipPath id="cardFace">
              <rect x={0} y={0} width={CARD.w} height={h} />
            </clipPath>
            <g clipPath="url(#cardFace)">{face}</g>
          </g>
        }
      />
    </>
  );
};

export const OfferIsland: React.FC = () => {
  const t = useTime();
  const { fps } = useVideoConfig();
  const merge = tween(t, MERGE, MERGE + 0.22, 0, 1, E.inOut);
  const labelsOut = tween(t, MERGE - 0.06, MERGE + 0.06, 1, 0);
  // Virage de couleur bref : on évite les teintes intermédiaires ternes entre corail et bleu nuit.
  const tint = tween(t, MERGE, MERGE + 0.07, 0, 1);

  const slabs = GUARANTEES.map((g, i) => {
    const fall = tween(t, DROP[i], DROP[i] + 0.3, 1, 0, E.fall);
    const z0 = i * SLAB.h + fall * 420;
    const h = SLAB.h + (PLINTH_H / 3 - SLAB.h) * merge;
    const z = z0 + (i * (PLINTH_H / 3) - z0) * merge;
    const visible = t >= DROP[i] ? tween(t, DROP[i], DROP[i] + 0.06, 0, 1) : 0;
    return { g, z, h, visible, i };
  });

  return (
    <g>
      <IsoBlob c={at(40, 40, -330)} rx={560} ry={560} opacity={0.05} soft />
      <IsoBox p={at(-520, -440, -44)} s={v3(1040, 880, 44)} mat={MAT.slab} />
      {slabs.map((s) =>
        s.visible > 0 ? (
          <IsoShadow
            key={`s${s.i}`}
            p={at(-SLAB.w / 2, -SLAB.d / 2, s.z)}
            s={v3(SLAB.w, SLAB.d, s.h)}
            opacity={0.2 * s.visible}
          />
        ) : null,
      )}
      {slabs.map((s) =>
        s.visible > 0 ? (
          <IsoBox
            key={s.i}
            p={at(-SLAB.w / 2, -SLAB.d / 2, s.z)}
            s={v3(SLAB.w, SLAB.d, s.h)}
            mat={mix(s.g.mat, MAT.navy, tint)}
            opacity={s.visible}
            left={labelsOut > 0 ? <Label g={s.g} opacity={labelsOut} /> : null}
          />
        ) : null,
      )}
      {/* La carte sort toujours du sommet de la pile, même pendant qu'elle s'écrase. */}
      <Card t={t} fps={fps} base={Math.max(PLINTH_H, ...slabs.filter((s) => s.visible > 0).map((s) => s.z + s.h))} />
    </g>
  );
};
