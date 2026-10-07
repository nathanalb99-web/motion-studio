import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Toutes les durées du projet sont exprimées en secondes :
// la même timeline sort à 30 fps (brouillon) comme à 60 fps (master).
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const E = {
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.5, 0, 0.75, 0),
  fall: Easing.in(Easing.quad),
  dive: Easing.bezier(0.7, 0, 0.84, 0),
  emerge: Easing.bezier(0.16, 1, 0.3, 1),
};

export const tween = (
  t: number,
  t0: number,
  t1: number,
  from: number,
  to: number,
  easing: (x: number) => number = E.inOut,
) =>
  interpolate(t, [t0, t1], [from, to], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Ressort très amorti, sans dépassement (jamais de rebond cartoon),
// étiré sur une durée fixe en secondes pour garder un rythme nerveux.
export const settle = (t: number, t0: number, fps: number, duration = 0.5) =>
  spring({
    frame: (t - t0) * fps,
    fps,
    config: { damping: 200, overshootClamping: true },
    durationInFrames: Math.max(1, Math.round(duration * fps)),
  });

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
