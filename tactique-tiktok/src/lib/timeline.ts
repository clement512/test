import { Easing, interpolate, spring } from "remotion";
import type { Anchor, CameraKeyframe, Point, ScriptData, Timed } from "../types";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/** Progression "spring" sans rebond, de 0 à 1 sur `duration` secondes à partir de `at`. */
export const springProgress = (
  frame: number,
  fps: number,
  at: number,
  duration: number,
  damping = 200,
) =>
  spring({
    frame: frame - Math.round(at * fps),
    fps,
    durationInFrames: Math.max(1, Math.round(duration * fps)),
    config: { damping, mass: 1, stiffness: 100 },
  });

/** Courbe d'entrée/sortie d'un élément temporisé : 0 → 1 (entrée) … 1 → 0 (sortie). */
export const visibility = (
  frame: number,
  fps: number,
  t: Timed,
  fadeIn = 0.35,
  fadeOut = 0.3,
) => {
  const f = frame / fps;
  if (f < t.from || f > t.to) return 0;
  const i = interpolate(f, [t.from, t.from + fadeIn], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const o = interpolate(f, [t.to - fadeOut, t.to], [1, 0], {
    extrapolateLeft: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(i, o);
};

export const isActive = (frame: number, fps: number, t: Timed) => {
  const f = frame / fps;
  return f >= t.from && f <= t.to;
};

/** Position (mètres) d'un joueur à une frame donnée : on enchaîne les keyframes de déplacement. */
export const getPlayerPos = (
  script: ScriptData,
  id: string,
  frame: number,
  fps: number,
): Point => {
  const def = script.players.find((p) => p.id === id);
  if (!def) throw new Error(`Joueur inconnu dans le scénario : "${id}"`);
  let pos = def.pos;
  for (const mv of script.moves) {
    const target = mv.positions[id];
    if (!target) continue;
    if (frame < mv.at * fps) break;
    const t = springProgress(frame, fps, mv.at, mv.duration ?? 0.9);
    pos = lerpPoint(pos, target, t);
  }
  return pos;
};

export const resolveAnchor = (
  script: ScriptData,
  a: Anchor,
  frame: number,
  fps: number,
): Point => {
  if (typeof a === "string") return getPlayerPos(script, a, frame, fps);
  if ("player" in a) {
    const p = getPlayerPos(script, a.player, frame, fps);
    return { x: p.x + (a.dx ?? 0), y: p.y + (a.dy ?? 0) };
  }
  return a;
};

export const isPlayerAnchor = (a: Anchor) =>
  typeof a === "string" || "player" in a;

export type BallState =
  | { kind: "held"; holder: string }
  | { kind: "flight"; from: Point; to: Point; t: number; toHolder: string | null }
  | { kind: "none" };

/** État du ballon : tenu par un joueur, ou en vol entre deux joueurs (passe). */
export const getBallState = (
  script: ScriptData,
  frame: number,
  fps: number,
): BallState => {
  const f = frame / fps;
  const kfs = script.ball.filter((k) => k.at <= f);
  if (kfs.length === 0) return { kind: "none" };
  const cur = kfs[kfs.length - 1];
  const prev = kfs.length > 1 ? kfs[kfs.length - 2] : null;
  const dur = cur.passDuration ?? 0.45;
  if (prev?.holder && cur.holder && f < cur.at + dur) {
    const t = Easing.inOut(Easing.quad)(clamp01((f - cur.at) / dur));
    return {
      kind: "flight",
      from: getPlayerPos(script, prev.holder, frame, fps),
      to: getPlayerPos(script, cur.holder, frame, fps),
      t,
      toHolder: cur.holder,
    };
  }
  return cur.holder ? { kind: "held", holder: cur.holder } : { kind: "none" };
};

/** Caméra : interpolation spring entre keyframes successives (focus, zoom, tilt, rotate). */
export const getCamera = (
  keyframes: CameraKeyframe[],
  frame: number,
  fps: number,
): Required<Omit<CameraKeyframe, "at" | "duration">> => {
  const first = keyframes[0];
  let cam = {
    focus: first.focus,
    zoom: first.zoom,
    tilt: first.tilt ?? 0,
    rotate: first.rotate ?? 0,
  };
  for (const k of keyframes.slice(1)) {
    if (frame < k.at * fps) break;
    const t = springProgress(frame, fps, k.at, k.duration ?? 1.2);
    cam = {
      focus: lerpPoint(cam.focus, k.focus, t),
      zoom: lerp(cam.zoom, k.zoom, t),
      tilt: lerp(cam.tilt, k.tilt ?? 0, t),
      rotate: lerp(cam.rotate, k.rotate ?? 0, t),
    };
  }
  return cam;
};

/** Découpe "un *mot* clé" en segments {text, hl}. */
export const parseHighlights = (text: string) => {
  const out: { text: string; hl: boolean }[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let mt: RegExpExecArray | null;
  while ((mt = re.exec(text))) {
    if (mt.index > last) out.push({ text: text.slice(last, mt.index), hl: false });
    out.push({ text: mt[1], hl: true });
    last = mt.index + mt[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), hl: false });
  return out;
};
