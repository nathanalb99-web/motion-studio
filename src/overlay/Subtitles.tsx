import React from "react";
import { useVideoConfig } from "remotion";
import { E, tween, useTime } from "../anim";
import { C } from "../brand";
import { INTER } from "../fonts";
import { WORDS } from "../timeline";

// Découpage des sous-titres en répliques courtes (indices dans WORDS), 2 lignes maximum.
const CHUNKS: [number, number][] = [
  [0, 3],
  [4, 8],
  [9, 12],
  [13, 15],
  [16, 19],
  [20, 23],
  [24, 27],
];

// Sous-titres incrustés : pastille claire et texte bleu nuit sur les décors clairs,
// pastille bleu nuit et texte blanc sur les fonds corail. Mot en cours en corail.
export const Subtitles: React.FC<{ dark: (t: number) => boolean; bottom: number }> = ({ dark, bottom }) => {
  const t = useTime();
  const { width } = useVideoConfig();
  const idx = CHUNKS.findIndex(([a, b], i) => {
    const next = CHUNKS[i + 1];
    const from = WORDS[a].s - 0.06;
    const to = Math.min(WORDS[b].e + 0.3, next ? WORDS[next[0]].s - 0.06 : Infinity);
    return t >= from && t < to;
  });
  if (idx < 0) return null;
  const [a, b] = CHUNKS[idx];
  const next = CHUNKS[idx + 1];
  const from = WORDS[a].s - 0.06;
  const to = Math.min(WORDS[b].e + 0.3, next ? WORDS[next[0]].s - 0.06 : Infinity);
  const k = tween(t, from, from + 0.12, 0, 1, E.out) * tween(t, to - 0.1, to, 1, 0);
  const isDark = dark(t);
  const words = WORDS.slice(a, b + 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        opacity: k,
        transform: `translateY(${(1 - k) * 18}px) scale(${0.94 + 0.06 * k})`,
      }}
    >
      <div
        style={{
          maxWidth: width - 140,
          padding: "16px 30px 18px",
          borderRadius: 30,
          background: isDark ? "rgba(15,23,43,0.92)" : "rgba(255,255,255,0.94)",
          boxShadow: "0 14px 34px rgba(15,23,43,0.18)",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.18,
          letterSpacing: "-0.02em",
          textAlign: "center",
          color: isDark ? C.white : C.navy,
        }}
      >
        {words.map((w, i) => {
          const end = i < words.length - 1 ? words[i + 1].s : w.e + 0.2;
          const current = t >= w.s && t < end;
          return (
            <React.Fragment key={i}>
              {i > 0 ? " " : null}
              <span style={{ color: current ? C.coral : undefined }}>{w.w}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
