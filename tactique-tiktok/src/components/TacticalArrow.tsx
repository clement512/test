import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY, neon, PLAYER_RADIUS, PX_PER_M, toPx, COLORS } from "../theme";
import type { ArrowDef, Point } from "../types";
import { clamp01, isPlayerAnchor, resolveAnchor, visibility } from "../lib/timeline";
import { useScript } from "../lib/ScriptContext";

const quad = (a: Point, c: Point, b: Point, t: number): Point => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});

const quadLength = (a: Point, c: Point, b: Point) => {
  let len = 0;
  let prev = a;
  for (let i = 1; i <= 24; i++) {
    const p = quad(a, c, b, i / 24);
    len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return len;
};

/**
 * Flèche / ligne de passe tracée progressivement (strokeDashoffset sur un masque),
 * avec option pointillés, pointe, courbure et croix rouge "passe coupée".
 */
export const TacticalArrow: React.FC<{ def: ArrowDef; uid: string }> = ({ def, uid }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();
  const vis = visibility(frame, fps, def, 0.15, 0.3);
  if (vis <= 0) return null;

  const color = neon(def.color);
  const width = def.width ?? 5;
  const draw = Easing.out(Easing.cubic)(
    clamp01((frame / fps - def.from) / (def.drawDuration ?? 0.6)),
  );

  // Extrémités en px, raccourcies si elles pointent sur un pion
  let a = toPx(resolveAnchor(script, def.start, frame, fps));
  let b = toPx(resolveAnchor(script, def.end, frame, fps));
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const pad = PLAYER_RADIUS + 12;
  if (isPlayerAnchor(def.start)) a = { x: a.x + ux * pad, y: a.y + uy * pad };
  if (isPlayerAnchor(def.end)) b = { x: b.x - ux * pad, y: b.y - uy * pad };

  const curvePx = (def.curve ?? 0) * PX_PER_M;
  const mid = { x: (a.x + b.x) / 2 - uy * curvePx, y: (a.y + b.y) / 2 + ux * curvePx };
  const path = `M ${a.x} ${a.y} Q ${mid.x} ${mid.y} ${b.x} ${b.y}`;
  const len = quadLength(a, mid, b);
  const id = `arrow-mask-${uid}`;

  // Pointe orientée selon la tangente en fin de tracé
  const tip = quad(a, mid, b, draw);
  const pre = quad(a, mid, b, Math.max(0, draw - 0.02));
  const ang = (Math.atan2(tip.y - pre.y, tip.x - pre.x) * 180) / Math.PI;
  const showHead = (def.head ?? true) && draw > 0.05;
  const headSize = 14 + width * 1.6;

  // Croix "coupée"
  const cutPop = def.cut
    ? interpolate(frame / fps - def.from, [(def.drawDuration ?? 0.6) * 0.8, (def.drawDuration ?? 0.6) + 0.25], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(2.5)),
      })
    : 0;
  const center = quad(a, mid, b, 0.5);
  const labelPop = def.label
    ? interpolate(frame / fps - def.from, [(def.drawDuration ?? 0.6), (def.drawDuration ?? 0.6) + 0.3], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <g opacity={vis}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
          <path
            d={path}
            fill="none"
            stroke="#fff"
            strokeWidth={width + 12}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - draw)}
          />
        </mask>
      </defs>
      {/* Pas de filtre SVG ici : une ligne parfaitement horizontale/verticale a une bbox de hauteur
          nulle, ce qui ferait disparaître la région du filtre. La lueur est simulée par un sous-trait. */}
      <g mask={`url(#${id})`}>
        <path d={path} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={width * 3.2} strokeLinecap="round" />
        <path d={path} fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={width * 1.8} strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={def.dashed ? `${width * 2.6} ${width * 2.4}` : undefined}
          strokeDashoffset={def.dashed ? -(frame * 0.8) : undefined}
        />
      </g>
      {showHead && (
        <g transform={`translate(${tip.x} ${tip.y}) rotate(${ang})`} filter="url(#glow-sm)">
          <path
            d={`M ${-headSize} ${-headSize * 0.62} L 2 0 L ${-headSize} ${headSize * 0.62} L ${-headSize * 0.72} 0 Z`}
            fill={color}
          />
        </g>
      )}
      {def.cut && cutPop > 0 && (
        <g transform={`translate(${center.x} ${center.y}) scale(${cutPop}) rotate(${(1 - cutPop) * 90})`} filter="url(#glow-md)">
          <circle r={30} fill="#060E1A" opacity={0.8} />
          <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" stroke={COLORS.red} strokeWidth={9} strokeLinecap="round" />
        </g>
      )}
      {def.label && labelPop > 0 && (
        <text
          x={center.x + (def.cut ? (def.labelSide === "left" ? -44 : 44) : 0) - uy * 26}
          y={center.y + ux * 26 + 8}
          textAnchor={def.cut ? (def.labelSide === "left" ? "end" : "start") : "middle"}
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={26}
          letterSpacing={1}
          fill={neon(def.labelColor ?? def.color)}
          stroke="#04070c"
          strokeWidth={7}
          paintOrder="stroke"
          opacity={labelPop}
          filter="url(#glow-sm)"
        >
          {def.label}
        </text>
      )}
    </g>
  );
};
