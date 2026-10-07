import { interpolate } from "remotion";
import { SPEECH, TOTAL, VOICE_END } from "./timeline";

// Mixage piloté image par image (aucune modification des fichiers sources).
// Repères de niveau mesurés : voix -22,5 LUFS, musique -9,6 LUFS.
// Le niveau final (-14 LUFS / -1 dBTP) est appliqué au master par scripts/master-audio.mjs.
export const VOICE_GAIN = 1;

const MUSIC = {
  under: 0.03, // sous la voix : musique ~17 dB sous la voix
  gap: 0.1, // dans les silences : la musique remonte (~7 dB sous la voix)
  logo: 0.13, // fin sur le logo
  attack: 0.12, // la musique descend un peu avant que la voix parle
  release: 0.3, // et remonte doucement après
  fadeIn: 0.15,
  fadeOut: 1.0,
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 1 = voix présente (musique baissée), 0 = silence.
const duck = (t: number) =>
  SPEECH.reduce(
    (acc, [s, e]) =>
      Math.max(acc, interpolate(t, [s - MUSIC.attack, s, e, e + MUSIC.release], [0, 1, 1, 0], clamp)),
    0,
  );

export const musicVolume = (t: number) => {
  const bed = interpolate(duck(t), [0, 1], [MUSIC.gap, MUSIC.under]);
  const outro = interpolate(t, [VOICE_END, VOICE_END + MUSIC.release], [0, 1], clamp);
  const level = bed + (MUSIC.logo - bed) * outro;
  const fadeIn = interpolate(t, [0, MUSIC.fadeIn], [0, 1], clamp);
  const fadeOut = interpolate(t, [TOTAL - MUSIC.fadeOut, TOTAL - 1 / 60], [1, 0], clamp);
  return level * fadeIn * fadeOut;
};
