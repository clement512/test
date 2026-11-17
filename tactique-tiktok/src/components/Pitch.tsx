import React from "react";
import { COLORS, m, PITCH_ORIGIN, PITCH_PX, WORLD } from "../theme";

/** Filtres de lueur néon partagés (à placer une fois dans le <svg> du monde). */
export const GlowDefs: React.FC = () => (
  <defs>
    {[
      ["glow-sm", 3],
      ["glow-md", 7],
      ["glow-lg", 14],
    ].map(([id, sd]) => (
      <filter key={id} id={id as string} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={sd} result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation={(sd as number) / 3} result="b2" />
        <feMerge>
          <feMergeNode in="b1" />
          <feMergeNode in="b2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    ))}
    <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke={COLORS.cyan} strokeOpacity={0.07} strokeWidth={1} />
    </pattern>
    <pattern id="tactical-grid-major" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M200 0H0V200" fill="none" stroke={COLORS.cyan} strokeOpacity={0.09} strokeWidth={1.5} />
    </pattern>
    <radialGradient id="pitch-vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="#0B1B2E" stopOpacity={0.9} />
      <stop offset="100%" stopColor={COLORS.bg} stopOpacity={0} />
    </radialGradient>
  </defs>
);

/** Terrain complet vu de dessus (vertical), lignes cyan néon. Coordonnées en px du monde. */
export const Pitch: React.FC = () => {
  const { x: ox, y: oy } = PITCH_ORIGIN;
  const W = PITCH_PX.width;
  const H = PITCH_PX.height;
  const cx = ox + W / 2;
  const cy = oy + H / 2;
  const boxW = m(40.32);
  const boxH = m(16.5);
  const gaW = m(18.32);
  const gaH = m(5.5);
  const goalW = m(7.32);
  const r = m(9.15);
  const penSpot = m(11);
  // demi-arc de surface : intersection du cercle (r=9.15 autour du point de penalty) avec la ligne des 16,5 m
  const arcDy = boxH - penSpot; // 5,5 m en px
  const arcDx = Math.sqrt(r * r - arcDy * arcDy);

  const stripes = 12;
  const stripeH = H / stripes;

  const line = {
    fill: "none",
    stroke: COLORS.pitchLine,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
  };

  return (
    <g>
      {/* Grille tactique de fond, très large pour couvrir les dézooms / inclinaisons */}
      <rect x={-WORLD.width} y={-WORLD.height} width={WORLD.width * 3} height={WORLD.height * 3} fill="url(#tactical-grid)" />
      <rect x={-WORLD.width} y={-WORLD.height} width={WORLD.width * 3} height={WORLD.height * 3} fill="url(#tactical-grid-major)" />
      <rect x={ox - 120} y={oy - 160} width={W + 240} height={H + 320} fill="url(#pitch-vignette)" />

      {/* Bandes de tonte très subtiles */}
      {Array.from({ length: stripes }).map((_, i) => (
        <rect
          key={i}
          x={ox}
          y={oy + i * stripeH}
          width={W}
          height={stripeH}
          fill={COLORS.cyan}
          opacity={i % 2 === 0 ? 0.025 : 0.0}
        />
      ))}

      <g filter="url(#glow-sm)" opacity={0.9}>
        <rect x={ox} y={oy} width={W} height={H} {...line} strokeWidth={4} />
        <line x1={ox} y1={cy} x2={ox + W} y2={cy} {...line} />
        <circle cx={cx} cy={cy} r={r} {...line} />
        <circle cx={cx} cy={cy} r={5} fill={COLORS.pitchLine} />

        {/* Haut */}
        <rect x={cx - boxW / 2} y={oy} width={boxW} height={boxH} {...line} />
        <rect x={cx - gaW / 2} y={oy} width={gaW} height={gaH} {...line} />
        <rect x={cx - goalW / 2} y={oy - m(2)} width={goalW} height={m(2)} {...line} />
        <circle cx={cx} cy={oy + penSpot} r={4} fill={COLORS.pitchLine} />
        <path d={`M ${cx - arcDx} ${oy + boxH} A ${r} ${r} 0 0 0 ${cx + arcDx} ${oy + boxH}`} {...line} />

        {/* Bas */}
        <rect x={cx - boxW / 2} y={oy + H - boxH} width={boxW} height={boxH} {...line} />
        <rect x={cx - gaW / 2} y={oy + H - gaH} width={gaW} height={gaH} {...line} />
        <rect x={cx - goalW / 2} y={oy + H} width={goalW} height={m(2)} {...line} />
        <circle cx={cx} cy={oy + H - penSpot} r={4} fill={COLORS.pitchLine} />
        <path d={`M ${cx - arcDx} ${oy + H - boxH} A ${r} ${r} 0 0 1 ${cx + arcDx} ${oy + H - boxH}`} {...line} />

        {/* Corners */}
        <path d={`M ${ox + m(1)} ${oy} A ${m(1)} ${m(1)} 0 0 1 ${ox} ${oy + m(1)}`} {...line} />
        <path d={`M ${ox + W - m(1)} ${oy} A ${m(1)} ${m(1)} 0 0 0 ${ox + W} ${oy + m(1)}`} {...line} />
        <path d={`M ${ox} ${oy + H - m(1)} A ${m(1)} ${m(1)} 0 0 1 ${ox + m(1)} ${oy + H}`} {...line} />
        <path d={`M ${ox + W} ${oy + H - m(1)} A ${m(1)} ${m(1)} 0 0 0 ${ox + W - m(1)} ${oy + H}`} {...line} />
      </g>
    </g>
  );
};
