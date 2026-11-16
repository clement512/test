import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { GeneratedAudio, PlacedVoiceLine, ScriptData } from "./types";
import { resolveSounds } from "./audioLibrary";
import { displayWords } from "./lib/words";
import { COLORS, WORLD } from "./theme";
import { ScriptProvider } from "./lib/ScriptContext";
import { getBallState, getPlayerPos, isActive } from "./lib/timeline";
import { toPx } from "./theme";
import { CameraRig } from "./components/CameraRig";
import { GlowDefs, Pitch } from "./components/Pitch";
import { BallInFlight, PlayerNode } from "./components/PlayerNode";
import { TacticalArrow } from "./components/TacticalArrow";
import { TacticalZone } from "./components/TacticalZone";
import { Callout, IconMarker, MeasureLine, PlayerTag } from "./components/Annotations";
import { HUD } from "./components/HUD";
import { ChapterBanner, KineticSubtitles, TitleCard, TopPill } from "./components/Typography";
import { Outro, TransitionFlash } from "./components/Outro";

/** Couche "monde" (dans la caméra) : terrain, zones, flèches, joueurs, annotations. */
const World: React.FC<{ script: ScriptData }> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ball = getBallState(script, frame, fps);
  const holder = ball.kind === "held" ? ball.holder : null;

  // Pendant l'outro, le terrain s'efface doucement
  const outroDim = script.outro
    ? interpolate(frame / fps, [script.outro.from, script.outro.from + 0.8], [1, 0.35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Ordre de dessin : les joueurs mis en avant et le porteur passent au-dessus
  const activeHl = script.highlights.filter((h) => isActive(frame, fps, h));
  const players = [...script.players].sort((a, b) => {
    const score = (id: string) => (id === holder ? 2 : 0) + (activeHl.some((h) => h.player === id) ? 1 : 0);
    return score(a.id) - score(b.id);
  });

  return (
    <svg
      width={WORLD.width}
      height={WORLD.height}
      viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <GlowDefs />
      <g opacity={outroDim}>
        <Pitch />
        {script.zones.map((z, i) => (
          <TacticalZone key={`z${i}`} def={z} />
        ))}
        {script.measures.map((d, i) => (
          <MeasureLine key={`m${i}`} def={d} />
        ))}
        {script.arrows.map((a, i) => (
          <TacticalArrow key={`a${i}`} uid={String(i)} def={a} />
        ))}
        {players.map((p) => {
          const hl = activeHl.find((h) => h.player === p.id);
          return (
            <PlayerNode
              key={p.id}
              player={p}
              hasBall={p.id === holder}
              isHighlighted={!!hl}
              highlightColor={hl?.color}
            />
          );
        })}
        {ball.kind === "flight" && (() => {
          const pos = toPx({
            x: ball.from.x + (ball.to.x - ball.from.x) * ball.t,
            y: ball.from.y + (ball.to.y - ball.from.y) * ball.t,
          });
          const src = toPx(ball.from);
          return <BallInFlight x={pos.x} y={pos.y} fromX={src.x} fromY={src.y} />;
        })()}
        {script.icons.map((d, i) => (
          <IconMarker key={`i${i}`} def={d} />
        ))}
        {script.callouts.map((d, i) => (
          <Callout key={`c${i}`} def={d} />
        ))}
        {script.tags.map((d, i) => (
          <PlayerTag key={`t${i}`} def={d} />
        ))}
      </g>
    </svg>
  );
};

/** Instants des mots *surlignés* prononcés → "punchs" de caméra. */
const wordPunches = (script: ScriptData, voice: PlacedVoiceLine[]) =>
  voice.flatMap((l) => {
    if (!l.wordStarts) return [];
    const words = displayWords(script.subtitles[l.index].text);
    return words
      .map((w, i) => ({ w, i }))
      .filter(({ w, i }) => w.hl && !(i > 0 && words[i - 1].hl))
      .map(({ i }) => l.start + l.wordStarts![i]);
  });

/** Musique : fondu d'entrée/sortie et baisse automatique sous la voix (ducking). */
const useMusicVolume = (voice: PlacedVoiceLine[], base: number, fps: number, total: number) =>
  (f: number) => {
    const t = f / fps;
    const speaking = voice.some((l) => t >= l.start + l.speechStart - 0.1 && t <= l.start + l.duration + 0.15);
    const level = speaking ? base * 0.62 : base;
    const fadeIn = Math.min(1, t / 0.4);
    const fadeOut = Math.min(1, Math.max(0, (total - t) / 1.0));
    return level * fadeIn * fadeOut;
  };

/** Composition générique : tout est piloté par l'objet `script` (voir scriptData.ts). */
export const TacticalVideo: React.FC<{
  script: ScriptData;
  voice?: PlacedVoiceLine[];
  audio?: GeneratedAudio | null;
}> = ({ script, voice = [], audio }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const sounds = resolveSounds(script.meta.sounds);
  const punches = script.meta.wordPunches === false ? [] : wordPunches(script, voice);
  const musicVolume = useMusicVolume(voice, script.meta.music?.volume ?? 0.2, fps, durationInFrames / fps);

  // Validation légère : un id de joueur inconnu lève une erreur explicite au premier rendu
  getPlayerPos(script, script.players[0].id, 0, script.meta.fps);

  return (
    <ScriptProvider script={script}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
        <CameraRig keyframes={script.camera} punches={punches}>
          <World script={script} />
        </CameraRig>

        {script.titleCards.map((d, i) => (
          <TitleCard key={`tc${i}`} def={d} />
        ))}
        {script.pills.map((d, i) => (
          <TopPill key={`p${i}`} def={d} />
        ))}
        {script.chapters.map((d, i) => (
          <ChapterBanner key={`ch${i}`} def={d} />
        ))}
        {script.outro && <Outro def={script.outro} />}
        <KineticSubtitles items={script.subtitles} voice={voice} />
        <TransitionFlash at={script.meta.transitions ?? []} />
        <HUD title={script.meta.title} prefix={script.meta.hudPrefix} />

        {script.meta.audio && <Audio src={staticFile(script.meta.audio)} />}

        {/* Musique de fond */}
        {audio?.music && <Audio src={staticFile(audio.music.file)} volume={musicVolume} />}

        {/* Voix off : un clip par réplique, placé après recalage */}
        {voice.map((l) => (
          <Sequence key={l.file} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.duration + 0.8) * fps)} layout="none">
            <Audio src={staticFile(l.file)} volume={script.meta.voice?.volume ?? 1} />
          </Sequence>
        ))}

        {/* Effets sonores */}
        {(script.sfx ?? []).map((x, i) => {
          const file = audio?.sounds?.[x.sound]?.file;
          if (!file) return null;
          const def = sounds[x.sound];
          return (
            <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(x.at * fps))} durationInFrames={Math.ceil((def.duration + 0.5) * fps)} layout="none">
              <Audio src={staticFile(file)} volume={x.volume ?? def.volume ?? 0.5} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </ScriptProvider>
  );
};
