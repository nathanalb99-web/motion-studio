import React from "react";
import { useVideoConfig } from "remotion";
import { E, settle, tween, useTime } from "../anim";
import { C } from "../brand";
import { INTER } from "../fonts";

export type Seg = { text: string; color?: string; wave?: boolean };

// Soulignement en vague (signature du hero motionova.fr), tracé au fil de l'eau.
const WaveUnderline: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg
    viewBox="0 0 500 30"
    preserveAspectRatio="none"
    style={{ position: "absolute", left: 0, right: 0, bottom: "-0.2em", width: "100%", height: "0.24em", overflow: "visible" }}
  >
    <path
      d="M6,18 C56,4 106,4 156,15 S256,28 306,15 S406,3 494,13"
      fill="none"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - k}
    />
  </svg>
);

// Typographie qui claque : chaque mot sort d'un masque, puis repart vers le haut.
export const KineticText: React.FC<{
  lines: Seg[][];
  size: number;
  color?: string;
  weight?: number;
  inAt?: number;
  outAt?: number;
  stagger?: number;
  // Durée d'entrée de chaque mot, en secondes.
  dur?: number;
  tracking?: number;
  lineHeight?: number;
  align?: "center" | "left";
}> = ({
  lines,
  size,
  color = C.navy,
  weight = 900,
  inAt = 0,
  outAt,
  stagger = 0.055,
  dur = 0.42,
  tracking = -0.045,
  lineHeight = 1.02,
  align = "center",
}) => {
  const t = useTime();
  const { fps } = useVideoConfig();
  let index = 0;
  return (
    <div
      style={{
        fontFamily: INTER,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: `${tracking}em`,
        lineHeight,
        color,
        textAlign: align,
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((seg, si) => {
            const words = seg.text.split(" ");
            const first = index;
            const nodes = words.map((word, wi) => {
              const i = index++;
              const p = settle(t, inAt + i * stagger, fps, dur);
              const q = outAt === undefined ? 0 : tween(t, outAt + i * 0.02, outAt + 0.2 + i * 0.02, 0, 1, E.in);
              const y = (1 - p) * 135 - q * 135;
              return (
                <React.Fragment key={wi}>
                  {wi > 0 ? " " : null}
                  <span
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      verticalAlign: "top",
                      padding: "0.16em 0.06em 0.2em",
                      margin: "-0.16em -0.06em -0.2em",
                    }}
                  >
                    <span style={{ display: "inline-block", transform: `translateY(${y}%)`, color: seg.color }}>{word}</span>
                  </span>
                </React.Fragment>
              );
            });
            const waveK =
              tween(t, inAt + first * stagger + 0.25, inAt + first * stagger + 0.75, 0, 1, E.out) *
              (outAt === undefined ? 1 : tween(t, outAt, outAt + 0.15, 1, 0));
            return (
              <React.Fragment key={si}>
                {si > 0 ? " " : null}
                {seg.wave ? (
                  <span style={{ position: "relative", display: "inline-block" }}>
                    {nodes}
                    <WaveUnderline k={waveK} color={seg.color ?? C.coral} />
                  </span>
                ) : (
                  nodes
                )}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
