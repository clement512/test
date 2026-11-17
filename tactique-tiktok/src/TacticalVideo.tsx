import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Cue, GeneratedAudio, PlacedVoiceLine, ScriptData } from "./types";
import { resolveSounds } from "./audioLibrary";
import { displayWords, normWord } from "./lib/words";
import { COLORS, WORLD } from "./theme";
import { ScriptProvider } from "./lib/ScriptContext";
import { snapToBeat, videoBeats } from "./lib/retime";
import { getBallState, getPlayerPos, isActive } from "./lib/timeline";
import { toPx } from "./theme";
import { CameraRig } from "./components/CameraRig";
import { GlowDefs, Pitch } from "./components/Pitch";
import { BallInFlight, PlayerNode } from "./components/PlayerNode";
import { TacticalArrow } from "./components/TacticalArrow";
import { TacticalZone } from "./components/TacticalZone";
import { Callout, IconMarker, MeasureLine, PlayerTag } from "./components/Annotations";
import { HUD } from "./components/HUD";
import { Agenda, ChapterBanner, KeywordStamp, KineticSubtitles, TitleCard, TopPill } from "./components/Typography";
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

/** Instant (s, vidéo) d'un repère calé sur la voix : le mot `cue.word` de la réplique `cue.line`. */
const cueTime = (script: ScriptData, voice: PlacedVoiceLine[], cue: Cue): number => {
  const sub = script.subtitles[cue.line];
  if (!sub) throw new Error(`Repère : réplique ${cue.line} inexistante`);
  const words = displayWords(sub.text);
  const target = normWord(cue.word);
  let idx = words.findIndex((w) => normWord(w.text) === target);
  if (idx < 0) idx = words.findIndex((w) => normWord(w.text).startsWith(target));
  if (idx < 0) throw new Error(`Repère : mot "${cue.word}" absent de la réplique ${cue.line} ("${sub.text}")`);
  const v = voice.find((l) => l.index === cue.line);
  const base = v?.wordStarts
    ? v.start + v.wordStarts[idx]
    : sub.from + ((sub.to - sub.from) * idx) / Math.max(1, words.length);
  return base + (cue.offset ?? 0);
};

/** Instants des débuts de segments colorés prononcés → "punchs" de caméra. */
const wordPunches = (script: ScriptData, voice: PlacedVoiceLine[]) =>
  voice.flatMap((l) => {
    if (!l.wordStarts) return [];
    const words = displayWords(script.subtitles[l.index].text);
    return words
      .map((w, i) => ({ w, i }))
      .filter(({ w, i }) => w.color && !(i > 0 && words[i - 1].color === w.color))
      .map(({ i }) => l.start + l.wordStarts![i]);
  });

/**
 * Volume de la musique : fondus d'entrée/sortie et ducking progressif sous la voix
 * (rampe de 0,15 s avant/après chaque phrase, pour ne pas "pomper" brutalement).
 */
const musicVolume = (voice: PlacedVoiceLine[], base: number, duck: number, fps: number, total: number) =>
  (f: number) => {
    const t = f / fps;
    let amount = 0;
    for (const l of voice) {
      const a = l.start + l.speechStart - 0.08;
      const b = l.start + l.duration + 0.12;
      const d = t < a ? a - t : t > b ? t - b : 0;
      amount = Math.max(amount, Math.max(0, 1 - d / 0.15));
    }
    const level = base * (1 - (1 - duck) * amount);
    const fadeIn = Math.min(1, t / 0.3);
    const fadeOut = Math.min(1, Math.max(0, (total - t) / 1.2));
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
  const rawPunches = script.meta.wordPunches === false ? [] : wordPunches(script, voice);
  const at = (x: { at?: number; cue?: Cue }) => (x.cue ? cueTime(script, voice, x.cue) : (x.at ?? 0));

  // Calage rythmique (musique fournie) : événements aimantés au temps le plus proche
  const music = script.meta.music;
  const beats = music?.file && music.beatSync ? videoBeats(script, audio) : [];
  const snapWin = music?.beatSync?.snap ?? 0.15;
  const snap = (t: number) => (beats.length ? snapToBeat(t, beats, snapWin) : t);
  const punches = rawPunches.map(snap);
  const chapters = script.chapters.map((c) => ({ ...c, from: snap(c.from) }));

  const stamps = (script.stamps ?? []).map((st) => {
    const from = snap(at(st));
    return { ...st, from, to: from + (st.hold ?? 1.3) };
  });
  const sfx = [
    ...(script.sfx ?? []).map((x) => ({ t: snap(at(x)), sound: x.sound, volume: x.volume })),
    ...stamps.filter((st) => st.sound !== false).map((st) => ({ t: st.from - 0.02, sound: (st.sound || script.meta.stampSound || "stamp") as string, volume: undefined })),
  ];

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
        {(script.agenda ?? []).map((d, i) => (
          <Agenda key={`ag${i}`} def={d} />
        ))}
        {script.pills.map((d, i) => (
          <TopPill key={`p${i}`} def={d} />
        ))}
        {stamps.map((st, i) => (
          <KeywordStamp key={`st${i}`} text={st.text} color={st.color} from={st.from} to={st.to} y={st.y} rotate={st.rotate} />
        ))}
        {chapters.map((d, i) => (
          <ChapterBanner key={`ch${i}`} def={d} />
        ))}
        {script.outro && <Outro def={script.outro} handle={script.meta.handle} />}
        <KineticSubtitles items={script.subtitles} voice={voice} />
        <TransitionFlash at={script.meta.transitions ?? []} />
        <HUD title={script.meta.title} prefix={script.meta.hudPrefix} handle={script.meta.handle} />

        {script.meta.audio && <Audio src={staticFile(script.meta.audio)} />}

        {/* Musique de fond (optionnelle) : fichier fourni ou morceau généré, avec ducking sous la voix */}
        {music && (music.file || audio?.music) && (
          <Audio
            src={staticFile(music.file ?? audio!.music!.file)}
            trimBefore={Math.round((music.file ? (music.offset ?? 0) : 0) * fps)}
            volume={musicVolume(voice, music.volume ?? 0.2, music.duck ?? 0.35, fps, durationInFrames / fps)}
          />
        )}

        {/* Voix off : un clip par réplique, placé après recalage */}
        {voice.map((l) => (
          <Sequence key={l.file} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.duration + 0.8) * fps)} layout="none">
            <Audio src={staticFile(l.file)} volume={script.meta.voice?.volume ?? 1} />
          </Sequence>
        ))}

        {/* Bruitages */}
        {sfx.map((x, i) => {
          const file = audio?.sounds?.[x.sound]?.file;
          const def = sounds[x.sound];
          if (!file || !def) return null;
          return (
            <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(x.t * fps))} durationInFrames={Math.ceil((def.duration + 0.5) * fps)} layout="none">
              <Audio src={staticFile(file)} volume={(x.volume ?? def.volume ?? 0.5) * (script.meta.sfxGain ?? 1)} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </ScriptProvider>
  );
};
