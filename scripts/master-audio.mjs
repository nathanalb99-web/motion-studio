// Mastering audio du rendu : -14 LUFS intégré, true peak -1 dBTP max.
// Utilise le ffmpeg fourni par Remotion (npx remotion ffmpeg) : rien à installer.
// L'image est recopiée telle quelle (aucun réencodage vidéo) ; les fichiers sources ne sont jamais modifiés.
//
// Usage : node scripts/master-audio.mjs out/rendu-brut.mp4 out/rendu-final.mp4
import { spawnSync } from "node:child_process";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage : node scripts/master-audio.mjs <entrée.mp4> <sortie.mp4>");
  process.exit(1);
}

const TARGET = { I: -14, LRA: 11, TP: -1 };
// Marge sous -1 dBTP pour absorber les crêtes ajoutées par l'encodage AAC.
const TP_ENCODE = -1.5;

const ffmpeg = (args) => {
  const res = spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", "-nostats", ...args], { encoding: "utf8" });
  if (res.status !== 0) {
    console.error(res.stderr);
    process.exit(res.status ?? 1);
  }
  return res.stderr;
};

const loudnormJson = (stderr) => {
  const start = stderr.lastIndexOf("{");
  const end = stderr.lastIndexOf("}");
  return JSON.parse(stderr.slice(start, end + 1));
};

const measure = (file) =>
  loudnormJson(ffmpeg(["-i", file, "-vn", "-af", `loudnorm=I=${TARGET.I}:TP=${TP_ENCODE}:LRA=${TARGET.LRA}:print_format=json`, "-f", "null", "-"]));

// Durée exacte de l'image : l'audio livré est recoupé dessus (loudnorm ajoute une courte traîne).
const probe = spawnSync(
  "npx",
  ["remotion", "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0", input],
  { encoding: "utf8" },
);
const videoDuration = parseFloat(probe.stdout);
if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
  console.error("Durée vidéo introuvable :", probe.stderr || probe.stdout);
  process.exit(1);
}

// Passe 1 : mesure.
const m = measure(input);
console.log(`Entrée : ${m.input_i} LUFS, true peak ${m.input_tp} dBTP, LRA ${m.input_lra} LU`);

// Passe 2 : normalisation avec les mesures de la passe 1, vidéo copiée.
ffmpeg([
  "-y",
  "-i",
  input,
  "-map",
  "0:v:0",
  "-map",
  "0:a:0",
  "-c:v",
  "copy",
  "-af",
  [
    `loudnorm=I=${TARGET.I}:TP=${TP_ENCODE}:LRA=${TARGET.LRA}`,
    `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}`,
    `measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=summary`,
  ].join(":") + `,atrim=end=${videoDuration}`,
  "-ar",
  "48000",
  "-c:a",
  "aac",
  "-b:a",
  "256k",
  "-movflags",
  "+faststart",
  output,
]);

// Passe 3 : contrôle sur le fichier livré.
const f = measure(output);
const okI = Math.abs(Number(f.input_i) - TARGET.I) <= 0.5;
const okTP = Number(f.input_tp) <= TARGET.TP;
console.log(`Sortie : ${f.input_i} LUFS, true peak ${f.input_tp} dBTP, LRA ${f.input_lra} LU (durée image ${videoDuration} s)`);
console.log(okI && okTP ? "Conforme : -14 LUFS (±0,5) et true peak ≤ -1 dBTP." : "NON CONFORME : vérifier le mix.");
process.exit(okI && okTP ? 0 : 2);
