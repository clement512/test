import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, MousePointer2 } from "lucide-react";
import { COLORS, FONT_DISPLAY } from "../theme";
import type { OutroDef } from "../types";

const glow = (c: string, s = 18) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}55`;

/** Tablette tactique animée : mini-terrain, pions qui se placent, flèche qui se trace. */
const TacticalTablet: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - start;
  const enter = spring({ frame: frame - start * fps, fps, config: { damping: 13, stiffness: 120 } });
  const W = 420;
  const H = 560;
  const yellow = [
    [0.5, 0.88], [0.2, 0.72], [0.4, 0.75], [0.6, 0.75], [0.8, 0.72],
    [0.5, 0.58], [0.32, 0.5], [0.68, 0.5], [0.18, 0.3], [0.82, 0.3], [0.5, 0.25],
  ];
  const red = [[0.3, 0.18], [0.7, 0.18], [0.25, 0.36], [0.5, 0.4], [0.75, 0.36]];
  const draw = interpolate(t, [1.1, 1.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const float = Math.sin(t * 2) * 8;

  return (
    <div
      style={{
        width: W + 40,
        height: H + 60,
        borderRadius: 40,
        background: "linear-gradient(160deg, #0f2236, #07111e)",
        border: `5px solid ${COLORS.cyan}`,
        boxShadow: `${glow(COLORS.cyan, 20)}, inset 0 0 40px ${COLORS.cyan}22`,
        padding: 20,
        paddingTop: 40,
        position: "relative",
        transform: `translateY(${(1 - enter) * 300 + float}px) rotate(${(1 - enter) * -14 - 3}deg) scale(${0.6 + 0.4 * enter})`,
      }}
    >
      <div style={{ position: "absolute", top: 14, left: "50%", width: 70, height: 10, marginLeft: -35, borderRadius: 5, background: COLORS.cyan, opacity: 0.5 }} />
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={10} fill="#081624" stroke={COLORS.cyan} strokeOpacity={0.7} strokeWidth={3} />
        <line x1={2} y1={H / 2} x2={W - 2} y2={H / 2} stroke={COLORS.cyan} strokeOpacity={0.7} strokeWidth={3} />
        <circle cx={W / 2} cy={H / 2} r={50} fill="none" stroke={COLORS.cyan} strokeOpacity={0.7} strokeWidth={3} />
        <rect x={W * 0.25} y={2} width={W * 0.5} height={80} fill="none" stroke={COLORS.cyan} strokeOpacity={0.7} strokeWidth={3} />
        <rect x={W * 0.25} y={H - 82} width={W * 0.5} height={80} fill="none" stroke={COLORS.cyan} strokeOpacity={0.7} strokeWidth={3} />
        {red.map(([x, y], i) => {
          const s = spring({ frame: frame - (start + 0.5 + i * 0.06) * fps, fps, config: { damping: 10 } });
          return <circle key={`r${i}`} cx={x * W} cy={y * H} r={13 * s} fill="none" stroke={COLORS.red} strokeWidth={5} />;
        })}
        {yellow.map(([x, y], i) => {
          const s = spring({ frame: frame - (start + 0.3 + i * 0.05) * fps, fps, config: { damping: 10 } });
          return <circle key={`y${i}`} cx={x * W} cy={y * H} r={14 * s} fill={COLORS.yellow} />;
        })}
        <path
          d={`M ${0.5 * W} ${0.58 * H} Q ${0.2 * W} ${0.45 * H} ${0.5 * W} ${0.28 * H}`}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={6}
          strokeDasharray="12 9"
          pathLength={1}
          style={{ strokeDasharray: `${draw} 1` }}
          filter={`drop-shadow(0 0 6px ${COLORS.cyan})`}
        />
      </svg>
    </div>
  );
};

/** Outro : appel à l'action avec tablette tactique et bouton "ABONNE-TOI" cliqué par un curseur. */
export const Outro: React.FC<{ def: OutroDef; handle?: string }> = ({ def, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < def.from) return null;
  const lt = t - def.from;

  const bg = interpolate(lt, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
  const title = spring({ frame: frame - (def.from + 0.2) * fps, fps, config: { damping: 12 } });
  const title2 = spring({ frame: frame - (def.from + 0.45) * fps, fps, config: { damping: 9, stiffness: 160 } });
  const pill = spring({ frame: frame - (def.from + 0.8) * fps, fps, config: { damping: 14 } });
  const btn = spring({ frame: frame - (def.from + 1.6) * fps, fps, config: { damping: 11 } });

  // Curseur : arrive depuis le bas-droite, clique à clickAt
  const click = def.clickAt;
  const cursorIn = interpolate(t, [click - 1.3, click - 0.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cx = interpolate(cursorIn, [0, 1], [980, 600]);
  const cy = interpolate(cursorIn, [0, 1], [1900, 1468]);
  const press = interpolate(t, [click - 0.06, click, click + 0.14], [1, 0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = t >= click;
  const ripple = interpolate(t, [click, click + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doneSpring = spring({ frame: frame - click * fps, fps, config: { damping: 9, stiffness: 200 } });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(3,8,16,${0.82 * bg})`, backdropFilter: `blur(${6 * bg}px)` }} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 900 }}>
        <div style={{ fontSize: Math.min(72, Math.floor(1700 / def.titleTop.length)), color: "#fff", transform: `scale(${title})`, textShadow: "0 6px 0 #000" }}>{def.titleTop}</div>
        <div style={{ fontSize: Math.min(120, Math.floor(1300 / def.titleHighlight.length)), color: COLORS.yellow, transform: `scale(${title2})`, textShadow: `${glow(COLORS.yellow, 14)}, 0 8px 0 #000`, lineHeight: 1.05 }}>
          {def.titleHighlight}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <div
            style={{
              transform: `skewX(-10deg) scale(${pill})`,
              border: `3px solid ${COLORS.cyan}`,
              background: "rgba(6,14,26,0.92)",
              boxShadow: glow(COLORS.cyan, 10),
              padding: "10px 26px",
              borderRadius: 6,
              fontSize: 30,
              color: "#fff",
            }}
          >
            {def.pill}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <TacticalTablet start={def.from + 0.4} />
      </div>

      {/* Bouton */}
      <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${btn * press * (done ? 0.94 + 0.06 * doneSpring : 1)}) skewX(-8deg)` }}>
          {done && (
            <div
              style={{
                position: "absolute",
                inset: -20 - ripple * 60,
                border: `4px solid ${COLORS.cyan}`,
                borderRadius: 24,
                opacity: 1 - ripple,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "26px 60px",
              borderRadius: 16,
              background: done ? "#0A1626" : COLORS.cyan,
              border: `4px solid ${COLORS.cyan}`,
              boxShadow: glow(COLORS.cyan, done ? 12 : 24),
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 64,
              color: done ? COLORS.cyan : "#05121e",
            }}
          >
            <span style={{ transform: "skewX(8deg)" }}>{done ? def.buttonDone : def.button}</span>
            {done && (
              <span style={{ transform: `skewX(8deg) scale(${doneSpring})`, display: "flex" }}>
                <Check size={62} strokeWidth={4} color={COLORS.cyan} />
              </span>
            )}
          </div>
        </div>
      </div>

      {handle && (
        <div
          style={{
            position: "absolute",
            top: 1575,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 44,
            color: COLORS.cyan,
            opacity: btn,
            textShadow: glow(COLORS.cyan, 10),
          }}
        >
          {handle}
        </div>
      )}

      {/* Curseur */}
      {cursorIn > 0 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `scale(${press * 1.1})`,
            transformOrigin: "0 0",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.7))",
          }}
        >
          <MousePointer2 size={86} fill="#fff" color="#05121e" strokeWidth={1.6} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Flash/glitch de transition entre séquences. */
export const TransitionFlash: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = at.find((a) => t >= a - 0.12 && t <= a + 0.35);
  if (k === undefined) return null;
  const p = interpolate(t, [k - 0.12, k, k + 0.35], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shift = Math.sin(frame * 3.1) * 14 * p;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: COLORS.cyan, opacity: 0.16 * p, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 600 + shift * 20, height: 6, background: COLORS.cyan, opacity: 0.7 * p, boxShadow: glow(COLORS.cyan, 10) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240 - shift * 14, height: 3, background: COLORS.red, opacity: 0.6 * p }} />
    </AbsoluteFill>
  );
};
