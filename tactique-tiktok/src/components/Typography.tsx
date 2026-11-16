import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_DISPLAY, neon, SAFE } from "../theme";
import type { ChapterDef, PillDef, SubtitleDef, TitleCardDef, PlacedVoiceLine } from "../types";
import { displayWords } from "../lib/words";
import { parseHighlights, visibility } from "../lib/timeline";

const glow = (c: string, s = 18) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}55`;

/** Texte avec mots *surlignés* dans une couleur d'accent. */
const Highlighted: React.FC<{ text: string; accent: string; base?: string }> = ({ text, accent, base = "#fff" }) => (
  <>
    {parseHighlights(text).map((s, i) => (
      <span key={i} style={{ color: s.hl ? accent : base }}>
        {s.text}
      </span>
    ))}
  </>
);

/** Pilule inclinée en haut de l'écran (ex: "ILS COURENT *DANS LE VIDE*"). */
export const TopPill: React.FC<{ def: PillDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.25, 0.25);
  if (vis <= 0) return null;
  const enter = spring({ frame: frame - def.from * fps, fps, config: { damping: 14, stiffness: 160 } });
  const color = neon(def.color);
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 40,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: vis,
        transform: `translateY(${(1 - enter) * -40}px) scale(${0.85 + 0.15 * enter})`,
      }}
    >
      <div
        style={{
          transform: "skewX(-10deg)",
          background: "rgba(6,14,26,0.92)",
          border: `3px solid ${color}`,
          boxShadow: glow(color, 10),
          padding: "10px 28px",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            transform: "skewX(10deg)",
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <Highlighted text={def.text} accent={color} />
        </div>
      </div>
    </div>
  );
};

/** Grande bannière de chapitre inclinée qui entre par la gauche et ressort par la droite. */
export const ChapterBanner: React.FC<{ def: ChapterDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = def.duration ?? 2.6;
  const t = frame / fps - def.from;
  if (t < 0 || t > dur) return null;
  const color = neon(def.color);

  const enter = spring({ frame: frame - def.from * fps, fps, config: { damping: 16, stiffness: 140, mass: 0.9 } });
  const exit = interpolate(t, [dur - 0.4, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const x = (1 - enter) * -1200 + exit * 1300;
  const numberReveal = interpolate(t, [0.15, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
      {/* Voile sombre derrière la carte */}
      <div
        style={{
          position: "absolute",
          inset: "-200px 0",
          background: "linear-gradient(180deg, transparent, rgba(3,8,16,0.75) 35%, rgba(3,8,16,0.75) 65%, transparent)",
          opacity: enter * (1 - exit),
        }}
      />
      <div
        style={{
          transform: `translateX(${x}px) skewX(-8deg) rotate(-2deg)`,
          width: 900,
          background: `linear-gradient(135deg, rgba(10,22,38,0.97), rgba(6,14,26,0.97)), repeating-linear-gradient(0deg, transparent 0 3px, ${color}10 3px 4px)`,
          border: `4px solid ${color}`,
          borderRadius: 18,
          boxShadow: `${glow(color, 22)}, inset 0 0 40px ${color}22`,
          padding: "34px 44px 30px",
          position: "relative",
        }}
      >
        <div style={{ transform: "skewX(8deg)", display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 22, letterSpacing: 4, color }}>CHAPITRE</div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: 150,
                lineHeight: 0.95,
                color: "transparent",
                WebkitTextStroke: `4px ${color}`,
                filter: `drop-shadow(0 0 10px ${color})`,
                clipPath: `inset(0 ${(1 - numberReveal) * 100}% 0 0)`,
              }}
            >
              {def.number}
            </div>
          </div>
          <div style={{ width: 4, alignSelf: "stretch", background: color, boxShadow: glow(color, 8), opacity: 0.9 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, lineHeight: 1.02, color: "#fff", textTransform: "uppercase" }}>
              {def.title}
            </div>
            {def.subtitle && (
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 28, letterSpacing: 2, color, marginTop: 10, textTransform: "uppercase" }}>
                {def.subtitle}
              </div>
            )}
          </div>
        </div>
        {def.tags && (
          <div style={{ transform: "skewX(8deg)", display: "flex", gap: 16, marginTop: 24 }}>
            {def.tags.map((tag, i) => {
              const tp = spring({ frame: frame - (def.from + 0.35 + i * 0.12) * fps, fps, config: { damping: 12 } });
              return (
                <div
                  key={tag}
                  style={{
                    background: color,
                    color: "#08111d",
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 900,
                    fontSize: 26,
                    padding: "8px 18px",
                    borderRadius: 8,
                    textTransform: "uppercase",
                    transform: `scale(${tp})`,
                    boxShadow: glow(color, 8),
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

type Word = { text: string; hl: boolean };

const chunkWords = (words: Word[], maxChars = 15, maxWords = 3): Word[][] => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  let len = 0;
  for (const w of words) {
    const add = w.text.length + (cur.length ? 1 : 0);
    if (cur.length && (len + add > maxChars || cur.length >= maxWords)) {
      chunks.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(w);
    len += w.text.length + (cur.length > 1 ? 1 : 0);
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

/**
 * Sous-titres cinétiques : la phrase est découpée en groupes de 1-3 mots. Si une voix off est
 * générée, chaque groupe apparaît exactement quand son premier mot est prononcé ; sinon les
 * groupes sont répartis sur [from, to] au prorata de leur longueur.
 * Mots *surlignés* en jaune sur plaque inclinée.
 */
export const KineticSubtitles: React.FC<{ items: SubtitleDef[]; voice?: PlacedVoiceLine[] }> = ({ items, voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Fenêtre d'affichage de chaque réplique (étendue à la durée réelle de l'audio si besoin)
  const windows = items.map((s, i) => {
    const v = voice?.find((l) => l.index === i);
    const next = items[i + 1]?.from ?? Infinity;
    const from = v ? v.start : s.from;
    const to = v ? Math.min(Math.max(s.to, v.start + v.duration + 0.25), next) : s.to;
    return { from, to, v };
  });
  const curIdx = windows.findIndex((w) => t >= w.from && t < w.to);
  if (curIdx < 0) return null;
  const cur = items[curIdx];
  const { from, to, v } = windows[curIdx];

  // Mots (avec index d'origine pour le calage), ponctuation isolée collée au mot précédent
  type W = Word & { i: number };
  const words = displayWords(cur.text.toUpperCase()).reduce<W[]>((acc, w, i) => {
    if (/^[.,:;!?…]+$/.test(w.text) && acc.length) {
      acc[acc.length - 1] = { ...acc[acc.length - 1], text: acc[acc.length - 1].text + w.text };
    } else acc.push({ text: w.text, hl: w.hl, i });
    return acc;
  }, []);
  const chunks = chunkWords(words) as W[][];

  let starts: number[];
  if (v?.wordStarts) {
    starts = chunks.map((c) => v.start + v.wordStarts![c[0].i]);
  } else {
    const end = v ? v.start + v.duration : to;
    const weights = chunks.map((c) => c.reduce((s, w) => s + w.text.length, 0) + 4);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = from;
    starts = weights.map((w) => {
      const st = acc;
      acc += ((end - from) * w) / total;
      return st;
    });
  }
  let idx = 0;
  for (let i = 0; i < chunks.length; i++) if (t >= starts[i]) idx = i;
  const chunk = chunks[idx];
  const start = Math.max(from, starts[idx]);
  const pop = spring({ frame: frame - Math.round(start * fps), fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: cur.y ?? SAFE.subtitleY,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 22px",
        transform: `scale(${0.7 + 0.3 * pop}) translateY(${(1 - pop) * 24}px)`,
        opacity: Math.min(1, pop * 2),
      }}
    >
      {chunk.map((w, i) => (
        <span
          key={i}
          style={{
            position: "relative",
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 84,
            lineHeight: 1.1,
            color: w.hl ? COLORS.yellow : "#fff",
            WebkitTextStroke: "3px #000",
            paintOrder: "stroke fill",
            textShadow: "0 6px 0 #000, 0 10px 22px rgba(0,0,0,0.85)",
            padding: w.hl ? "0 10px" : 0,
          }}
        >
          {w.hl && (
            <span
              style={{
                position: "absolute",
                inset: "14px -2px 6px",
                background: "rgba(8,14,24,0.85)",
                transform: "skewX(-12deg)",
                borderBottom: `5px solid ${COLORS.yellow}`,
                boxShadow: `0 6px 18px ${COLORS.yellow}55`,
                zIndex: -1,
              }}
            />
          )}
          {w.text}
        </span>
      ))}
    </div>
  );
};

/** Carte titre d'accroche (ex: "4-3-3 / VS / 4-4-2" + pilule). */
export const TitleCard: React.FC<{ def: TitleCardDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.2, 0.45);
  if (vis <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: vis,
      }}
    >
      {def.lines.map((l, i) => {
        const s = spring({ frame: frame - (def.from + 0.15 + i * 0.22) * fps, fps, config: { damping: 10, stiffness: 170 } });
        const c = neon(l.color);
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontStyle: l.size && l.size < 100 ? "italic" : "normal",
              fontSize: l.size ?? 170,
              lineHeight: 1,
              color: c,
              textShadow: `${glow(c, 16)}, 0 8px 0 #000`,
              WebkitTextStroke: "2px rgba(0,0,0,0.6)",
              transform: `scale(${s}) translateY(${(1 - s) * 60}px)`,
              letterSpacing: -2,
            }}
          >
            {l.text}
          </div>
        );
      })}
      {def.pill && (
        <div style={{ marginTop: 34 }}>
          <TopPillInline text={def.pill} start={def.from + 0.9} />
        </div>
      )}
    </div>
  );
};

const TopPillInline: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start * fps, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        transform: `skewX(-10deg) scale(${s})`,
        border: `3px solid ${COLORS.cyan}`,
        background: "rgba(6,14,26,0.92)",
        boxShadow: glow(COLORS.cyan, 10),
        padding: "12px 30px",
        borderRadius: 6,
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        fontSize: 36,
        color: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ transform: "skewX(10deg)" }}>
        <Highlighted text={text} accent={COLORS.cyan} />
      </div>
    </div>
  );
};
