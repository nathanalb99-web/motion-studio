import React from "react";
import { useVideoConfig } from "remotion";

// Vague pleine (signature motionova.fr) : ligne sinusoïdale douce + remplissage vers le bas.
export const wavePath = (width: number, height: number, baseY: number, amp: number, length: number, phase: number) => {
  const step = 24;
  let d = `M0,${height + 10} L0,${baseY}`;
  for (let x = 0; x <= width + step; x += step) {
    const y = baseY + amp * Math.sin((x / length) * Math.PI * 2 + phase) + amp * 0.35 * Math.sin((x / length) * Math.PI * 4.3 + phase * 1.7);
    d += ` L${x},${y.toFixed(2)}`;
  }
  return `${d} L${width + step},${height + 10} Z`;
};

export type WaveLayer = { baseY: number; amp: number; length: number; phase: number; fill: string; opacity?: number };

export const Waves: React.FC<{ layers: WaveLayer[]; defs?: React.ReactNode }> = ({ layers, defs }) => {
  const { width, height } = useVideoConfig();
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {defs ? <defs>{defs}</defs> : null}
      {layers.map((l, i) => (
        <path key={i} d={wavePath(width, height, l.baseY, l.amp, l.length, l.phase)} fill={l.fill} opacity={l.opacity ?? 1} />
      ))}
    </svg>
  );
};
