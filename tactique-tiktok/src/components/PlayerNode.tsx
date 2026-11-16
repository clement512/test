import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_DISPLAY, neon, PLAYER_RADIUS, toPx } from "../theme";
import type { NeonColor, PlayerDef } from "../types";
import { getPlayerPos, springProgress } from "../lib/timeline";
import { useScript } from "../lib/ScriptContext";

type Props = {
  player: PlayerDef;
  hasBall?: boolean;
  isHighlighted?: boolean;
  highlightColor?: NeonColor;
  /** 0 → 1 : opacité globale (ex: atténuation pendant l'outro). */
  dim?: number;
};

/**
 * Pion de joueur. Sa position est interpolée (spring) à partir des keyframes `moves` du scénario.
 * - Équipe A : contour jaune néon + numéro.
 * - Équipe B : contour rose néon.
 * - hasBall : halo lumineux + petit ballon blanc accolé.
 * - isHighlighted : anneaux pulsants.
 */
export const PlayerNode: React.FC<Props> = ({
  player,
  hasBall = false,
  isHighlighted = false,
  highlightColor,
  dim = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();

  const pos = toPx(getPlayerPos(script, player.id, frame, fps));
  const color = player.team === "A" ? COLORS.yellow : COLORS.red;
  const appear = springProgress(frame, fps, player.appearAt ?? 0, 0.7, 12);
  if (appear <= 0.001) return null;

  const R = PLAYER_RADIUS;
  const hl = highlightColor ? neon(highlightColor) : color;
  const pulse = (frame % Math.round(fps * 1.1)) / (fps * 1.1); // 0 → 1 en boucle
  const breathe = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 0.9);

  return (
    <g
      transform={`translate(${pos.x} ${pos.y}) scale(${appear})`}
      opacity={Math.min(1, appear * 1.4) * dim}
    >
      {/* Halo du porteur de balle */}
      {hasBall && (
        <>
          <circle r={R * 2.1} fill={color} opacity={0.10 + 0.06 * breathe} filter="url(#glow-lg)" />
          <circle r={R * 1.55} fill="none" stroke={color} strokeWidth={3} opacity={0.55} filter="url(#glow-md)" />
        </>
      )}

      {/* Anneaux pulsants (mise en évidence) */}
      {isHighlighted && (
        <>
          {[0, 0.5].map((off) => {
            const p = (pulse + off) % 1;
            return (
              <circle
                key={off}
                r={R * (1.2 + p * 1.4)}
                fill="none"
                stroke={hl}
                strokeWidth={5 * (1 - p) + 1}
                opacity={(1 - p) * 0.9}
                filter="url(#glow-sm)"
              />
            );
          })}
          <circle r={R * 1.32} fill="none" stroke={hl} strokeWidth={3} filter="url(#glow-sm)" />
        </>
      )}

      {/* Anneau externe discret */}
      <circle r={R * 1.18} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} />
      {/* Corps du pion */}
      <circle r={R} fill={COLORS.playerFill} stroke={color} strokeWidth={5} filter="url(#glow-md)" />
      <circle r={R} fill={COLORS.playerFill} fillOpacity={0.85} />
      <circle r={R - 1} fill="none" stroke={color} strokeWidth={4.5} />
      {player.number !== undefined ? (
        <text
          y={1}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_DISPLAY}
          fontWeight={800}
          fontSize={R * 0.95}
          fill={color}
        >
          {player.number}
        </text>
      ) : (
        <circle r={R * 0.42} fill={color} opacity={0.18} />
      )}

      {/* Ballon accolé */}
      {hasBall && <BallDot x={R * 0.95} y={-R * 0.55} />}
    </g>
  );
};

export const BallDot: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={11} fill="#fff" opacity={0.5} filter="url(#glow-md)" />
    <circle r={9.5} fill="#fff" stroke="#05080d" strokeWidth={3} />
    <circle r={3.2} fill="#05080d" />
  </g>
);

/** Ballon en vol (pendant une passe) : point blanc + traînée. */
export const BallInFlight: React.FC<{ x: number; y: number; fromX: number; fromY: number }> = ({
  x,
  y,
  fromX,
  fromY,
}) => {
  const dx = x - fromX;
  const dy = y - fromY;
  const len = Math.hypot(dx, dy) || 1;
  const tx = x - (dx / len) * Math.min(len, 90);
  const ty = y - (dy / len) * Math.min(len, 90);
  return (
    <g>
      <line x1={tx} y1={ty} x2={x} y2={y} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.35} filter="url(#glow-md)" />
      <BallDot x={x} y={y} />
    </g>
  );
};
