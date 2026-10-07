import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Inter (variable 500–900, sous-ensemble latin) servie depuis public/fonts :
// aucun appel réseau au rendu, donc un résultat identique à chaque export.
// Licence : public/fonts/Inter-OFL.txt
export const INTER = "Inter";

const waitForFont = delayRender("Chargement de la police Inter");
const font = new FontFace(INTER, `url('${staticFile("fonts/inter-latin-var.woff2")}') format('woff2')`, {
  weight: "500 900",
  style: "normal",
  display: "block",
});

font
  .load()
  .then(() => {
    document.fonts.add(font);
    continueRender(waitForFont);
  })
  .catch((err) => cancelRender(err));
