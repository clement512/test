import React from "react";
import { Composition } from "remotion";
import { TacticalVideo } from "./TacticalVideo";
import { VIDEOS } from "./videos";
import { ensureFonts } from "./fonts";
import voiceovers from "./generated/voiceovers.json";
import type { Voiceover } from "./types";

ensureFonts();

const VOICEOVERS = voiceovers as Record<string, Voiceover>;

/** Une composition par vidéo déclarée dans src/videos.ts. */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((s) => (
      <Composition
        key={s.meta.id}
        id={s.meta.id}
        component={TacticalVideo}
        durationInFrames={Math.round(s.meta.durationInSeconds * s.meta.fps)}
        fps={s.meta.fps}
        width={s.meta.width}
        height={s.meta.height}
        defaultProps={{ script: s, voiceover: VOICEOVERS[s.meta.id] ?? null }}
      />
    ))}
  </>
);
