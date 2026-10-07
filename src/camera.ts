import { E } from "./anim";
import { cubeTopAt } from "./islands/PipelineIsland";
import { CamKey } from "./iso/World";
import { add, ISO_PITCH, v3 } from "./iso/math";
import { ISLAND, STATIONS_X, T, TOTAL } from "./timeline";

const H = ISLAND.hook;
const P = ISLAND.pipeline;

// Point de plongée : sur la face corail du Play, à côté du triangle blanc.
const DIVE = add(H, v3(-49.5, 49.5, 86));
const station = (i: number) => add(P, v3(STATIONS_X[i] + 20, -60, 70));
// Centre du monde visible au dézoom final (îlot accroche + chaîne de production).
const WORLD = v3(1290, 1290, 60);

// Plan de caméra unique pour tout le film (secondes absolues, calées sur la voix et la musique).
export const CAMERA: CamKey[] = [
  { t: 0, target: add(H, v3(0, 0, 40)), zoom: 1.2, yaw: 33, pitch: 56, ax: 0.5, ay: 0.63 },
  // « génial » : coup de zoom sec, puis on relâche.
  { t: T.genial - 0.02, zoom: 1.12, yaw: 39, pitch: 46, ease: E.inOut },
  { t: T.genial + 0.14, zoom: 1.3, ease: E.out },
  { t: T.hook2, zoom: 1.12, yaw: 42, pitch: 42, ease: E.inOut },
  // La pile déborde sur « comprenne » : la caméra recule.
  { t: T.comprenne + 0.3, target: add(H, v3(0, 0, 30)), zoom: 0.98, yaw: 45, pitch: ISO_PITCH, ease: E.out },
  { t: T.collapse },
  // Onde de choc sur « Motionova ».
  { t: T.collapse + 0.25, zoom: 1.13, ease: E.out },
  { t: T.playRise, zoom: 1.2, ease: E.inOut },
  { t: T.dive, target: add(H, v3(0, 0, 80)), zoom: 1.85, pitch: 42, ay: 0.6, ease: E.inOut },
  { t: T.coral + 0.06, target: DIVE, zoom: 70, pitch: 70, ay: 0.5, ease: E.dive },
  { t: T.pipeline - 0.1 },
  // Raccord corail : on ressort du dessus du cube projet, posé à la station Brief.
  { t: T.pipeline - 0.1, target: cubeTopAt(0), zoom: 70, yaw: 45, pitch: 70, ay: 0.5 },
  { t: T.pipeline },
  { t: T.brief + 0.08, target: station(0), zoom: 1.18, yaw: 50, pitch: 37, ay: 0.66, ease: E.emerge },
  { t: T.script - 0.26 },
  { t: T.script, target: station(1), ease: E.inOut },
  { t: T.animation - 0.28 },
  { t: T.animation, target: station(2), ease: E.inOut },
  { t: T.livraison - 0.32 },
  { t: T.livraison, target: station(3), ease: E.inOut },
  { t: T.noMeeting - 0.2, zoom: 1.26, ease: E.inOut },
  // « Sans une seule réunion » : on s'arrache en vue d'ensemble, en orbite.
  { t: T.noMeeting + 0.32, target: add(P, v3(0, -60, 60)), zoom: 0.56, yaw: 54, pitch: 40, ay: 0.64, ease: E.out },
  { t: T.world, zoom: 0.58, yaw: 60, ease: E.inOut },
  // Dézoom final sur tout le monde construit.
  { t: T.waves + 0.35, target: WORLD, zoom: 0.38, yaw: 45, pitch: ISO_PITCH, ay: 0.52, ease: E.inOut },
  { t: TOTAL, zoom: 0.34, ease: E.inOut },
];
