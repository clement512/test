import React from "react";
import { Composition } from "remotion";
import { SmartShort, type SceneMap } from "./SmartShort";
import { FPS, H, W } from "./theme";
import { EP04 } from "./episodes/ep04";
import { EP05 } from "./episodes/ep05";
import { EP06 } from "./episodes/ep06";
import { EP04_SCENES } from "./scenes/ep04";
import { EP05_SCENES } from "./scenes/ep05";
import { EP06_SCENES } from "./scenes/ep06";
import t04 from "./generated/Ep04Gerrymandering.json";
import t05 from "./generated/Ep05Islande.json";
import t06 from "./generated/Ep06Napoleon.json";
import type { Episode, VoiceTrack } from "./episodes/types";

const VIDEOS: [Episode, VoiceTrack, SceneMap][] = [
  [EP04, t04 as VoiceTrack, EP04_SCENES],
  [EP05, t05 as VoiceTrack, EP05_SCENES],
  [EP06, t06 as VoiceTrack, EP06_SCENES],
];

export const Root: React.FC = () => (
  <>
    {VIDEOS.map(([ep, track, scenes]) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={() => <SmartShort episode={ep} track={track} scenes={scenes} />}
        durationInFrames={Math.round(track.total * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
