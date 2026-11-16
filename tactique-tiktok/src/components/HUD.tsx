import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_MONO } from "../theme";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** Overlay permanent : titre, timecode REC dynamique, crochets de viseur, barre de progression. */
export const HUD: React.FC<{ title: string; prefix?: string }> = ({ title, prefix = "ANALYSE TACTIQUE" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();

  const totalSec = frame / fps;
  const mm = pad(totalSec / 60);
  const ss = pad(totalSec % 60);
  const ff = pad(frame % fps);
  const blink = Math.floor(frame / (fps / 2)) % 2 === 0;
  const progress = frame / (durationInFrames - 1);

  const corner = 64;
  const inset = 36;
  const stroke = 5;
  const cornerStyle = (pos: "tl" | "tr" | "bl" | "br"): React.CSSProperties => ({
    position: "absolute",
    width: corner,
    height: corner,
    [pos[0] === "t" ? "top" : "bottom"]: inset,
    [pos[1] === "l" ? "left" : "right"]: inset,
    [pos[0] === "t" ? "borderTop" : "borderBottom"]: `${stroke}px solid ${COLORS.cyan}`,
    [pos[1] === "l" ? "borderLeft" : "borderRight"]: `${stroke}px solid ${COLORS.cyan}`,
    filter: `drop-shadow(0 0 8px ${COLORS.cyan})`,
    opacity: 0.9,
  });

  const text: React.CSSProperties = {
    position: "absolute",
    top: 76,
    fontFamily: FONT_MONO,
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: 2,
    color: COLORS.cyan,
    textShadow: `0 0 10px ${COLORS.cyan}88`,
    opacity: 0.85,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Lignes de balayage très légères */}
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 5px)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />
      {/* Vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(2,6,12,0.75) 100%)" }} />

      {(["tl", "tr", "bl", "br"] as const).map((p) => (
        <div key={p} style={cornerStyle(p)} />
      ))}

      <div style={{ ...text, left: 80 }}>
        {prefix} · {title}
      </div>
      <div style={{ ...text, right: 80, display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: COLORS.red,
            boxShadow: `0 0 12px ${COLORS.red}`,
            opacity: blink ? 1 : 0.2,
          }}
        />
        REC {mm}:{ss}:{ff}
      </div>

      {/* Barre de progression */}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width, background: "rgba(0,240,255,0.08)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 8,
          width: width * progress,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.yellow})`,
          boxShadow: `0 0 14px ${COLORS.cyan}`,
        }}
      />
    </AbsoluteFill>
  );
};
