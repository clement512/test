import React from "react";
import { Composition } from "remotion";
import { TacticalVideo } from "./TacticalVideo";
import { VIDEOS } from "./videos";
import { ensureFonts } from "./fonts";
import generated from "./generated/audio.json";
import type { GeneratedAudio } from "./types";
import { buildTimeMap, retimeScript } from "./lib/retime";

ensureFonts();

const AUDIO = generated as Record<string, GeneratedAudio>;

/**
 * Une composition par vidéo déclarée dans src/videos.ts. Si l'audio a été généré
 * (`npm run audio`), la timeline est recalée sur la voix et la durée suit la narration.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((raw) => {
      const audio = AUDIO[raw.meta.id] ?? null;
      const { map, duration, placed } = buildTimeMap(raw, audio);
      const script = retimeScript(raw, map);
      return (
        <Composition
          key={raw.meta.id}
          id={raw.meta.id}
          component={TacticalVideo}
          durationInFrames={Math.ceil(duration * raw.meta.fps)}
          fps={raw.meta.fps}
          width={raw.meta.width}
          height={raw.meta.height}
          defaultProps={{ script, voice: placed, audio }}
        />
      );
    })}
  </>
);
