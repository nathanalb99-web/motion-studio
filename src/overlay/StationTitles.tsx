import React from "react";
import { C } from "../brand";
import { KineticText } from "./KineticText";
import { useTime } from "../anim";

// Étapes de la chaîne, en secondes locales (la séquence démarre à STATIONS_AT).
export const STATIONS_AT = 4.74;
export const STEPS = [
  { at: 0, n: "01", title: "Brief", sub: "10 min en ligne" },
  { at: 0.71, n: "02", title: "Script", sub: "Validé par vous" },
  { at: 1.46, n: "03", title: "Animation", sub: "Voix off + sound design" },
  { at: 2.21, n: "04", title: "Livraison", sub: "Tous les formats" },
];

export const StationTitles: React.FC<{ end: number; top: number; titleSize: number }> = ({ end, top, titleSize }) => {
  const t = useTime();
  return (
    <>
      {STEPS.map((s, i) => {
        const next = i < STEPS.length - 1 ? STEPS[i + 1].at : end;
        if (t < s.at - 0.05 || t > next + 0.05) return null;
        const out = next - 0.2;
        return (
          <div
            key={s.n}
            style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          >
            <KineticText lines={[[{ text: `ÉTAPE ${s.n}` }]]} size={34} weight={800} tracking={0.12} color={C.coral} inAt={s.at} outAt={out} dur={0.3} />
            <KineticText lines={[[{ text: s.title }]]} size={titleSize} inAt={s.at + 0.03} outAt={out} dur={0.32} />
            <KineticText lines={[[{ text: s.sub }]]} size={46} weight={600} tracking={-0.02} color={C.grey} inAt={s.at + 0.07} outAt={out} dur={0.3} stagger={0.02} />
          </div>
        );
      })}
    </>
  );
};
