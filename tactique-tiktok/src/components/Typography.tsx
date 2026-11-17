import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_DISPLAY, neon, SAFE } from "../theme";
import type { AgendaDef, ChapterDef, NeonColor, PillDef, PlacedVoiceLine, SubtitleDef, TitleCardDef } from "../types";
import { displayWords, segments } from "../lib/words";
import { visibility } from "../lib/timeline";

const glow = (c: string, s = 18) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}55`;

/** Texte avec segments colorés (*jaune*, ^cyan^, ~rose~) ; `accent` remplace le jaune par défaut. */
const Highlighted: React.FC<{ text: string; accent?: string; base?: string }> = ({ text, accent, base = "#fff" }) => (
  <>
    {segments(text).map((s, i) => (
      <span key={i} style={{ color: s.color ? (s.color === "yellow" && accent ? accent : neon(s.color)) : base }}>
        {s.text}
      </span>
    ))}
  </>
);

/** Pilule inclinée en haut de l'écran (ex: "ILS COURENT *DANS LE VIDE*"). */
export const TopPill: React.FC<{ def: PillDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.2, 0.25);
  if (vis <= 0) return null;
  const enter = spring({ frame: frame - def.from * fps, fps, config: { damping: 14, stiffness: 180 } });
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
        transform: `translateY(${(1 - enter) * -30}px) scale(${0.85 + 0.15 * enter})`,
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

/**
 * Bandeau de chapitre : bande sombre inclinée qui traverse l'écran depuis la gauche,
 * gros numéro "01" en contour italique + titre, avec glitch RVB à l'entrée et à la sortie.
 */
export const ChapterBanner: React.FC<{ def: ChapterDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const dur = def.duration ?? 1.6;
  const t = frame / fps - def.from;
  if (t < 0 || t > dur) return null;
  const color = neon(def.color);

  const enter = interpolate(t, [0, 0.28], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const exit = interpolate(t, [dur - 0.25, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const x = (1 - enter) * -width + exit * width * 0.9;
  // Glitch : décalage RVB et tranches au début et à la fin
  const glitchAmt = Math.max(1 - t / 0.3, exit, 0) * (0.5 + 0.5 * Math.sin(frame * 2.7));
  const jx = Math.sin(frame * 1.9) * 18 * glitchAmt;
  const textReveal = interpolate(t, [0.12, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const content = (dx: number, tint?: string) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        gap: 40,
        paddingLeft: 60,
        transform: `translateX(${dx}px)`,
        mixBlendMode: tint ? "screen" : undefined,
        opacity: tint ? 0.7 : 1,
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `4px ${tint ?? color}`,
          filter: tint ? undefined : `drop-shadow(0 0 10px ${color})`,
        }}
      >
        {def.number}
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: def.title.length > 18 ? 52 : 64,
          color: tint ?? "#fff",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          clipPath: `inset(0 ${(1 - textReveal) * 100}% 0 0)`,
        }}
      >
        {def.title}
      </div>
    </div>
  );

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 250, transform: "rotate(-2deg)" }}>
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: 0,
          bottom: 0,
          transform: `translateX(${x}px) skewX(-10deg)`,
          background: "linear-gradient(90deg, rgba(4,10,20,0.97) 0%, rgba(8,18,32,0.95) 70%, rgba(8,18,32,0.0) 100%)",
          borderTop: `2px solid ${color}55`,
          borderBottom: `2px solid ${color}55`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, width: 14, background: color, boxShadow: glow(color, 12) }} />
        <div style={{ position: "absolute", inset: 0, transform: "skewX(10deg)" }}>
          {glitchAmt > 0.05 && content(jx - 10, COLORS.red)}
          {glitchAmt > 0.05 && content(-jx + 10, COLORS.cyan)}
          {content(0)}
        </div>
        {/* Tranches de glitch */}
        {glitchAmt > 0.2 &&
          [0.2, 0.55, 0.8].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${p * 100}%`,
                height: 10 + i * 6,
                background: i % 2 ? COLORS.cyan : COLORS.red,
                opacity: 0.35 * glitchAmt,
                transform: `translateX(${jx * (i + 1)}px)`,
              }}
            />
          ))}
      </div>
    </div>
  );
};

/** Sommaire : les chapitres empilés en pilules inclinées, apparition en cascade. */
export const Agenda: React.FC<{ def: AgendaDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.15, 0.3);
  if (vis <= 0) return null;
  const step = def.stagger ?? 0.22;
  return (
    <div style={{ position: "absolute", top: def.y ?? 360, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: vis }}>
      {def.items.map((it, i) => {
        const s = spring({ frame: frame - (def.from + i * step) * fps, fps, config: { damping: 13, stiffness: 190 } });
        const c = neon(it.color);
        return (
          <div
            key={i}
            style={{
              transform: `translateX(${(1 - s) * -400}px) skewX(-10deg)`,
              opacity: Math.min(1, s * 1.5),
              border: `4px solid ${c}`,
              background: "rgba(6,14,26,0.94)",
              boxShadow: glow(c, 12),
              padding: "12px 34px",
              borderRadius: 6,
            }}
          >
            <div style={{ transform: "skewX(10deg)", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 46, color: "#fff", whiteSpace: "nowrap", textTransform: "uppercase" }}>
              <span style={{ color: c }}>{it.number}</span> · {it.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Mot-tampon : gros mot incliné qui claque au milieu de l'écran, souligné, avec glitch à l'entrée. */
export const KeywordStamp: React.FC<{ text: string; color: NeonColor; from: number; to: number; y?: number; rotate?: number }> = ({
  text,
  color,
  from,
  to,
  y = 560,
  rotate = -3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < from || t > to) return null;
  const c = neon(color);
  const slam = spring({ frame: frame - from * fps, fps, config: { damping: 9, stiffness: 260, mass: 0.7 } });
  const out = interpolate(t, [to - 0.2, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(slam, [0, 1], [2.2, 1]);
  const glitch = Math.max(0, 1 - (t - from) / 0.18);
  const under = interpolate(t - from, [0.08, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Taille adaptée pour que le mot tienne dans la largeur (~940 px) une fois incliné
  const size = Math.min(128, Math.floor(900 / (text.length * 0.8)));

  const word = (dx: number, tint?: string) => (
    <div
      style={{
        position: tint ? "absolute" : "relative",
        inset: tint ? 0 : undefined,
        transform: `translateX(${dx}px)`,
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color: tint ?? c,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        WebkitTextStroke: tint ? undefined : "4px #050a12",
        paintOrder: "stroke fill",
        textShadow: tint ? undefined : `${glow(c, 16)}, 0 10px 0 rgba(0,0,0,0.85)`,
        mixBlendMode: tint ? "screen" : undefined,
        opacity: tint ? 0.75 * glitch : 1,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );

  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out * Math.min(1, slam * 3) }}>
      <div style={{ position: "relative", transform: `rotate(${rotate}deg) scale(${scale})` }}>
        {glitch > 0.02 && word(-14 * glitch, COLORS.red)}
        {glitch > 0.02 && word(14 * glitch, COLORS.cyan)}
        {word(0)}
        <div
          style={{
            position: "absolute",
            left: "-4%",
            bottom: -18,
            height: 10,
            width: `${108 * under}%`,
            background: c,
            boxShadow: glow(c, 10),
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
};

type Word = { text: string; color: NeonColor | null };

const chunkWords = <W extends Word>(words: W[], maxChars = 15, maxWords = 3): W[][] => {
  const chunks: W[][] = [];
  let cur: W[] = [];
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
 * Sous-titres cinétiques : groupes de 1-3 mots qui apparaissent quand leur premier mot est
 * prononcé (minutage ElevenLabs), sinon répartis au prorata. Mots colorés (*jaune*, ^cyan^,
 * ~rose~) soulignés d'une barre lumineuse de leur couleur.
 */
export const KineticSubtitles: React.FC<{ items: SubtitleDef[]; voice?: PlacedVoiceLine[] }> = ({ items, voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const windows = items.map((s, i) => {
    const v = voice?.find((l) => l.index === i);
    const next = items[i + 1]?.from ?? Infinity;
    const from = v ? v.start + v.speechStart : s.from;
    const to = v ? Math.min(Math.max(s.to, v.start + v.duration + 0.25), next) : s.to;
    return { from, to, v };
  });
  const curIdx = windows.findIndex((w) => t >= w.from && t < w.to);
  if (curIdx < 0) return null;
  const cur = items[curIdx];
  const { from, to, v } = windows[curIdx];

  type W = Word & { i: number };
  const words = displayWords(cur.text.toUpperCase()).reduce<W[]>((acc, w, i) => {
    if (/^[.,:;!?…]+$/.test(w.text) && acc.length) {
      // Ponctuation isolée collée au mot précédent (espace insécable avant : ; ! ? à la française)
      const sep = /^[:;!?]/.test(w.text) ? "\u00A0" : "";
      acc[acc.length - 1] = { ...acc[acc.length - 1], text: acc[acc.length - 1].text + sep + w.text };
    } else acc.push({ text: w.text, color: w.color, i });
    return acc;
  }, []);
  const chunks = chunkWords(words);

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
  const pop = spring({ frame: frame - Math.round(start * fps), fps, config: { damping: 11, stiffness: 240, mass: 0.55 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: cur.y ?? SAFE.subtitleY,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 22px",
        transform: `scale(${0.75 + 0.25 * pop}) translateY(${(1 - pop) * 20}px)`,
        opacity: Math.min(1, pop * 2.5),
      }}
    >
      {chunk.map((w, i) => {
        const c = w.color ? neon(w.color) : null;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 86,
              lineHeight: 1.12,
              color: c ?? "#fff",
              WebkitTextStroke: "3px #000",
              paintOrder: "stroke fill",
              textShadow: c ? `0 0 18px ${c}88, 0 6px 0 #000` : "0 6px 0 #000, 0 10px 22px rgba(0,0,0,0.85)",
            }}
          >
            {w.text}
            {c && (
              <span
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  bottom: 2,
                  height: 9,
                  background: c,
                  transform: `skewX(-14deg) scaleX(${Math.min(1, pop * 1.2)})`,
                  transformOrigin: "left center",
                  boxShadow: glow(c, 8),
                  borderRadius: 3,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};

/** Carte titre d'accroche (ex: "4-3-3 / VS / 4-4-2" + pilule). */
export const TitleCard: React.FC<{ def: TitleCardDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.15, 0.3);
  if (vis <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: vis }}>
      {def.lines.map((l, i) => {
        const s = spring({ frame: frame - (def.from + 0.1 + i * 0.16) * fps, fps, config: { damping: 10, stiffness: 190 } });
        const c = neon(l.color);
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: l.size ?? 150,
              lineHeight: 1.02,
              color: c,
              textShadow: `${glow(c, 14)}, 0 8px 0 #000`,
              WebkitTextStroke: "3px #050a12",
              paintOrder: "stroke fill",
              transform: `scale(${s}) translateY(${(1 - s) * 50}px)`,
            }}
          >
            {l.text}
          </div>
        );
      })}
      {def.pill && (
        <div style={{ marginTop: 26 }}>
          <TopPillInline text={def.pill} start={def.from + 0.55} />
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
        fontSize: 34,
        color: "#fff",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      <div style={{ transform: "skewX(10deg)" }}>
        <Highlighted text={text} accent={COLORS.cyan} />
      </div>
    </div>
  );
};
