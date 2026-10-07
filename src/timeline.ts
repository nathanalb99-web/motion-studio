// Source unique des timings (secondes absolues), calée sur le script de voix off.
export const TOTAL = 18;

export const T = {
  hook: 0, // « Votre produit est génial. »
  hook2: 1.3, // « Encore faut-il qu'on le comprenne. »
  collapse: 2.7, // les blocs s'effondrent, le Play surgit
  dive: 3.95, // plongée dans le Play
  coral: 4.3, // plein cadre corail : « 4 étapes. »
  pipeline: 4.75, // chaîne de production
  noMeeting: 8.0, // « Sans une seule réunion. »
  offer: 9.3, // « Tout compris. » + garanties
  card: 12.0, // carte Offre Signature
  outro: 14.8, // dézoom final, vagues, CTA
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
