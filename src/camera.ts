import { E } from "./anim";
import { cubeTopAt } from "./islands/PipelineIsland";
import { CamKey } from "./iso/World";
import { add, ISO_PITCH, v3 } from "./iso/math";
import { ISLAND, STATIONS_X, T } from "./timeline";

const H = ISLAND.hook;
const P = ISLAND.pipeline;
const O = ISLAND.offer;

// Point de plongée : sur la face corail du Play, à côté du triangle blanc.
const DIVE = add(H, v3(-49.5, 49.5, 86));
const station = (i: number) => add(P, v3(STATIONS_X[i] + 20, -60, 70));

// Plan de caméra unique pour tout le film (secondes absolues).
export const CAMERA: CamKey[] = [
  { t: 0, target: add(H, v3(0, 0, 40)), zoom: 1.32, yaw: 33, pitch: 58, ax: 0.5, ay: 0.63 },
  { t: T.hook2, zoom: 1.13, yaw: 41, pitch: 42, ease: E.out },
  { t: T.collapse, target: add(H, v3(0, 0, 30)), zoom: 1.0, yaw: 45, pitch: ISO_PITCH, ease: E.inOut },
  { t: 3.25, zoom: 1.06, ease: E.out },
  { t: 3.95, target: add(H, v3(0, 0, 80)), zoom: 1.9, pitch: 42, ay: 0.6, ease: E.inOut },
  { t: T.pipeline, target: DIVE, zoom: 70, pitch: 70, ay: 0.5, ease: E.dive },
  // Raccord corail : on ressort du dessus du cube projet.
  { t: T.pipeline, target: cubeTopAt(0), zoom: 70, yaw: 45, pitch: 70, ay: 0.5 },
  { t: 5.25, target: station(0), zoom: 1.18, yaw: 50, pitch: 37, ay: 0.66, ease: E.emerge },
  { t: 5.3, ease: E.inOut },
  { t: 5.7, target: station(1), ease: E.inOut },
  { t: 6.1, ease: E.inOut },
  { t: 6.5, target: station(2), ease: E.inOut },
  { t: 7.0, ease: E.inOut },
  { t: 7.4, target: station(3), ease: E.inOut },
  { t: 7.95, zoom: 1.26, ease: E.inOut },
  { t: 8.6, target: add(P, v3(0, -40, 60)), zoom: 0.49, yaw: 57, pitch: 40, ay: 0.64, ease: E.inOut },
  { t: 9.3, zoom: 0.52, ease: E.inOut },
  { t: 9.85, target: add(O, v3(0, 0, 190)), zoom: 1.08, yaw: 30, pitch: 33, ay: 0.66, ease: E.inOut },
  { t: 11.95, zoom: 1.14, yaw: 27, ease: E.inOut },
  { t: 12.75, target: add(O, v3(0, 0, 434)), zoom: 1.3, yaw: 19, pitch: 30, ay: 0.53, ease: E.inOut },
  { t: T.outro, zoom: 1.36, yaw: 15, ease: E.inOut },
  { t: 15.7, target: v3(1950, 1950, 160), zoom: 0.3, yaw: 45, pitch: ISO_PITCH, ay: 0.5, ease: E.inOut },
  { t: 18, zoom: 0.28, ease: E.inOut },
];
