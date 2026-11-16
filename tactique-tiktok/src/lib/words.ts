/**
 * Découpage des sous-titres en mots — partagé entre le rendu (KineticSubtitles) et le
 * générateur de voix off (scripts/voiceover.ts) pour que le calage mot à mot corresponde.
 */

/** Texte sans les marqueurs *de mise en couleur*. */
export const plainText = (text: string) => text.replace(/\*/g, "");

export type DisplayWord = {
  text: string;
  hl: boolean;
  /** Position du premier caractère dans plainText(text). */
  offset: number;
};

/** Mots affichés, avec leur position dans le texte brut. */
export const displayWords = (text: string): DisplayWord[] => {
  const out: DisplayWord[] = [];
  let plainPos = 0;
  const re = /\*([^*]+)\*/g;
  const segs: { text: string; hl: boolean }[] = [];
  let last = 0;
  let mt: RegExpExecArray | null;
  while ((mt = re.exec(text))) {
    if (mt.index > last) segs.push({ text: text.slice(last, mt.index), hl: false });
    segs.push({ text: mt[1], hl: true });
    last = mt.index + mt[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), hl: false });

  for (const seg of segs) {
    const wre = /\S+/g;
    let w: RegExpExecArray | null;
    while ((w = wre.exec(seg.text))) {
      out.push({ text: w[0], hl: seg.hl, offset: plainPos + w.index });
    }
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
