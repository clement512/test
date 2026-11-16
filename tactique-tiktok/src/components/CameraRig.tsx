import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { toPx, WORLD } from "../theme";
import type { CameraKeyframe } from "../types";
import { getCamera } from "../lib/timeline";

/**
 * Conteneur caméra : zooms (scale) et travellings (translate) fluides vers des points du terrain,
 * inclinaison 3D (tilt) et léger flottement "caméra portée" en début de vidéo.
 */
export const CameraRig: React.FC<{
  keyframes: CameraKeyframe[];
  children: React.ReactNode;
  /** Amplitude du flottement (px) — décroît après `floatUntil` secondes. */
  floatAmplitude?: number;
  floatUntil?: number;
  /** Instants (s) des "punchs" : petit coup de zoom + secousse, calés sur les mots forts. */
  punches?: number[];
}> = ({ keyframes, children, floatAmplitude = 7, floatUntil = 4, punches = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cam = getCamera(keyframes, frame, fps);
  const focus = toPx(cam.focus);
  const t = frame / fps;

  // Flottement léger : fort au début, résiduel ensuite (vidéo "vivante")
  const floatAmt = interpolate(t, [0, floatUntil, floatUntil + 2], [1, 1, 0.3], {
    extrapolateRight: "clamp",
  });
  const fx = Math.sin(t * 0.9) * floatAmplitude * floatAmt;
  const fy = Math.cos(t * 0.7) * floatAmplitude * 0.8 * floatAmt;
  const frot = Math.sin(t * 0.5) * 0.35 * floatAmt;
  const ftilt = Math.sin(t * 0.6) * 2.2 * floatAmt;

  // Punch : attaque très rapide puis décroissance exponentielle
  let env = 0;
  for (const p of punches) {
    const dt = t - p;
    if (dt < -0.04 || dt > 0.6) continue;
    const attack = Math.min(1, (dt + 0.04) / 0.07);
    env = Math.max(env, attack * Math.exp(-Math.max(0, dt) * 7));
  }
  const punchZoom = 1 + 0.05 * env;
  const shakeX = Math.sin(t * 95) * 6 * env;
  const shakeY = Math.cos(t * 83) * 5 * env;
  const shakeR = Math.sin(t * 71) * 0.5 * env;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1800,
        perspectiveOrigin: "50% 40%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transformOrigin: "50% 50%",
          transform: `rotateX(${cam.tilt + ftilt}deg) rotateZ(${cam.rotate + frot + shakeR}deg) scale(${punchZoom})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: WORLD.width,
            height: WORLD.height,
            transformOrigin: "0 0",
            transform: `translate(${width / 2 + fx + shakeX}px, ${height / 2 + fy + shakeY}px) scale(${cam.zoom}) translate(${-focus.x}px, ${-focus.y}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
