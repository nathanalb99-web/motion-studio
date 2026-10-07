import React from "react";
import { C } from "../brand";
import { KineticText } from "./KineticText";
import { useTime } from "../anim";
import { T } from "../timeline";

// Étapes de la chaîne : chaque titre tombe sur le mot prononcé (secondes locales, 0 = « Brief »).
export const STATIONS_AT = T.brief;
export const STEPS = [
  { at: 0, n: "01", title: "Brief" },
  { at: T.script - T.brief, n: "02", title: "Script" },
  { at: T.animation - T.brief, n: "03", title: "Animation" },
  { at: T.livraison - T.brief, n: "04", title: "Livraison" },
];

export const StationTitles: React.FC<{ end: number; top: number; titleSize: number; offset?: number }> = ({
  end,
  top,
  titleSize,
  offset = 0,
}) => {
  // offset : la séquence peut démarrer un peu avant « Brief ».
  const t = useTime() - offset;
  return (
    <>
      {STEPS.map((s, i) => {
        const next = i < STEPS.length - 1 ? STEPS[i + 1].at : end;
        if (t < s.at - 0.05 || t > next + 0.05) return null;
        const out = next - 0.14;
        return (
          <div
            key={s.n}
            style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          >
            <KineticText lines={[[{ text: `ÉTAPE ${s.n}` }]]} size={34} weight={800} tracking={0.12} color={C.coral} inAt={s.at - 0.1} outAt={out} dur={0.24} />
            <KineticText lines={[[{ text: s.title }]]} size={titleSize} inAt={s.at - 0.06} outAt={out} dur={0.26} />
          </div>
        );
      })}
    </>
  );
};
