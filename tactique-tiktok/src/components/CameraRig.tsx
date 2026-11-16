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
}> = ({ keyframes, children, floatAmplitude = 7, floatUntil = 6 }) => {
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
          transform: `rotateX(${cam.tilt + ftilt}deg) rotateZ(${cam.rotate + frot}deg)`,
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
            transform: `translate(${width / 2 + fx}px, ${height / 2 + fy}px) scale(${cam.zoom}) translate(${-focus.x}px, ${-focus.y}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
