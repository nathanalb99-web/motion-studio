import React from "react";
import { AbsoluteFill, Sequence, Series, useVideoConfig } from "remotion";
import { tween, useTime } from "./anim";
import { C } from "./brand";
import { CAMERA } from "./camera";
import { Bridge, PATH_HOOK_PIPELINE, PATH_PIPELINE_OFFER } from "./islands/Bridges";
import { HookIsland } from "./islands/HookIsland";
import { OfferIsland } from "./islands/OfferIsland";
import { PipelineIsland } from "./islands/PipelineIsland";
import { cameraAt, World } from "./iso/World";
import { LAYOUTS, LayoutId } from "./layouts";
import { KineticText } from "./overlay/KineticText";
import { Outro } from "./overlay/Outro";
import { STATIONS_AT, StationTitles } from "./overlay/StationTitles";
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

// Piste typo : chaque réplique a un début et une fin absolus (secondes), enchaînés en <Series>.
type Cue = { from: number; to: number; render: (dur: number) => React.ReactNode };

const TextTrack: React.FC<{ top: number; hero: number; title: number }> = ({ top, hero, title }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const block = (children: React.ReactNode) => (
    <div style={{ position: "absolute", top, left: 70, right: 70 }}>{children}</div>
  );
  const fast = { stagger: 0.035, dur: 0.32 };
  const cues: Cue[] = [
    {
      from: 0,
      to: 1.16,
      render: (d) =>
        block(<KineticText size={hero} inAt={-0.18} outAt={d - 0.16} {...fast} lines={[[{ text: "Votre produit" }], [{ text: "est génial." }]]} />),
    },
    {
      from: 1.16,
      to: T.collapse,
      render: (d) =>
        block(
          <KineticText
            size={hero}
            outAt={d - 0.22}
            {...fast}
            lines={[[{ text: "Encore faut-il" }], [{ text: "qu'on le" }, { text: "comprenne.", color: C.coral, wave: true }]]}
          />,
        ),
    },
    {
      from: STATIONS_AT,
      to: 7.95,
      render: (d) => <StationTitles end={d} top={top - 20} titleSize={title} />,
    },
    {
      from: 7.95,
      to: T.offer,
      render: (d) =>
        block(
          <KineticText size={hero} outAt={d - 0.22} {...fast} lines={[[{ text: "Sans une seule" }], [{ text: "réunion.", color: C.coral, wave: true }]]} />,
        ),
    },
    {
      from: T.offer + 0.02,
      to: T.card,
      render: (d) =>
        block(<KineticText size={hero * 1.12} outAt={d - 0.3} {...fast} lines={[[{ text: "Tout" }, { text: "compris.", color: C.coral }]]} />),
    },
  ];
  return (
    <Series>
      {cues.map((c, i) => {
        const prevEnd = i === 0 ? 0 : f(cues[i - 1].to);
        return (
          <Series.Sequence key={i} offset={f(c.from) - prevEnd} durationInFrames={f(c.to) - f(c.from)}>
            {c.render((f(c.to) - f(c.from)) / fps)}
          </Series.Sequence>
        );
      })}
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

  // Le marquage de la passerelle s'efface derrière « Tout compris. » et l'offre, puis revient au plan final.
  const bridgeDash = 1 - 0.85 * tween(t, T.offer + 0.1, T.offer + 0.4, 0, 1) * tween(t, T.outro, T.outro + 0.4, 1, 0);
  // Plein cadre corail entre la plongée dans le Play et la sortie du cube.
  const flash = tween(t, T.coral - 0.08, T.coral + 0.05, 0, 1) * tween(t, T.pipeline + 0.01, T.pipeline + 0.11, 1, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Backdrop />
      <World cam={cam}>
        <Sequence layout="none" durationInFrames={f(TOTAL)}>
          <HookIsland />
        </Sequence>
        <Bridge path={PATH_HOOK_PIPELINE} />
        <Sequence layout="none" from={f(T.pipeline)}>
          <PipelineIsland />
        </Sequence>
        <Bridge path={PATH_PIPELINE_OFFER} dashOpacity={bridgeDash} />
        <Sequence layout="none" from={f(T.offer)}>
          <OfferIsland />
        </Sequence>
      </World>
      <TextTrack top={L.textTop} hero={L.hero} title={L.title} />
      <AbsoluteFill style={{ backgroundColor: C.coralTop, opacity: flash }} />
      <Sequence from={f(T.coral)} durationInFrames={f(T.pipeline + 0.08 - T.coral)}>
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 70px" }}>
          <KineticText
            size={L.title * 1.25}
            color={C.white}
            inAt={0.04}
            outAt={0.3}
            stagger={0.04}
            dur={0.2}
            lines={[[{ text: "4 étapes." }]]}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={f(T.outro)}>
        <Outro hasLogos={hasLogos} top={L.textTop + 60} />
      </Sequence>
    </AbsoluteFill>
  );
};
