// Source unique des timings (secondes absolues), calée sur la voix off (public/voixoff.mp3)
// et sur la grille de la musique (public/musique.mp3, 95 BPM, départ à 0 s).

// Durée de la voix (13,09 s) + 1 s de fin sur le logo.
export const TOTAL = 14.1;

// Mots de la voix off, mesurés sur la forme d'onde (enveloppe 5 ms, seuil -45 dBFS).
export type Word = { w: string; s: number; e: number };
export const WORDS: Word[] = [
  { w: "Votre", s: 0.02, e: 0.47 },
  { w: "produit", s: 0.47, e: 0.86 },
  { w: "est", s: 0.86, e: 1.1 },
  { w: "génial.", s: 1.1, e: 1.58 },
  { w: "Encore", s: 2.0, e: 2.42 },
  { w: "faut-il", s: 2.42, e: 2.62 },
  { w: "qu'on", s: 2.62, e: 2.79 },
  { w: "le", s: 2.79, e: 2.94 },
  { w: "comprenne.", s: 2.94, e: 3.3 },
  { w: "Motionova", s: 3.81, e: 4.42 },
  { w: "transforme", s: 4.42, e: 5.01 },
  { w: "votre", s: 5.01, e: 5.3 },
  { w: "logiciel", s: 5.3, e: 5.78 },
  { w: "en", s: 5.78, e: 5.95 },
  { w: "vidéo", s: 5.95, e: 6.34 },
  { w: "claire.", s: 6.34, e: 6.68 },
  { w: "Brief,", s: 6.95, e: 7.43 },
  { w: "script,", s: 7.58, e: 8.09 },
  { w: "animation,", s: 8.25, e: 8.89 },
  { w: "livraison.", s: 9.0, e: 9.56 },
  { w: "Sans", s: 9.73, e: 9.9 },
  { w: "une", s: 9.9, e: 10.12 },
  { w: "seule", s: 10.12, e: 10.31 },
  { w: "réunion.", s: 10.31, e: 11.01 },
  { w: "Rendez", s: 11.27, e: 11.76 },
  { w: "votre", s: 11.76, e: 11.94 },
  { w: "produit", s: 11.94, e: 12.32 },
  { w: "évident.", s: 12.46, e: 12.89 },
];

// Blocs de parole continus (sert au ducking de la musique).
export const SPEECH: [number, number][] = [
  [0.02, 1.58],
  [2.0, 3.3],
  [3.81, 6.68],
  [6.95, 7.43],
  [7.58, 8.09],
  [8.25, 8.89],
  [9.0, 9.56],
  [9.73, 11.01],
  [11.27, 12.32],
  [12.46, 12.89],
];
export const VOICE_END = 12.89;

const at = (w: string, from = 0) => WORDS.find((x, i) => i >= from && x.w === w)!.s;

// Temps forts de la musique (mesurés) : 1er temps = grosse caisse, 2 et 4 = caisse claire.
export const BEAT = {
  build: 2.49, // début de la montée
  drop: 5.02, // drop : le groove complet démarre
  snare: [4.38, 5.64, 6.91, 8.16, 9.43, 10.69, 11.96, 13.22],
  downbeat: [2.49, 5.02, 7.55, 10.08, 12.6],
};

export const T = {
  hook: 0,
  genial: at("génial."), // mot-clé : punch caméra + slam typo
  hook2: at("Encore"),
  comprenne: at("comprenne."), // la pile déborde
  collapse: at("Motionova"), // onde de choc corail
  playRise: BEAT.drop, // le Play surgit sur le drop
  dive: 5.6, // plongée dans le Play
  coral: 5.88, // plein cadre corail
  video: at("vidéo"), // « vidéo claire. » sur le corail
  pipeline: 6.7, // on ressort du cube projet
  brief: at("Brief,"),
  script: at("script,"),
  animation: at("animation,"),
  livraison: at("livraison."),
  noMeeting: at("Sans"), // mot-clé : slam + départ du second projet
  reunion: at("réunion."),
  world: 10.3, // dézoom sur le monde entier
  waves: 10.75, // bascule corail en vagues
  rendez: at("Rendez"),
  evident: at("évident."), // mot-clé : punch final
  voiceEnd: VOICE_END,
} as const;

// Positions des îlots dans le monde isométrique continu.
export const ISLAND = {
  hook: { x: 0, y: 0, z: 0 },
  pipeline: { x: 2300, y: 2300, z: 0 },
  offer: { x: 4450, y: 4450, z: 0 },
} as const;

export const STATIONS_X = [-780, -260, 260, 780];
export const BELT = { y0: 60, y1: 200, h: 46 };
export const CUBE = 120;
