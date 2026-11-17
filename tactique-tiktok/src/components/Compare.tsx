import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_DISPLAY, neon } from "../theme";
import type { CompareDef, ComparePanel } from "../types";
import { visibility } from "../lib/timeline";

const glow = (c: string, s = 18) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}55`;

const W = 440;
const H = 640;

/** Mini-terrain avec la formation en points. */
const Panel: React.FC<{ p: ComparePanel; start: number; side: "left" | "right" }> = ({ p, start, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = neon(p.color);
  const enter = spring({ frame: frame - start * fps, fps, config: { damping: 14, stiffness: 140 } });
  const sx = (x: number) => 20 + (x / 68) * (W - 40);
  const sy = (y: number) => 20 + (y / 105) * (H - 40);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateX(${(1 - enter) * (side === "left" ? -500 : 500)}px)`,
        opacity: Math.min(1, enter * 1.5),
      }}
    >
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, color: c, textShadow: `${glow(c, 12)}, 0 6px 0 #000`, marginBottom: 14 }}>
        {p.title}
      </div>
      <div
        style={{
          width: W,
          height: H,
          borderRadius: 18,
          background: "rgba(6,14,26,0.95)",
          border: `4px solid ${c}`,
          boxShadow: `${glow(c, 14)}, inset 0 0 30px ${c}22`,
          position: "relative",
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g stroke={COLORS.cyan} strokeOpacity={0.55} strokeWidth={2.5} fill="none">
            <rect x={20} y={20} width={W - 40} height={H - 40} rx={4} />
            <line x1={20} y1={H / 2} x2={W - 20} y2={H / 2} />
            <circle cx={W / 2} cy={H / 2} r={46} />
            <rect x={W * 0.25} y={20} width={W * 0.5} height={78} />
            <rect x={W * 0.25} y={H - 98} width={W * 0.5} height={78} />
          </g>
          {p.dots.map((d, i) => {
            const s = spring({ frame: frame - (start + 0.25 + i * 0.04) * fps, fps, config: { damping: 10 } });
            return (
              <g key={i} transform={`translate(${sx(d.x)} ${sy(d.y)}) scale(${s})`}>
                <circle r={17} fill="#0A1626" stroke={c} strokeWidth={5} />
              </g>
            );
          })}
        </svg>
      </div>
      {p.subtitle && (
        <div
          style={{
            marginTop: 18,
            transform: "skewX(-10deg)",
            border: `3px solid ${c}`,
            background: "rgba(6,14,26,0.92)",
            padding: "8px 22px",
            borderRadius: 6,
            boxShadow: glow(c, 8),
          }}
        >
          <div style={{ transform: "skewX(10deg)", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 30, color: "#fff", textTransform: "uppercase" }}>
            {p.subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

/** Écran partagé : deux formations côte à côte + légende en gros. */
export const Compare: React.FC<{ def: CompareDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.3, 0.35);
  if (vis <= 0) return null;
  const capAt = def.captionAt ?? def.from + 0.8;
  const cap = spring({ frame: frame - capAt * fps, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const vsPop = interpolate(frame / fps - def.from, [0.4, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <AbsoluteFill style={{ background: "rgba(3,8,16,0.86)" }} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <Panel p={def.left} start={def.from} side="left" />
        <Panel p={def.right} start={def.from + 0.15} side="right" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 70,
          color: "#fff",
          opacity: vsPop,
          transform: `scale(${0.5 + 0.5 * vsPop})`,
          textShadow: "0 6px 0 #000",
        }}
      >
        VS
      </div>
      {def.caption && cap > 0.01 && (
        <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              transform: `rotate(-3deg) scale(${interpolate(cap, [0, 1], [2, 1])})`,
              opacity: Math.min(1, cap * 3),
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: Math.min(92, Math.floor(1500 / def.caption.length)),
              color: neon(def.captionColor ?? "yellow"),
              WebkitTextStroke: "4px #050a12",
              paintOrder: "stroke fill",
              textShadow: `${glow(neon(def.captionColor ?? "yellow"), 14)}, 0 8px 0 #000`,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            {def.caption}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
