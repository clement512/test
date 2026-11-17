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
      const common = {
        component: TacticalVideo,
        durationInFrames: Math.ceil(duration * raw.meta.fps),
        fps: raw.meta.fps,
        width: raw.meta.width,
        height: raw.meta.height,
      };
      return (
        <React.Fragment key={raw.meta.id}>
          <Composition id={raw.meta.id} {...common} defaultProps={{ script, voice: placed, audio, noMusic: false }} />
          {/* Variante sans musique (même minutage) pour ajouter le son directement dans TikTok */}
          {raw.meta.music && (
            <Composition id={`${raw.meta.id}SansMusique`} {...common} defaultProps={{ script, voice: placed, audio, noMusic: true }} />
          )}
        </React.Fragment>
      );
    })}
  </>
);
