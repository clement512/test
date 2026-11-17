import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ANTON, BARLOW, C, clamp, easeInOut, prog, SERIF } from "./theme";

/* ------------------------------------------------------------------ */
/* Texte enrichi : *doré* et ~rouge~                                   */
/* ------------------------------------------------------------------ */
export const Rich: React.FC<{ text: string; gold?: string; red?: string }> = ({ text, gold = C.gold, red = C.red }) => {
  const parts = text.split(/(\*[^*]+\*|~[^~]+~)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") ? (
          <span key={i} style={{ color: gold }}>
            {p.slice(1, -1)}
          </span>
        ) : p.startsWith("~") ? (
          <span key={i} style={{ color: red }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Effets sonores                                                      */
/* ------------------------------------------------------------------ */
export type SfxName = "whoosh" | "softWhoosh" | "pop" | "impact" | "stamp" | "tick" | "riser" | "softHit";
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({ at, name, volume = 0.35 }) =>
  Number.isFinite(at) ? (
    <Sequence from={Math.max(0, Math.round(at))} layout="none">
      <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
    </Sequence>
  ) : null;

/* ------------------------------------------------------------------ */
/* Mise en page                                                        */
/* ------------------------------------------------------------------ */
/** Zone de contenu, entre l'en-tête et les sous-titres. */
export const Stage: React.FC<{ children: React.ReactNode; gap?: number; top?: number; height?: number }> = ({
  children,
  gap = 40,
  top = 360,
  height = 980,
}) => (
  <AbsoluteFill
    style={{
      top,
      height,
      bottom: "auto",
      left: 70,
      right: 70,
      width: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Couche superposée dans la zone de contenu (pour faire se succéder deux visuels au même endroit). */
export const Layer: React.FC<{ children: React.ReactNode; opacity?: number; gap?: number }> = ({
  children,
  opacity = 1,
  gap = 40,
}) =>
  opacity <= 0.001 ? null : (
    <AbsoluteFill
      style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}
    >
      {children}
    </AbsoluteFill>
  );

export const Appear: React.FC<{
  at: number;
  children: React.ReactNode;
  dy?: number;
  len?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ at, children, dy = 40, len = 14, scale = 1, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, len);
  if (p <= 0) return <div style={{ opacity: 0, ...style }}>{children}</div>;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * dy}px) scale(${scale + (1 - scale) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Typographie                                                         */
/* ------------------------------------------------------------------ */
export const Title: React.FC<{ at: number; text: string; size?: number; sub?: string; align?: "center" | "left" }> = ({
  at,
  text,
  size = 108,
  sub,
  align = "center",
}) => {
  const f = useCurrentFrame();
  const bar = prog(f, at + 6, 18);
  return (
    <Appear at={at} style={{ textAlign: align, width: "100%" }}>
      <div
        style={{
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 1.04,
          color: C.cream,
          textTransform: "uppercase",
          textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          whiteSpace: "pre-line",
        }}
      >
        <Rich text={text} />
      </div>
      <div
        style={{
          height: 6,
          width: 160 * bar,
          background: C.gold,
          margin: align === "center" ? "22px auto 0" : "22px 0 0",
          borderRadius: 3,
        }}
      />
      {sub ? (
        <div style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 40, color: C.muted, marginTop: 16, letterSpacing: 3 }}>
          {sub}
        </div>
      ) : null}
    </Appear>
  );
};

export const Hero: React.FC<{ at: number; text: string; size?: number; sub?: string; color?: string }> = ({
  at,
  text,
  size = 230,
  sub,
  color,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 16);
  const glow = interpolate(f, [at, at + 10, at + 40], [0, 1, 0.45], clamp);
  return (
    <div style={{ opacity: p, transform: `scale(${1.25 - 0.25 * p})`, textAlign: "center" }}>
      <div
        style={{
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: 2,
          whiteSpace: "pre-line",
          color: color ?? C.gold,
          backgroundImage: color ? undefined : `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 55%, ${C.goldDeep} 100%)`,
          WebkitBackgroundClip: color ? undefined : "text",
          WebkitTextFillColor: color ? undefined : "transparent",
          filter: `drop-shadow(0 0 ${30 * glow}px rgba(246,214,143,${0.55 * glow}))`,
        }}
      >
        {text}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: BARLOW,
            fontWeight: 800,
            fontSize: 46,
            color: C.cream,
            letterSpacing: 6,
            marginTop: 14,
            textTransform: "uppercase",
          }}
        >
          <Rich text={sub} />
        </div>
      ) : null}
    </div>
  );
};

export const Chip: React.FC<{ at: number; text: string; tone?: "gold" | "red" | "ghost" | "solid"; size?: number }> = ({
  at,
  text,
  tone = "gold",
  size = 40,
}) => {
  const border = tone === "red" ? C.red : tone === "ghost" ? "rgba(242,232,213,0.35)" : C.gold;
  const bg = tone === "solid" ? C.gold : tone === "red" ? "rgba(217,87,63,0.14)" : "rgba(217,171,79,0.10)";
  const color = tone === "solid" ? C.bg : tone === "red" ? "#f3b4a6" : tone === "ghost" ? C.cream : C.goldHi;
  return (
    <Appear at={at} dy={24} scale={0.9}>
      <div
        style={{
          display: "inline-block",
          fontFamily: BARLOW,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: 3,
          textTransform: "uppercase",
          color,
          background: bg,
          border: `3px solid ${border}`,
          borderRadius: 999,
          padding: `${size * 0.22}px ${size * 0.7}px`,
          textAlign: "center",
          maxWidth: 940,
        }}
      >
        <Rich text={text} gold={tone === "solid" ? C.bg : C.goldHi} />
      </div>
    </Appear>
  );
};

export const Stamp: React.FC<{
  at: number;
  text: string;
  color?: string;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ at, text, color = C.red, rotate = -7, size = 64, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 7, easeInOut);
  const shake = f < at + 10 ? Math.sin((f - at) * 2.4) * (1 - (f - at) / 10) * 6 : 0;
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg) scale(${2.1 - 1.1 * p}) translateX(${shake}px)`,
        opacity: p,
        fontFamily: ANTON,
        fontSize: size,
        lineHeight: 1.05,
        color,
        border: `7px solid ${color}`,
        borderRadius: 14,
        padding: "8px 28px 4px",
        letterSpacing: 3,
        textAlign: "center",
        textTransform: "uppercase",
        background: "rgba(10,9,7,0.55)",
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const Panel: React.FC<{
  at: number;
  children: React.ReactNode;
  width?: number | string;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ at, children, width = 900, pad = 40, style }) => (
  <Appear at={at} style={{ width }}>
    <div
      style={{
        background: C.panel,
        border: `2px solid ${C.line}`,
        borderRadius: 26,
        padding: pad,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(246,214,143,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  </Appear>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = C.gold,
  size = 34,
}) => (
  <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: size, letterSpacing: 5, color, textTransform: "uppercase" }}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Schémas                                                             */
/* ------------------------------------------------------------------ */
export const Flow: React.FC<{ items: string[]; at: number[]; size?: number; width?: number }> = ({
  items,
  at,
  size = 56,
  width = 820,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width }}>
      {items.map((it, i) => {
        const p = prog(f, at[i], 14);
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <svg width={60} height={90 * 1} style={{ opacity: p }}>
                <line x1={30} y1={8} x2={30} y2={8 + 60 * p} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
                <path d="M14 58 L30 78 L46 58" fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.9 ? 1 : 0} />
              </svg>
            ) : null}
            <div
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + 0.08 * p})`,
                width: "100%",
                textAlign: "center",
                fontFamily: ANTON,
                fontSize: size,
                letterSpacing: 2,
                padding: "24px 30px 20px",
                borderRadius: 22,
                color: last ? C.bg : C.cream,
                background: last ? `linear-gradient(180deg, ${C.goldHi}, ${C.gold})` : C.panel,
                border: `3px solid ${last ? C.goldHi : C.line}`,
                boxShadow: last ? `0 0 50px rgba(217,171,79,${0.35 * p})` : "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              <Rich text={it} gold={last ? C.bg : C.gold} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** « Ce qu'on croit / ce qui est vrai ». */
export const Compare: React.FC<{
  at: number;
  strikeAt: number;
  trueAt: number;
  myth: string;
  truth: string;
  mythLabel?: string;
  truthLabel?: string;
}> = ({ at, strikeAt, trueAt, myth, truth, mythLabel = "CE QU'ON CROIT", truthLabel = "CE QUI EST VRAI" }) => {
  const f = useCurrentFrame();
  const strike = prog(f, strikeAt, 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34, width: 900 }}>
      <Panel at={at} width="100%" style={{ borderColor: "rgba(217,87,63,0.6)" }}>
        <Label color={C.red}>✕ {mythLabel}</Label>
        <div style={{ position: "relative", marginTop: 14 }}>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 70,
              lineHeight: 1.08,
              color: interpolate(strike, [0, 1], [1, 0.45]) > 0.5 ? C.cream : C.muted,
              opacity: 1 - 0.45 * strike,
            }}
          >
            {myth}
          </div>
          <div
            style={{
              position: "absolute",
              left: -6,
              top: "50%",
              height: 8,
              width: `${102 * strike}%`,
              background: C.red,
              borderRadius: 4,
              transform: "rotate(-2deg)",
            }}
          />
        </div>
      </Panel>
      <Panel at={trueAt} width="100%" style={{ borderColor: C.gold, boxShadow: "0 0 60px rgba(217,171,79,0.25)" }}>
        <Label>✓ {truthLabel}</Label>
        <div style={{ fontFamily: ANTON, fontSize: 70, lineHeight: 1.08, color: C.goldHi, marginTop: 14 }}>
          <Rich text={truth} gold={C.cream} />
        </div>
      </Panel>
    </div>
  );
};

export const Profile: React.FC<{ at: number; name: string; role: string; note?: string; width?: number; compact?: boolean }> = ({
  at,
  name,
  role,
  note,
  width = 900,
  compact,
}) => {
  const initials = name
    .split(/[\s-]+/)
    .filter((w) => /^[A-ZÉ]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const d = compact ? 110 : 150;
  return (
    <Panel at={at} width={width} pad={compact ? 28 : 36}>
      <div style={{ display: "flex", alignItems: "center", gap: compact ? 22 : 34 }}>
        <div
          style={{
            width: d,
            height: d,
            flex: "none",
            borderRadius: "50%",
            border: `4px solid ${C.gold}`,
            background: `radial-gradient(circle at 35% 30%, #3a2f1c, ${C.bg})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: d * 0.42,
            color: C.goldHi,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: ANTON, fontSize: compact ? 50 : 66, color: C.cream, lineHeight: 1.02 }}>{name}</div>
          <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: compact ? 30 : 36, color: C.gold, letterSpacing: 3, marginTop: 8 }}>
            {role}
          </div>
          {note ? (
            <div style={{ fontFamily: BARLOW, fontWeight: 600, fontSize: compact ? 28 : 32, color: C.muted, letterSpacing: 2, marginTop: 4 }}>
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
};

export const Question: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - at) / 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <Appear at={at} scale={0.8}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            border: `6px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: ANTON,
            fontSize: 130,
            color: C.goldHi,
            transform: `scale(${pulse})`,
            boxShadow: "0 0 70px rgba(217,171,79,0.35)",
          }}
        >
          ?
        </div>
      </Appear>
      <Title at={at + 6} text={text} size={92} />
      <Chip at={at + 20} text="Réponds en commentaire" tone="solid" size={40} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dessin progressif                                                   */
/* ------------------------------------------------------------------ */
/** Tracé SVG qui se dessine entre `at` et `at + len`. */
export const DrawPath: React.FC<
  { d: string; at: number; len?: number } & React.SVGProps<SVGPathElement>
> = ({ d, at, len = 30, ...rest }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, len, easeInOut);
  if (p <= 0) return null;
  return <path d={d} pathLength={1} strokeDasharray={p < 1 ? `${p} 1` : undefined} fill="none" {...rest} />;
};

export const MapPin: React.FC<{ x: number; y: number; at: number; label: string; sub?: string; side?: "left" | "right" }> = ({
  x,
  y,
  at,
  label,
  sub,
  side = "right",
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  if (p <= 0) return null;
  const ring = ((f - at) % 40) / 40;
  const dx = side === "right" ? 34 : -34;
  return (
    <g opacity={p}>
      <circle cx={x} cy={y} r={14 + 40 * ring} fill="none" stroke={C.goldHi} strokeWidth={3} opacity={1 - ring} />
      <circle cx={x} cy={y} r={14 * p} fill={C.goldHi} />
      <circle cx={x} cy={y} r={26} fill="none" stroke={C.gold} strokeWidth={3} />
      <text
        x={x + dx}
        y={y + 4}
        textAnchor={side === "right" ? "start" : "end"}
        fontFamily={ANTON}
        fontSize={46}
        fill={C.cream}
        style={{ paintOrder: "stroke", stroke: C.bg, strokeWidth: 8 }}
      >
        {label}
      </text>
      {sub ? (
        <text
          x={x + dx}
          y={y + 44}
          textAnchor={side === "right" ? "start" : "end"}
          fontFamily={BARLOW}
          fontWeight={800}
          fontSize={30}
          letterSpacing={3}
          fill={C.gold}
          style={{ paintOrder: "stroke", stroke: C.bg, strokeWidth: 6 }}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/** Cadre de carte : mer sombre, graticule, bordure dorée. */
export const MapFrame: React.FC<{
  at: number;
  width?: number;
  height?: number;
  vb?: string;
  zoom?: [number, number, number, number];
  children: React.ReactNode;
  caption?: string;
}> = ({ at, width = 920, height = 640, vb = "0 0 1000 700", zoom, children, caption }) => {
  const f = useCurrentFrame();
  const z = zoom ? interpolate(f, [zoom[0], zoom[1]], [zoom[2], zoom[3]], { ...clamp, easing: easeInOut }) : 1;
  const [, , vw, vh] = vb.split(" ").map(Number);
  return (
    <Appear at={at} scale={0.96}>
      <div
        style={{
          width,
          height,
          borderRadius: 28,
          overflow: "hidden",
          border: `2px solid ${C.line}`,
          position: "relative",
          background: "radial-gradient(circle at 50% 40%, #1c1810 0%, #0d0b08 75%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        }}
      >
        <svg viewBox={vb} width={width} height={height} preserveAspectRatio="xMidYMid slice">
          <g transform={`translate(${vw / 2} ${vh / 2}) scale(${z}) translate(${-vw / 2} ${-vh / 2})`}>
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={(vw / 10) * i} y1={0} x2={(vw / 10) * i} y2={vh} stroke="rgba(217,171,79,0.08)" strokeWidth={2} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(vh / 7) * i} x2={vw} y2={(vh / 7) * i} stroke="rgba(217,171,79,0.08)" strokeWidth={2} />
            ))}
            {children}
          </g>
        </svg>
        {caption ? (
          <div
            style={{
              position: "absolute",
              left: 26,
              bottom: 20,
              fontFamily: BARLOW,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 4,
              color: C.muted,
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    </Appear>
  );
};
