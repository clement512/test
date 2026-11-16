import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { ScriptData, Voiceover } from "./types";
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

/** Composition générique : tout est piloté par l'objet `script` (voir scriptData.ts). */
export const TacticalVideo: React.FC<{ script: ScriptData; voiceover?: Voiceover | null }> = ({
  script,
  voiceover,
}) => {
  const fps = script.meta.fps;
  // Validation légère : un id de joueur inconnu lève une erreur explicite au premier rendu
  getPlayerPos(script, script.players[0].id, 0, script.meta.fps);

  return (
    <ScriptProvider script={script}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
        <CameraRig keyframes={script.camera}>
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
        <KineticSubtitles items={script.subtitles} voice={voiceover?.lines} />
        <TransitionFlash at={script.meta.transitions ?? []} />
        <HUD title={script.meta.title} prefix={script.meta.hudPrefix} />

        {script.meta.audio && <Audio src={staticFile(script.meta.audio)} />}

        {/* Voix off : un clip par réplique, placé à son instant de départ */}
        {voiceover?.lines.map((l) => (
          <Sequence key={l.file} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.duration + 0.6) * fps)} layout="none">
            <Audio src={staticFile(l.file)} volume={script.meta.voice?.volume ?? 1} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ScriptProvider>
  );
};
