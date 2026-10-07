import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { E, settle, tween, useTime } from "../anim";
import { C, LOGO_FULL } from "../brand";
import { INTER } from "../fonts";
import { BEAT, T, WORDS } from "../timeline";
import { KineticText } from "./KineticText";
import { Waves } from "./Waves";

// Phrase de fin, telle que prononcée par la voix off.
export const END_LINE = [
  [{ text: "Rendez votre" }],
  [{ text: "produit" }, { text: "évident.", color: C.navy, wave: true, punch: true }],
];

// Secondes locales : la séquence démarre avec la bascule corail (T.waves).
const L = (abs: number) => abs - T.waves;
const WAVES_AT = 0;
// Chaque mot de la phrase de fin apparaît quand la voix le prononce.
const LINE_TIMES = ["Rendez", "votre", "produit", "évident."].map((w) => L(WORDS.find((x) => x.s >= T.rendez - 0.01 && x.w === w)!.s) - 0.06);
const EVIDENT_AT = L(T.evident);
const LOGO_AT = L(T.voiceEnd) - 0.2;
const CTA_AT = L(T.voiceEnd) - 0.04;
const URL_AT = L(T.voiceEnd) + 0.1;
// Clic sur le bouton calé sur la caisse claire de 13,22 s.
const CLICK_AT = L(BEAT.snare[7]);

const Cursor: React.FC = () => (
  <svg width={64} height={78} viewBox="0 0 64 78">
    <path d="M6,4 L6,62 L20,49 L30,72 L41,67 L31,45 L50,45 Z" fill={C.white} stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

export const Outro: React.FC<{ hasLogos: boolean; top: number }> = ({ hasLogos, top }) => {
  const t = useTime();
  const { fps, height } = useVideoConfig();

  const rise = (i: number) => tween(t, WAVES_AT + i * 0.08, WAVES_AT + 0.55 + i * 0.08, height + 160, -220, E.inOut);
  // Sur « évident » : une vague blanche balaie l'écran de bas en haut.
  const burst = tween(t, EVIDENT_AT - 0.04, EVIDENT_AT + 0.42, height + 200, -260, E.out);
  const burstOpacity = tween(t, EVIDENT_AT + 0.1, EVIDENT_AT + 0.5, 0.28, 0);
  const drift = t * 1.6;

  const logo = settle(t, LOGO_AT, fps, 0.5);
  const cta = settle(t, CTA_AT, fps, 0.5);
  const url = settle(t, URL_AT, fps, 0.5);
  const press = tween(t, CLICK_AT, CLICK_AT + 0.08, 0, 1, E.in) - tween(t, CLICK_AT + 0.12, CLICK_AT + 0.3, 0, 1, E.out);
  const cursorIn = tween(t, CLICK_AT - 0.45, CLICK_AT - 0.02, 0, 1, E.out);
  const cursorOut = tween(t, CLICK_AT + 0.35, CLICK_AT + 0.6, 0, 1, E.in);

  return (
    <AbsoluteFill>
      <Waves
        defs={
          <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor={C.coral} />
            <stop offset="1" stopColor={C.coral2} />
          </linearGradient>
        }
        layers={[
          { baseY: rise(0), amp: 34, length: 760, phase: drift, fill: C.coral2 },
          { baseY: rise(1), amp: 30, length: 640, phase: drift + 2, fill: "#FF6B8C" },
          { baseY: rise(2), amp: 26, length: 900, phase: drift + 4, fill: "url(#brandFill)" },
        ]}
      />
      {t > EVIDENT_AT - 0.05 && burstOpacity > 0 ? (
        <Waves layers={[{ baseY: burst, amp: 40, length: 700, phase: drift * 2, fill: C.white, opacity: burstOpacity }]} />
      ) : null}
      {t > WAVES_AT + 0.8 ? (
        <Waves
          layers={[
            { baseY: height - 250, amp: 22, length: 820, phase: drift * 1.3, fill: C.white, opacity: 0.1 * tween(t, 1.3, 1.8, 0, 1) },
            { baseY: height - 170, amp: 18, length: 620, phase: drift * 1.3 + 2.4, fill: C.white, opacity: 0.12 * tween(t, 1.4, 1.9, 0, 1) },
          ]}
        />
      ) : null}

      <div style={{ position: "absolute", top, left: 60, right: 60 }}>
        <KineticText lines={END_LINE} size={112} color={C.white} times={LINE_TIMES} dur={0.36} />
      </div>

      <div
        style={{
          position: "absolute",
          top: top + 400,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: logo,
          transform: `translateY(${(1 - logo) * 70}px)`,
        }}
      >
        <div style={{ position: "relative", width: 660, height: 210 }}>
          <div style={{ position: "absolute", inset: 0, top: 16, borderRadius: 40, background: "#E9B9C4", boxShadow: "0 30px 60px rgba(15,23,43,0.22)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 40,
              background: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {hasLogos ? (
              <Img src={staticFile(LOGO_FULL)} style={{ maxWidth: 540, maxHeight: 150, objectFit: "contain" }} />
            ) : (
              <div
                style={{
                  width: 560,
                  height: 140,
                  border: `4px dashed ${C.grey}`,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: INTER,
                  fontWeight: 700,
                  fontSize: 30,
                  color: C.grey,
                }}
              >
                Logo à déposer dans public/
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: top + 690,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: cta,
          transform: `translateY(${(1 - cta) * 70}px)`,
        }}
      >
        <div style={{ position: "relative", width: 680, height: 140 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 128, borderRadius: 64, background: "#050913" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 10 * press,
              height: 128,
              borderRadius: 64,
              background: C.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: "-0.03em",
              color: C.white,
            }}
          >
            Commander ma vidéo
            <svg width={40} height={40} viewBox="0 0 40 40">
              <path d="M8,20 L30,20 M21,10 L31,20 L21,30" fill="none" stroke={C.coral2} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              left: 560 + (1 - cursorIn) * 200,
              top: 62 + (1 - cursorIn) * 260 + press * 8,
              opacity: cursorIn * (1 - cursorOut),
              transform: `scale(${1 - press * 0.12})`,
            }}
          >
            <Cursor />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: top + 890,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 56,
          letterSpacing: "-0.03em",
          color: C.white,
          opacity: url,
          transform: `translateY(${(1 - url) * 50}px)`,
        }}
      >
        motionova.fr
      </div>
    </AbsoluteFill>
  );
};
