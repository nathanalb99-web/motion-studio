import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, staticFile, useVideoConfig } from "remotion";
import { tween, useTime } from "./anim";
import { C } from "./brand";
import { CAMERA } from "./camera";
import { musicVolume, VOICE_GAIN } from "./audio";
import { Bridge, PATH_HOOK_PIPELINE } from "./islands/Bridges";
import { HookIsland } from "./islands/HookIsland";
import { PipelineIsland } from "./islands/PipelineIsland";
import { cameraAt, World } from "./iso/World";
import { LAYOUTS, LayoutId } from "./layouts";
import { KineticText } from "./overlay/KineticText";
import { Outro } from "./overlay/Outro";
import { STATIONS_AT, StationTitles } from "./overlay/StationTitles";
import { Subtitles } from "./overlay/Subtitles";
import { Waves } from "./overlay/Waves";
import { T, TOTAL, WORDS } from "./timeline";

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

// Piste typo : uniquement les mots-clés, chacun posé à l'instant où la voix le prononce.
// Les phrases complètes passent par les sous-titres.
type Cue = { from: number; to: number; render: (dur: number) => React.ReactNode };

const word = (w: string, after = 0) => WORDS.find((x) => x.s >= after - 0.01 && x.w === w)!.s;

const TextTrack: React.FC<{ top: number; hero: number; title: number }> = ({ top, hero, title }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const block = (children: React.ReactNode) => (
    <div style={{ position: "absolute", top, left: 70, right: 70 }}>{children}</div>
  );
  // Le mot entre 60 ms avant d'être prononcé : il est lisible à l'instant où on l'entend.
  const lead = 0.06;
  const cues: Cue[] = [
    {
      from: T.genial - lead,
      to: T.hook2 - 0.05,
      render: (d) =>
        block(
          <KineticText size={hero * 1.45} times={[lead]} dur={0.26} outAt={d - 0.18} lines={[[{ text: "génial.", wave: true, punch: true }]]} />,
        ),
    },
    {
      from: T.comprenne - lead,
      to: T.collapse - 0.1,
      render: (d) =>
        block(
          <KineticText
            size={hero * 1.3}
            times={[lead]}
            dur={0.26}
            outAt={d - 0.18}
            lines={[[{ text: "comprenne.", color: C.coral, wave: true, punch: true }]]}
          />,
        ),
    },
    {
      from: STATIONS_AT - 0.06,
      to: T.noMeeting - 0.06,
      render: (d) => <StationTitles end={d - 0.06} top={top - 20} titleSize={title} offset={0.06} />,
    },
    {
      from: T.noMeeting - lead,
      to: T.waves + 0.15,
      render: (d) => {
        const start = T.noMeeting - lead;
        return block(
          <KineticText
            size={hero}
            dur={0.26}
            outAt={d - 0.22}
            times={["Sans", "une", "seule", "réunion."].map((w) => word(w, T.noMeeting) - start)}
            lines={[[{ text: "Sans une seule", punch: true }], [{ text: "réunion.", color: C.coral, wave: true, punch: true }]]}
          />,
        );
      },
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

  // Plein cadre corail entre la plongée dans le Play et la sortie du cube.
  const flash = tween(t, T.coral - 0.08, T.coral + 0.05, 0, 1) * tween(t, T.pipeline, T.pipeline + 0.1, 1, 0);
  // Fonds corail : les sous-titres passent en pastille bleu nuit, texte blanc.
  const coralBg = (x: number) => (x >= T.coral - 0.02 && x < T.pipeline + 0.08) || x >= T.waves + 0.4;
  const claire = word("claire.", T.video);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile("voixoff.mp3")} volume={VOICE_GAIN} />
      <Audio src={staticFile("musique.mp3")} volume={musicVolume(t)} />
      <Backdrop />
      <World cam={cam}>
        <Sequence layout="none" durationInFrames={f(TOTAL)}>
          <HookIsland />
        </Sequence>
        <Bridge path={PATH_HOOK_PIPELINE} />
        <Sequence layout="none" from={f(T.pipeline)}>
          <PipelineIsland />
        </Sequence>
      </World>
      <TextTrack top={L.textTop} hero={L.hero} title={L.title} />
      <AbsoluteFill style={{ backgroundColor: C.coralTop, opacity: flash }} />
      <Sequence from={f(T.coral)} durationInFrames={f(T.pipeline + 0.1 - T.coral)}>
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 70px" }}>
          <KineticText
            size={L.title * 1.15}
            color={C.white}
            times={[T.video - T.coral - 0.06, claire - T.coral - 0.06]}
            outAt={T.pipeline - T.coral - 0.06}
            dur={0.24}
            lines={[[{ text: "vidéo", punch: true }], [{ text: "claire.", punch: true }]]}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={f(T.waves)}>
        <Outro hasLogos={hasLogos} top={L.textTop + 60} />
      </Sequence>
      <Subtitles dark={coralBg} bottom={L.height - L.subtitleBottom} />
    </AbsoluteFill>
  );
};
