import React from "react";
import { Composition } from "remotion";
import { SmartShort, type SceneMap } from "./SmartShort";
import { FPS, H, W } from "./theme";
import { EP04 } from "./episodes/ep04";
import { EP05 } from "./episodes/ep05";
import { EP06 } from "./episodes/ep06";
import { EP07 } from "./episodes/ep07";
import { EP08 } from "./episodes/ep08";
import { EP04_SCENES } from "./scenes/ep04";
import { EP05_SCENES } from "./scenes/ep05";
import { EP06_SCENES } from "./scenes/ep06";
import { Backdrop07, EP07_SCENES } from "./scenes/ep07";
import { Backdrop08, EP08_SCENES } from "./scenes/ep08";
import t04 from "./generated/Ep04Gerrymandering.json";
import t05 from "./generated/Ep05Islande.json";
import t06 from "./generated/Ep06Napoleon.json";
import t07 from "./generated/Ep07Poubelle.json";
import t08 from "./generated/Ep08VoteSecret.json";
import type { Episode, VoiceTrack } from "./episodes/types";

const VIDEOS: [Episode, VoiceTrack, SceneMap, React.FC?][] = [
  [EP04, t04 as VoiceTrack, EP04_SCENES],
  [EP05, t05 as VoiceTrack, EP05_SCENES],
  [EP06, t06 as VoiceTrack, EP06_SCENES],
  [EP07, t07 as VoiceTrack, EP07_SCENES, Backdrop07],
  [EP08, t08 as VoiceTrack, EP08_SCENES, Backdrop08],
];

export const Root: React.FC = () => (
  <>
    {VIDEOS.map(([ep, track, scenes, backdrop]) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={() => <SmartShort episode={ep} track={track} scenes={scenes} backdrop={backdrop} />}
        durationInFrames={Math.round(track.total * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
