import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { LOGO_FULL } from "./brand";
import { Motionova, MotionovaProps } from "./Motionova";
import { LAYOUTS } from "./layouts";
import { TOTAL } from "./timeline";

// fps piloté par les props : brouillon 30 fps, master avec --props='{"fps":60}'.
// La durée suit automatiquement (toutes les animations sont écrites en secondes).
const calculateMetadata: CalculateMetadataFunction<MotionovaProps> = async ({ props, abortSignal }) => {
  const fps = props.fps === 60 ? 60 : 30;
  let hasLogos = false;
  try {
    const res = await fetch(staticFile(LOGO_FULL), { method: "HEAD", signal: abortSignal });
    hasLogos = res.ok && (res.headers.get("content-type") ?? "").startsWith("image/");
  } catch {
    hasLogos = false;
  }
  return {
    fps,
    durationInFrames: Math.round(TOTAL * fps),
    props: { ...props, fps, hasLogos },
  };
};

export const RemotionRoot: React.FC = () => {
  const L = LAYOUTS["916"];
  return (
    <Composition
      id="Motionova916"
      component={Motionova}
      durationInFrames={TOTAL * 30}
      fps={30}
      width={L.width}
      height={L.height}
      defaultProps={{ layout: "916", fps: 30, hasLogos: false } satisfies MotionovaProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
