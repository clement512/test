/**
 * Recalage de la timeline sur la voix off.
 *
 * Le scénario est écrit en "temps scénario" (scriptData.ts). Une fois la voix générée, on connaît
 * la durée réelle de chaque réplique : on construit une fonction affine par morceaux
 * temps scénario → temps vidéo telle que la réplique i commence juste après la précédente
 * (sans blanc), puis on applique cette fonction à TOUS les instants du scénario (déplacements,
 * flèches, caméra, bannières, effets sonores...). Les durées sont converties de la même façon,
 * donc les animations accélèrent ou ralentissent avec la narration.
 */
import type { GeneratedAudio, PlacedVoiceLine, ScriptData, Timed } from "../types";

type Knot = { s: number; v: number };

/** Temps du morceau ramenés au temps vidéo (offset retiré). */
export const videoBeats = (script: ScriptData, audio?: GeneratedAudio | null) => {
  const off = script.meta.music?.offset ?? 0;
  return (audio?.beats?.beats ?? []).map((t) => t - off).filter((t) => t >= 0);
};

/** Aimante un instant au temps le plus proche (± window s). */
export const snapToBeat = (t: number, beats: number[], window: number) => {
  let best = t;
  let d = window;
  for (const b of beats) {
    const x = Math.abs(b - t);
    if (x <= d) {
      d = x;
      best = b;
    }
  }
  return best;
};

export const buildTimeMap = (script: ScriptData, audio?: GeneratedAudio | null) => {
  const lines = audio?.voice?.lines ?? [];
  const subs = script.subtitles;
  const gap = script.meta.pacing?.gap ?? 0.12;
  const endHold = script.meta.pacing?.endHold ?? 1.2;
  const S = script.meta.durationInSeconds;

  if (!lines.length || lines.length !== subs.length) {
    const identity = (t: number) => t;
    return { map: identity, duration: S, placed: [] as PlacedVoiceLine[] };
  }

  // Mode speech-to-speech : les clips sont déjà à leurs instants d'origine → pas de recalage
  if (lines.every((l) => l.fixedStart !== undefined)) {
    const placedFixed = lines.map((l) => ({ ...l, start: l.fixedStart! }));
    const lastEnd = Math.max(...placedFixed.map((l) => l.start + l.duration));
    return { map: (t: number) => t, duration: Math.max(S, lastEnd + endHold), placed: placedFixed };
  }

  const knots: Knot[] = [{ s: 0, v: 0 }];
  const placed: PlacedVoiceLine[] = [];
  // Chaque clip démarre juste après la fin du précédent (rire ou souffle d'attaque inclus) ;
  // le "temps scénario" de la réplique est calé sur le début réel de la parole.
  let cursor = Math.max(0, subs[0].from - lines.find((l) => l.index === 0)!.speechStart);
  let v = 0;
  const bs = script.meta.music?.beatSync;
  const beats = bs?.lines !== false ? videoBeats(script, audio) : [];
  const maxDelay = bs?.maxDelay ?? 0.22;
  for (let i = 0; i < subs.length; i++) {
    const line = lines.find((l) => l.index === i)!;
    let start = cursor;
    // Calage rythmique : la parole démarre sur le prochain temps s'il est proche
    if (beats.length) {
      const sp = start + line.speechStart;
      const b = beats.find((t) => t >= sp - 0.02);
      if (b !== undefined && b - sp <= maxDelay) start += Math.max(0, b - sp);
    }
    v = start + line.speechStart;
    knots.push({ s: subs[i].from, v });
    placed.push({ ...line, start });
    cursor = start + line.duration + gap + (subs[i].pauseAfter ?? 0);
  }
  v = cursor;
  const lastTo = subs[subs.length - 1].to;
  knots.push({ s: lastTo, v });
  if (S > lastTo) knots.push({ s: S, v: v + endHold });
  const duration = knots[knots.length - 1].v;

  const map = (t: number) => {
    if (t <= knots[0].s) return t;
    for (let k = 1; k < knots.length; k++) {
      const a = knots[k - 1];
      const b = knots[k];
      if (t <= b.s) {
        const r = b.s === a.s ? 1 : (t - a.s) / (b.s - a.s);
        return a.v + (b.v - a.v) * r;
      }
    }
    const last = knots[knots.length - 1];
    return last.v + (t - last.s);
  };
  return { map, duration, placed };
};

/** Applique le recalage à tout le scénario. */
export const retimeScript = (script: ScriptData, map: (t: number) => number): ScriptData => {
  const T = <X extends Timed>(x: X): X => ({ ...x, from: map(x.from), to: map(x.to) });
  const D = (at: number, d: number | undefined, def: number) =>
    Math.max(0.12, map(at + (d ?? def)) - map(at));

  return {
    ...script,
    meta: { ...script.meta, transitions: script.meta.transitions?.map(map) },
    players: script.players.map((p) => ({ ...p, appearAt: map(p.appearAt ?? 0) })),
    moves: script.moves.map((m) => ({ ...m, at: map(m.at), duration: D(m.at, m.duration, 0.9) })),
    ball: script.ball.map((b) => ({ ...b, at: map(b.at), passDuration: D(b.at, b.passDuration, 0.45) })),
    camera: script.camera.map((c) => ({ ...c, at: map(c.at), duration: D(c.at, c.duration, 1.2) })),
    highlights: script.highlights.map(T),
    tags: script.tags.map(T),
    arrows: script.arrows.map((a) => ({ ...T(a), drawDuration: D(a.from, a.drawDuration, 0.6) })),
    zones: script.zones.map(T),
    callouts: script.callouts.map(T),
    icons: script.icons.map(T),
    measures: script.measures.map(T),
    // Les bandeaux de chapitre gardent leur durée en secondes réelles (animation calibrée)
    chapters: script.chapters.map((c) => ({ ...c, from: map(c.from) })),
    pills: script.pills.map(T),
    subtitles: script.subtitles.map(T),
    titleCards: script.titleCards.map((c) => ({ ...T(c), pillAt: c.pillAt === undefined ? undefined : map(c.pillAt) })),
    sfx: script.sfx?.map((x) => (x.at === undefined ? x : { ...x, at: map(x.at) })),
    stamps: script.stamps?.map((x) => (x.at === undefined ? x : { ...x, at: map(x.at) })),
    agenda: script.agenda?.map(T),
    compare: script.compare?.map((c) => ({ ...T(c), captionAt: c.captionAt === undefined ? undefined : map(c.captionAt) })),
    outro: script.outro && { ...script.outro, from: map(script.outro.from), clickAt: map(script.outro.clickAt) },
  };
};
