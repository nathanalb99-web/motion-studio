import React from "react";
import { AbsoluteFill, Sequence, Series, useVideoConfig } from "remotion";
import { tween, useTime } from "./anim";
import { C } from "./brand";
import { CAMERA } from "./camera";
import { HookIsland } from "./islands/HookIsland";
import { OfferIsland } from "./islands/OfferIsland";
import { PipelineIsland } from "./islands/PipelineIsland";
import { cameraAt, World } from "./iso/World";
import { LAYOUTS, LayoutId } from "./layouts";
import { KineticText } from "./overlay/KineticText";
import { Outro } from "./overlay/Outro";
import { StationTitles } from "./overlay/StationTitles";
import { Waves } from "./overlay/Waves";
import { T, TOTAL } from "./timeline";

export type MotionovaProps = {
  layout: LayoutId;
  fps: number;
  hasLogos: boolean;
};

const Backdrop: React.FC = () => {
  const t = useTime();
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg} 45%, ${C.pink} 100%)` }}>
      <Waves
        layers={[
          { baseY: height - 300, amp: 26, length: 900, phase: t * 0.9, fill: "#FFE6EB", opacity: 0.55 },
          { baseY: height - 190, amp: 20, length: 700, phase: t * 0.9 + 2.2, fill: "#FFDCE3", opacity: 0.45 },
        ]}
      />
    </AbsoluteFill>
  );
};

const TextTrack: React.FC<{ top: number; hero: number; title: number }> = ({ top, hero, title }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const block = (children: React.ReactNode) => (
    <div style={{ position: "absolute", top, left: 70, right: 70 }}>{children}</div>
  );
  return (
    <Series>
      <Series.Sequence offset={f(0.1)} durationInFrames={f(T.hook2 - 0.1)}>
        {block(<KineticText size={hero} outAt={T.hook2 - 0.1 - 0.2} lines={[[{ text: "Votre produit" }], [{ text: "est génial." }]]} />)}
      </Series.Sequence>
      <Series.Sequence durationInFrames={f(T.collapse - T.hook2)}>
        {block(
          <KineticText
            size={hero}
            outAt={T.collapse - T.hook2 - 0.22}
            lines={[[{ text: "Encore faut-il" }], [{ text: "qu'on le" }, { text: "comprenne.", color: C.coral, wave: true }]]}
          />,
        )}
      </Series.Sequence>
      <Series.Sequence offset={f(4.72 - T.collapse)} durationInFrames={f(T.noMeeting - 4.72)}>
        <StationTitles end={T.noMeeting - 4.72} top={top - 20} titleSize={title} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={f(T.offer - T.noMeeting)}>
        {block(
          <KineticText
            size={hero}
            outAt={T.offer - T.noMeeting - 0.22}
            lines={[[{ text: "Sans une seule" }], [{ text: "réunion.", color: C.coral, wave: true }]]}
          />,
        )}
      </Series.Sequence>
      <Series.Sequence offset={f(0.05)} durationInFrames={f(T.card - T.offer - 0.05)}>
        {block(<KineticText size={hero * 1.12} outAt={T.card - T.offer - 0.3} lines={[[{ text: "Tout" }, { text: "compris.", color: C.coral }]]} />)}
      </Series.Sequence>
    </Series>
  );
};

export const Motionova: React.FC<MotionovaProps> = ({ layout, hasLogos }) => {
  const t = useTime();
  const { fps } = useVideoConfig();
  const L = LAYOUTS[layout];
  const f = (s: number) => Math.round(s * fps);

  const base = cameraAt(t, CAMERA);
  // Légère respiration de caméra : jamais d'image figée.
  const cam = { ...base, zoom: base.zoom * L.zoom, yaw: base.yaw + 0.6 * Math.sin(t * 1.4) };

  const flash = tween(t, 4.42, 4.58, 0, 1) * tween(t, 4.6, 4.68, 1, 0);
  // Voile léger derrière la typo, uniquement quand un texte est à l'écran.
  const veil = tween(t, T.card - 0.25, T.card + 0.1, 1, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Backdrop />
      <World cam={cam}>
        <Sequence layout="none" durationInFrames={f(TOTAL)}>
          <HookIsland />
        </Sequence>
        <Sequence layout="none" from={f(T.pipeline)}>
          <PipelineIsland />
        </Sequence>
        <Sequence layout="none" from={f(T.offer)}>
          <OfferIsland />
        </Sequence>
      </World>
      <AbsoluteFill
        style={{
          opacity: veil,
          background: `linear-gradient(180deg, rgba(249,251,255,0.9) 0px, rgba(249,251,255,0.7) ${L.textTop + 180}px, rgba(249,251,255,0) ${L.textTop + 360}px)`,
        }}
      />
      <TextTrack top={L.textTop} hero={L.hero} title={L.title} />
      <AbsoluteFill style={{ backgroundColor: C.coralTop, opacity: flash }} />
      <Sequence from={f(T.outro)}>
        <Outro hasLogos={hasLogos} top={L.textTop + 60} />
      </Sequence>
    </AbsoluteFill>
  );
};
