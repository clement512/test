import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Lock } from "lucide-react";
import { COLORS, FONT_DISPLAY, neon, PLAYER_RADIUS, toPx } from "../theme";
import type { CalloutDef, IconDef, MeasureDef, TagDef } from "../types";
import { getPlayerPos, resolveAnchor, visibility } from "../lib/timeline";
import { useScript } from "../lib/ScriptContext";

const usePop = (from: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame / fps - from, [0, 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });
};

/** Texte néon ou badge carré (ex: "2" / "3") ancré sur un point ou un joueur. */
export const Callout: React.FC<{ def: CalloutDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();
  const vis = visibility(frame, fps, def, 0.2, 0.3);
  const pop = usePop(def.from);
  if (vis <= 0) return null;
  const p = toPx(resolveAnchor(script, def.at, frame, fps));
  const color = neon(def.color);
  const size = def.size ?? (def.variant === "badge" ? 46 : 30);

  if (def.variant === "badge") {
    const s = size * 1.45;
    return (
      <g transform={`translate(${p.x} ${p.y}) scale(${pop})`} opacity={vis}>
        {/* Largeur automatique : carré pour un chiffre, pastille élargie pour un texte plus long */}
        <rect x={-Math.max(s, def.text.length * size * 0.68 + 26) / 2} y={-s / 2} width={Math.max(s, def.text.length * size * 0.68 + 26)} height={s} rx={6} fill={color} filter="url(#glow-md)" />
        <text textAnchor="middle" dominantBaseline="central" y={2} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={size} fill="#08111d">
          {def.text}
        </text>
      </g>
    );
  }
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${pop})`} opacity={vis}>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={900}
        fontSize={size}
        letterSpacing={2}
        fill={color}
        stroke="#04070c"
        strokeWidth={7}
        paintOrder="stroke"
        filter="url(#glow-sm)"
      >
        {def.text}
      </text>
    </g>
  );
};

/** Étiquette blanche au-dessus d'un joueur (ex: "AILIER", "TOI"). */
export const PlayerTag: React.FC<{ def: TagDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();
  const vis = visibility(frame, fps, def, 0.2, 0.3);
  const pop = usePop(def.from);
  if (vis <= 0) return null;
  const p = toPx(getPlayerPos(script, def.player, frame, fps));
  const color = neon(def.color ?? "white");
  const w = def.text.length * 17 + 26;
  return (
    <g transform={`translate(${p.x} ${p.y - PLAYER_RADIUS - 34}) scale(${pop})`} opacity={vis}>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={6} fill="#060E1A" stroke={color} strokeWidth={3} filter="url(#glow-sm)" />
      <text textAnchor="middle" dominantBaseline="central" y={1} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={24} letterSpacing={1.5} fill={color === COLORS.white ? "#fff" : color}>
        {def.text}
      </text>
    </g>
  );
};

/** Icône (cadenas, check) en pastille néon, ancrée sur un joueur. */
export const IconMarker: React.FC<{ def: IconDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const script = useScript();
  const vis = visibility(frame, fps, def, 0.2, 0.3);
  const pop = usePop(def.from);
  if (vis <= 0) return null;
  const p = toPx(resolveAnchor(script, def.at, frame, fps));
  const color = neon(def.color);
  const Icon = def.icon === "lock" ? Lock : Check;
  const S = 46;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${pop}) rotate(${(1 - pop) * -25})`} opacity={vis}>
      <rect x={-S / 2 - 8} y={-S / 2 - 8} width={S + 16} height={S + 16} rx={12} fill="#060E1A" stroke={color} strokeWidth={3} filter="url(#glow-md)" />
      <g transform={`translate(${-S / 2} ${-S / 2})`}>
        <Icon width={S} height={S} color={color} strokeWidth={2.6} />
      </g>
    </g>
  );
};

/** Cote de mesure (ex: "40 MÈTRES") : ligne verticale/horizontale avec butées. */
export const MeasureLine: React.FC<{ def: MeasureDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vis = visibility(frame, fps, def, 0.2, 0.3);
  const grow = interpolate(frame / fps - def.from, [0, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (vis <= 0) return null;
  const a = toPx(def.a);
  const b = toPx(def.b);
  const c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const ea = { x: c.x + (a.x - c.x) * grow, y: c.y + (a.y - c.y) * grow };
  const eb = { x: c.x + (b.x - c.x) * grow, y: c.y + (b.y - c.y) * grow };
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const nx = -Math.sin(ang) * 16;
  const ny = Math.cos(ang) * 16;
  const color = neon(def.color);
  return (
    <g opacity={vis} filter="url(#glow-sm)">
      <line x1={ea.x} y1={ea.y} x2={eb.x} y2={eb.y} stroke={color} strokeWidth={3} />
      {[ea, eb].map((p, i) => (
        <line key={i} x1={p.x - nx} y1={p.y - ny} x2={p.x + nx} y2={p.y + ny} stroke={color} strokeWidth={4} strokeLinecap="round" />
      ))}
      <g transform={`translate(${c.x} ${c.y})`} opacity={grow}>
        <rect x={-92} y={-24} width={184} height={48} rx={6} fill="#060E1A" stroke={color} strokeWidth={2} />
        <text textAnchor="middle" dominantBaseline="central" y={1} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={26} fill={color}>
          {def.label}
        </text>
      </g>
    </g>
  );
};
