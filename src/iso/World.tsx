import React, { createContext, useContext } from "react";
import { useVideoConfig } from "remotion";
import { lerp } from "../anim";
import { C } from "../brand";
import { project, V3, View } from "./math";

const ViewContext = createContext<View>({ yaw: 45, pitch: 35.26 });
export const useView = () => useContext(ViewContext);

export type Cam = View & {
  target: V3;
  zoom: number;
  // Position du point visé à l'écran, en fraction de la largeur / hauteur.
  ax: number;
  ay: number;
};

export type CamKey = Partial<Cam> & { t: number; ease?: (x: number) => number };

// Caméra par images clés : chaque clé hérite des valeurs de la précédente,
// le zoom est interpolé en logarithme pour des plongées régulières.
export const cameraAt = (t: number, keys: CamKey[]): Cam => {
  const full: (Cam & { t: number; ease?: (x: number) => number })[] = [];
  keys.forEach((k, i) => {
    const prev = i === 0 ? null : full[i - 1];
    full.push({
      t: k.t,
      ease: k.ease,
      target: k.target ?? prev?.target ?? { x: 0, y: 0, z: 0 },
      zoom: k.zoom ?? prev?.zoom ?? 1,
      yaw: k.yaw ?? prev?.yaw ?? 45,
      pitch: k.pitch ?? prev?.pitch ?? 35.26,
      ax: k.ax ?? prev?.ax ?? 0.5,
      ay: k.ay ?? prev?.ay ?? 0.5,
    });
  });
  if (t <= full[0].t) return full[0];
  const last = full[full.length - 1];
  if (t >= last.t) return last;
  const i = full.findIndex((k) => k.t > t);
  const a = full[i - 1];
  const b = full[i];
  const ease = b.ease ?? ((x: number) => x);
  const k = ease((t - a.t) / (b.t - a.t));
  return {
    target: {
      x: lerp(a.target.x, b.target.x, k),
      y: lerp(a.target.y, b.target.y, k),
      z: lerp(a.target.z, b.target.z, k),
    },
    zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), k)),
    yaw: lerp(a.yaw, b.yaw, k),
    pitch: lerp(a.pitch, b.pitch, k),
    ax: lerp(a.ax, b.ax, k),
    ay: lerp(a.ay, b.ay, k),
  };
};

export const World: React.FC<{ cam: Cam; children: React.ReactNode }> = ({
  cam,
  children,
}) => {
  const { width, height } = useVideoConfig();
  const view: View = { yaw: cam.yaw, pitch: cam.pitch };
  const p = project(cam.target, view);
  const transform = `translate(${width * cam.ax} ${height * cam.ay}) scale(${cam.zoom}) translate(${-p.x} ${-p.y})`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="softer" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        <linearGradient id="coralTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.coral2} />
          <stop offset="1" stopColor={C.coral} />
        </linearGradient>
        <linearGradient id="cylCoral" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF6A86" />
          <stop offset="0.55" stopColor={C.coral} />
          <stop offset="1" stopColor={C.coralShade} />
        </linearGradient>
        <linearGradient id="cylWhite" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F4F7FC" />
          <stop offset="1" stopColor="#D3DBE8" />
        </linearGradient>
        <linearGradient id="cylNavy" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1E2944" />
          <stop offset="1" stopColor="#0A1121" />
        </linearGradient>
      </defs>
      <ViewContext.Provider value={view}>
        <g transform={transform}>{children}</g>
      </ViewContext.Provider>
    </svg>
  );
};
