// Charte Motionova (issue de motionova.fr).
export const C = {
  coral: "#FF5C7A",
  coral2: "#FF7EA2",
  // Point du dégradé de marque utilisé pour les faces hautes corail.
  coralTop: "#FF779A",
  coralShade: "#E8496A",
  navy: "#0F172B",
  bg: "#F9FBFF",
  pink: "#FFF4F4",
  grey: "#5E6A7B",
  white: "#FFFFFF",
} as const;

// Un matériau = les 3 faces visibles d'un volume isométrique.
// Lumière venant du haut-gauche : dessus clair, face gauche moyenne, face droite sombre.
export type Mat = { top: string; left: string; right: string; edge?: string };

export const MAT = {
  slab: { top: "#FFFFFF", left: "#E9EEF7", right: "#D5DCE9" },
  white: { top: "#FFFFFF", left: "#EEF2F9", right: "#DCE3EF" },
  pink: { top: C.pink, left: "#FBE3E7", right: "#F2CFD6" },
  grey: { top: "#E7ECF4", left: "#D3DBE7", right: "#BDC7D7" },
  navy: {
    top: "#26324F",
    left: "#141E36",
    right: "#0A1121",
    edge: "rgba(255,255,255,0.18)",
  },
  coral: { top: C.coralTop, left: C.coral, right: C.coralShade },
} satisfies Record<string, Mat>;

export const LOGO_FULL = "motionova-logo-complet-fond-blanc.png";
export const LOGO_ICON = "motionova-icone-corail-fond-blanc.png";
