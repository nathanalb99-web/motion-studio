// Réglages par format. Les scènes sont identiques : seuls le cadrage et la typo changent.
// Les formats 16:9 et 1:1 viendront s'ajouter ici sans toucher aux scènes.
export type LayoutId = "916";

export type Layout = {
  width: number;
  height: number;
  // Multiplicateur appliqué à tous les zooms caméra.
  zoom: number;
  // Haut du bloc de texte (zone sûre TikTok / Reels).
  textTop: number;
  hero: number;
  title: number;
  // Bas de la pastille de sous-titres (au-dessus de l'interface TikTok / Reels).
  subtitleBottom: number;
};

export const LAYOUTS: Record<LayoutId, Layout> = {
  "916": { width: 1080, height: 1920, zoom: 1, textTop: 360, hero: 104, title: 164, subtitleBottom: 1570 },
};
