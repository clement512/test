/**
 * Découpage des sous-titres en mots — partagé entre le rendu (KineticSubtitles) et le
 * générateur audio (scripts/audio.ts) pour que le calage mot à mot corresponde.
 *
 * Marqueurs de couleur dans les textes :
 *   *mot*  → jaune (emphase)      ^mot^ → cyan (nous / positif)      ~mot~ → rose (adversaire / négatif)
 */
import type { NeonColor } from "../types";

const MARKERS: Record<string, NeonColor> = { "*": "yellow", "^": "cyan", "~": "red" };
const MARKER_RE = /([*^~])([^*^~]+)\1/g;

/** Texte sans les marqueurs de couleur. */
export const plainText = (text: string) => text.replace(MARKER_RE, "$2");

export type Segment = { text: string; color: NeonColor | null };

/** Découpe un texte en segments colorés / non colorés. */
export const segments = (text: string): Segment[] => {
  const out: Segment[] = [];
  let last = 0;
  let mt: RegExpExecArray | null;
  MARKER_RE.lastIndex = 0;
  while ((mt = MARKER_RE.exec(text))) {
    if (mt.index > last) out.push({ text: text.slice(last, mt.index), color: null });
    out.push({ text: mt[2], color: MARKERS[mt[1]] });
    last = mt.index + mt[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), color: null });
  return out;
};

export type DisplayWord = {
  text: string;
  /** Couleur du mot s'il est surligné. */
  color: NeonColor | null;
  /** Position du premier caractère dans plainText(text). */
  offset: number;
};

/** Mots affichés, avec leur position dans le texte brut. */
export const displayWords = (text: string): DisplayWord[] => {
  const out: DisplayWord[] = [];
  let plainPos = 0;
  for (const seg of segments(text)) {
    const wre = /\S+/g;
    let w: RegExpExecArray | null;
    while ((w = wre.exec(seg.text))) out.push({ text: w[0], color: seg.color, offset: plainPos + w.index });
    plainPos += seg.text.length;
  }
  return out;
};

/** Tokens séparés par des espaces, avec position (pour un texte brut quelconque). */
export const spaceTokens = (text: string) => {
  const out: { text: string; offset: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push({ text: m[0], offset: m.index });
  return out;
};

/** Normalise un mot pour la recherche d'un repère (minuscules, sans ponctuation). */
export const normWord = (w: string) =>
  w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
