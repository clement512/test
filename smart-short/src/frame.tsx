import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, BARLOW, C, clamp, easeInOut, FPS, prog } from "./theme";
import { normWord } from "./lib/words";
import type { Badge, VoiceSegment } from "./episodes/types";

/* ------------------------------------------------------------------ */
/* Contexte de scène : minutage des mots de la réplique                */
/* ------------------------------------------------------------------ */
export type SceneCtx = { seg: VoiceSegment; dur: number };
export const SegmentContext = createContext<SceneCtx | null>(null);

/** Image (locale à la scène) où commence le n-ième mot correspondant. */
export const useCue = () => {
  const ctx = useContext(SegmentContext)!;
  return (word: string, n = 1, offset = 0) => {
    const target = normWord(word);
    let k = 0;
    for (const w of ctx.seg.words) {
      if (normWord(w.w) === target && ++k === n) return Math.round(w.s * FPS) + offset;
    }
    throw new Error(`Mot introuvable dans ${ctx.seg.id} : « ${word} »`);
  };
};
export const useSceneDur = () => useContext(SegmentContext)!.dur;

/* ------------------------------------------------------------------ */
/* Fond                                                                */
/* ------------------------------------------------------------------ */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(f, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 70% at ${50 + 8 * Math.sin(drift * 6)}% 38%, ${C.bg2} 0%, ${C.bg} 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 15% 8%, rgba(217,171,79,0.10), transparent 40%), radial-gradient(circle at 90% 85%, rgba(217,171,79,0.07), transparent 45%)",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {Array.from({ length: 34 }).map((_, i) => {
          const x = random(`x${i}`) * 1080;
          const speed = 0.25 + random(`s${i}`) * 0.6;
          const y = (random(`y${i}`) * 1920 - f * speed * 1.4 + 1920 * 4) % 1920;
          const r = 1.5 + random(`r${i}`) * 3;
          const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / (12 + i) + i));
          return <circle key={i} cx={x + Math.sin(f / 40 + i) * 14} cy={y} r={r} fill={C.goldHi} opacity={tw * 0.5} />;
        })}
      </svg>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Logo SMART SHORT : éclair dans un anneau doré                       */
/* ------------------------------------------------------------------ */
export const BOLT = "M58 8 L26 56 L46 56 L38 92 L74 40 L53 40 Z";
export const Logo: React.FC<{ size: number; draw?: number; glow?: number }> = ({ size, draw = 1, glow = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="lg-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.goldHi} />
        <stop offset="0.55" stopColor={C.gold} />
        <stop offset="1" stopColor={C.goldDeep} />
      </linearGradient>
    </defs>
    <circle
      cx={50}
      cy={50}
      r={45}
      fill="none"
      stroke="url(#lg-gold)"
      strokeWidth={5}
      pathLength={1}
      {...(draw < 1 ? { strokeDasharray: `${draw} 1` } : {})}
      transform="rotate(-90 50 50)"
      style={{ filter: `drop-shadow(0 0 ${6 * glow}px rgba(246,214,143,${glow}))` }}
    />
    <circle cx={50} cy={50} r={38} fill="none" stroke="rgba(217,171,79,0.35)" strokeWidth={1.2} opacity={draw} />
    <path
      d={BOLT}
      fill="url(#lg-gold)"
      opacity={interpolate(draw, [0.55, 1], [0, 1], clamp)}
      transform={`translate(50 50) scale(${interpolate(draw, [0.55, 1], [0.6, 1], clamp)}) translate(-50 -50)`}
      style={{ filter: `drop-shadow(0 0 ${8 * glow}px rgba(246,214,143,${glow}))` }}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* En-tête                                                             */
/* ------------------------------------------------------------------ */
const badgeStyle = (b: Badge): React.CSSProperties => {
  switch (b) {
    case "ÉTABLI":
      return { color: C.goldHi, border: `3px solid ${C.gold}`, background: "rgba(217,171,79,0.12)" };
    case "RAPPORTÉ":
      return { color: C.cream, border: "3px solid rgba(242,232,213,0.5)", background: "rgba(242,232,213,0.06)" };
    case "DISPUTÉ":
    case "MYTHE ?":
      return { color: "#f3b4a6", border: `3px solid ${C.red}`, background: "rgba(217,87,63,0.14)" };
    default:
      return { color: C.bg, border: `3px solid ${C.goldHi}`, background: C.gold };
  }
};

export const Header: React.FC<{
  number: string;
  when: string;
  chapters: { from: number; chapter: string; badge: Badge }[];
  total: number;
  outroFrom: number;
}> = ({ number, when, chapters, total, outroFrom }) => {
  const f = useCurrentFrame();
  const intro = prog(f, 0, 16);
  const hide = 1 - prog(f, outroFrom, 12);
  let idx = 0;
  chapters.forEach((c, i) => {
    if (f >= c.from) idx = i;
  });
  const cur = chapters[idx];
  const sameAsPrev = idx > 0 && chapters[idx - 1].chapter === cur.chapter && chapters[idx - 1].badge === cur.badge;
  const sw = sameAsPrev ? 1 : prog(f, cur.from, 12);
  return (
    <AbsoluteFill style={{ opacity: intro * hide }}>
      <div style={{ position: "absolute", top: 150, left: 70, right: 70, display: "flex", alignItems: "center", gap: 18 }}>
        <Logo size={64} glow={0.4} />
        <div style={{ fontFamily: ANTON, fontSize: 44, color: C.gold, letterSpacing: 4 }}>SMART SHORT</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 32, color: C.muted, letterSpacing: 3 }}>
          ÉPISODE {number} · {when.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 238,
          left: 70,
          right: 70,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: sw,
          transform: `translateX(${(1 - sw) * -30}px)`,
        }}
      >
        <div style={{ width: 8, height: 46, background: C.gold, borderRadius: 4 }} />
        <div
          style={{
            fontFamily: BARLOW,
            fontWeight: 800,
            fontSize: 40,
            color: C.cream,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          {cur.chapter}
        </div>
        <div
          style={{
            fontFamily: BARLOW,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 3,
            padding: "6px 18px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            ...badgeStyle(cur.badge),
          }}
        >
          {cur.badge}
        </div>
      </div>
      <div style={{ position: "absolute", top: 312, left: 70, right: 70, height: 4, background: "rgba(217,171,79,0.15)", borderRadius: 2 }}>
        <div style={{ height: 4, width: `${Math.min(1, f / outroFrom) * 100}%`, background: C.gold, borderRadius: 2 }} />
      </div>
      <span style={{ display: "none" }}>{total}</span>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Sous-titres mot à mot                                               */
/* ------------------------------------------------------------------ */
type Group = { words: { w: string; s: number; gold: boolean }[]; from: number; to: number };

export const buildGroups = (segments: VoiceSegment[], gold: Set<string>): Group[] => {
  const groups: Group[] = [];
  segments.forEach((seg) => {
    let cur: Group["words"] = [];
    const flush = (to: number) => {
      if (cur.length) groups.push({ words: cur, from: cur[0].s, to });
      cur = [];
    };
    seg.words.forEach((w, i) => {
      const s = seg.start + w.s;
      const next = seg.words[i + 1];
      cur.push({ w: w.w, s, gold: gold.has(normWord(w.w)) });
      const len = cur.map((x) => x.w).join(" ").length;
      const endsSentence = /[.,;:!?»]$/.test(w.w);
      if (!next) flush(seg.start + w.e + 0.35);
      else if (endsSentence || cur.length >= 3 || len >= 16) flush(seg.start + next.s);
    });
  });
  // pas de trou entre deux groupes proches
  groups.forEach((g, i) => {
    const n = groups[i + 1];
    if (n && n.from - g.to < 0.3) g.to = n.from;
  });
  return groups;
};

export const Subtitles: React.FC<{ groups: Group[]; hideFrom: number }> = ({ groups, hideFrom }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (f >= hideFrom) return null;
  const g = groups.find((x) => t >= x.from && t < x.to);
  if (!g) return null;
  const local = (t - g.from) * FPS;
  const pop = interpolate(local, [0, 5], [0.86, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ top: 1385, height: 260, bottom: "auto", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
      <div
        style={{
          transform: `scale(${pop})`,
          textAlign: "center",
          fontFamily: BARLOW,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1.02,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {g.words.map((w, i) => {
          const active = t >= w.s;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 12px",
                color: w.gold ? C.goldHi : C.cream,
                opacity: active ? 1 : 0.55,
                textShadow: "0 0 12px rgba(0,0,0,0.9), 0 5px 0 rgba(0,0,0,0.65)",
                WebkitTextStroke: "2px rgba(10,9,7,0.85)",
                paintOrder: "stroke fill",
              }}
            >
              {w.w.replace(/ /g, " ")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Transition de scène                                                 */
/* ------------------------------------------------------------------ */
export const SceneWrap: React.FC<{ dur: number; children: React.ReactNode; last?: boolean }> = ({ dur, children, last }) => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 12);
  const outP = last ? 0 : prog(f, dur - 8, 8, easeInOut);
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `translateY(${(1 - inP) * 28 - outP * 20}px) scale(${1.03 - 0.03 * inP})`,
        filter: outP > 0 ? `blur(${outP * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Outro                                                               */
/* ------------------------------------------------------------------ */
export const Outro: React.FC<{ next?: string }> = ({ next }) => {
  const f = useCurrentFrame();
  const draw = prog(f, 4, 34, easeInOut);
  const txt = prog(f, 26, 16);
  const sub = prog(f, 40, 16);
  const glow = 0.4 + 0.25 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 0, top: -60 }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 44%, rgba(217,171,79,${0.16 * draw}), transparent 45%)` }}
      />
      <Logo size={400} draw={draw} glow={glow} />
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 132,
          letterSpacing: 8,
          marginTop: 40,
          opacity: txt,
          transform: `translateY(${(1 - txt) * 30}px)`,
          backgroundImage: `linear-gradient(180deg, ${C.goldHi}, ${C.gold} 60%, ${C.goldDeep})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SMART SHORT
      </div>
      <div
        style={{
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
          fontFamily: BARLOW,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: 6,
          color: C.cream,
          marginTop: 10,
        }}
      >
        L'HISTOIRE VRAIE, EN COURT
      </div>
      <div
        style={{
          opacity: prog(f, 54, 14),
          marginTop: 56,
          fontFamily: BARLOW,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: 4,
          color: C.bg,
          background: C.gold,
          padding: "14px 44px",
          borderRadius: 999,
        }}
      >
        ABONNE-TOI POUR LA SUITE
      </div>
      {next ? (
        <div
          style={{
            opacity: prog(f, 64, 14),
            marginTop: 34,
            fontFamily: BARLOW,
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: 3,
            color: C.muted,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          PROCHAIN ÉPISODE : <span style={{ color: C.goldHi }}>{next.toUpperCase()}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
