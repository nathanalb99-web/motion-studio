import React from "react";
import { useTime } from "../anim";
import { C, MAT } from "../brand";
import { v3 } from "../iso/math";
import { IsoBox } from "../iso/primitives";

const WIDTH = 84;
const THICK = 18;
const DASH = 46;
const GAP = 34;

type Pt = [number, number];

// Passerelle en volume qui relie deux îlots, avec un marquage corail qui défile
// dans le sens du parcours client (segments alignés sur les axes, du fond vers l'avant).
export const Bridge: React.FC<{ path: Pt[]; dashOpacity?: number }> = ({ path, dashOpacity = 1 }) => {
  const t = useTime();
  const period = DASH + GAP;
  const flow = (t * 140) % period;
  return (
    <g>
      {path.slice(1).map(([x2, y2], i) => {
        const [x1, y1] = path[i];
        const alongX = Math.abs(x2 - x1) > Math.abs(y2 - y1);
        // Chaque segment déborde d'une demi-largeur pour fermer proprement les angles.
        const len = (alongX ? Math.abs(x2 - x1) : Math.abs(y2 - y1)) + WIDTH;
        const x0 = alongX ? Math.min(x1, x2) - WIDTH / 2 : x1 - WIDTH / 2;
        const y0 = alongX ? y1 - WIDTH / 2 : Math.min(y1, y2) - WIDTH / 2;
        const dashes: React.ReactNode[] = [];
        for (let s = flow - period; s < len; s += period) {
          const a = Math.max(0, s);
          const b = Math.min(len, s + DASH);
          if (b <= a) continue;
          dashes.push(
            alongX ? (
              <rect key={s} x={a} y={WIDTH / 2 - 5} width={b - a} height={10} rx={5} fill={C.coral} />
            ) : (
              <rect key={s} x={WIDTH / 2 - 5} y={a} width={10} height={b - a} rx={5} fill={C.coral} />
            ),
          );
        }
        return (
          <IsoBox
            key={i}
            p={v3(x0, y0, -THICK)}
            s={alongX ? v3(len, WIDTH, THICK) : v3(WIDTH, len, THICK)}
            mat={MAT.pink}
            top={<g opacity={dashOpacity}>{dashes}</g>}
          />
        );
      })}
    </g>
  );
};

// Tracés entre les îlots (coordonnées monde, cf. ISLAND dans timeline.ts).
export const PATH_HOOK_PIPELINE: Pt[] = [
  [220, 430],
  [220, 1180],
  [1360, 1180],
  [1360, 1940],
];

export const PATH_PIPELINE_OFFER: Pt[] = [
  [3300, 2580],
  [3300, 3320],
  [4120, 3320],
  [4120, 4040],
];
