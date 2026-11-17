import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY, m, neon, toPx } from "../theme";
import type { ZoneDef } from "../types";
import { resolveAnchor, visibility } from "../lib/timeline";
import { useScript } from "../lib/ScriptContext";

/**
 * Zone semi-transparente : polygone (ex: triangle de passe relié à des joueurs, qui suit leurs
 * déplacements) ou rectangle (zone d'ombre, zone aveugle, bande "coupée en deux"...).
 */
export const TacticalZone: React.FC<{ def: ZoneDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();
  const vis = visibility(frame, fps, def, 0.5, 0.35);
  if (vis <= 0) return null;

  const color = neon(def.color);
  const fillOpacity = def.fillOpacity ?? (def.color === "dim" ? 0.1 : 0.16);
  const grow = interpolate(frame / fps - def.from, [0, 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  let pts: { x: number; y: number }[];
  if (def.shape.kind === "rect") {
    const { x, y, w, h } = def.shape;
    pts = [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ].map(toPx);
  } else {
    pts = def.shape.points.map((p) => toPx(resolveAnchor(script, p, frame, fps)));
  }
  const c = {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  };
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") + " Z";
  const label = def.labelAt ? toPx(def.labelAt) : c;
  const perim = pts.reduce((s, p, i) => {
    const n = pts[(i + 1) % pts.length];
    return s + Math.hypot(n.x - p.x, n.y - p.y);
  }, 0);

  return (
    <g opacity={vis}>
      <g transform={`translate(${c.x} ${c.y}) scale(${0.6 + 0.4 * grow}) translate(${-c.x} ${-c.y})`}>
        <path d={d} fill={color} fillOpacity={fillOpacity} stroke="none" />
        {(def.border ?? true) && (
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={def.color === "dim" ? 2 : 4}
            strokeOpacity={def.color === "dim" ? 0.35 : 0.95}
            strokeLinejoin="round"
            strokeDasharray={def.dashedBorder ? "14 10" : perim}
            strokeDashoffset={def.dashedBorder ? 0 : perim * (1 - grow)}
            filter={def.color === "dim" ? undefined : "url(#glow-sm)"}
          />
        )}
      </g>
      {def.label && (
        <text
          x={label.x}
          y={label.y + m(0.6)}
          textAnchor="middle"
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
          fontSize={24}
          letterSpacing={2}
          fill={color === neon("dim") ? "#fff" : color}
          stroke="#04070c"
          strokeWidth={6}
          paintOrder="stroke"
          opacity={grow}
        >
          {def.label}
        </text>
      )}
    </g>
  );
};
