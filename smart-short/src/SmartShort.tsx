import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, buildGroups, TrackContext, Header, Outro, SceneWrap, SegmentContext, Subtitles } from "./frame";
import { FPS } from "./theme";
import { Sfx } from "./ui";
import { normWord } from "./lib/words";
import type { Episode, VoiceTrack } from "./episodes/types";

const TailFade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [len - 26, len - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export type SceneMap = Record<string, React.FC>;

export const SmartShort: React.FC<{ episode: Episode; track: VoiceTrack; scenes: SceneMap; backdrop?: React.FC }> = ({
  episode,
  track,
  scenes,
  backdrop: Backdrop,
}) => {
  const fr = (s: number) => Math.round(s * FPS);
  const outroFrom = fr(track.voiceEnd + 0.5);
  const starts = track.segments.map((s) => fr(s.start));
  const gold = new Set(episode.gold.map(normWord));
  const groups = buildGroups(track.segments, gold);
  const chapters = episode.segments.map((s, i) => ({ from: starts[i], chapter: s.chapter, badge: s.badge }));
  return (
    <TrackContext.Provider value={track.segments}>
    <AbsoluteFill>
      <Background />
      {Backdrop ? (
        <Sequence durationInFrames={outroFrom + 10} name="carte">
          <TailFade len={outroFrom + 10}>
            <Backdrop />
          </TailFade>
        </Sequence>
      ) : null}
      {track.segments.map((seg, i) => {
        const from = i === 0 ? 0 : starts[i] - 6;
        const to = i < track.segments.length - 1 ? starts[i + 1] + 2 : outroFrom + 8;
        const Scene = scenes[seg.id];
        if (!Scene) throw new Error(`Scène manquante : ${seg.id}`);
        const shifted = { ...seg, words: seg.words.map((w) => ({ ...w, s: w.s + (starts[i] - from) / FPS, e: w.e + (starts[i] - from) / FPS })) };
        return (
          <Sequence key={seg.id} from={from} durationInFrames={to - from} name={seg.id}>
            <SegmentContext.Provider value={{ seg: shifted, dur: to - from }}>
              <SceneWrap dur={to - from}>
                <Scene />
              </SceneWrap>
            </SegmentContext.Provider>
          </Sequence>
        );
      })}
      {track.segments.map((seg, i) => (
        <Sequence key={`a-${seg.id}`} from={starts[i]} name={`voix ${seg.id}`} layout="none">
          <Audio src={staticFile(seg.file)} />
        </Sequence>
      ))}
      {starts.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} at={s - 8} name="softWhoosh" volume={0.3} />
      ))}
      <Header number={episode.number} when={episode.when} chapters={chapters} total={fr(track.total)} outroFrom={outroFrom} />
      <Subtitles groups={groups} hideFrom={outroFrom} />
      <Sequence from={outroFrom} name="outro">
        <Outro next={episode.next} />
      </Sequence>
      <Sfx at={outroFrom} name="riser" volume={0.3} />
      <Sfx at={outroFrom + 36} name="impact" volume={0.35} />
    </AbsoluteFill>
    </TrackContext.Provider>
  );
};
