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

  const knots: Knot[] = [{ s: 0, v: 0 }];
  const placed: PlacedVoiceLine[] = [];
  // Chaque clip démarre juste après la fin du précédent (rire ou souffle d'attaque inclus) ;
  // le "temps scénario" de la réplique est calé sur le début réel de la parole.
  let cursor = Math.max(0, subs[0].from - lines.find((l) => l.index === 0)!.speechStart);
  let v = 0;
  for (let i = 0; i < subs.length; i++) {
    const line = lines.find((l) => l.index === i)!;
    const start = cursor;
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
    chapters: script.chapters.map((c) => ({ ...c, from: map(c.from), duration: D(c.from, c.duration, 2.6) })),
    pills: script.pills.map(T),
    subtitles: script.subtitles.map(T),
    titleCards: script.titleCards.map(T),
    sfx: script.sfx?.map((x) => ({ ...x, at: map(x.at) })),
    outro: script.outro && { ...script.outro, from: map(script.outro.from), clickAt: map(script.outro.clickAt) },
  };
};
