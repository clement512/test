import type { NeonColor, Point } from "./types";

export const COLORS = {
  bg: "#060E1A",
  bgDeep: "#030810",
  cyan: "#00F0FF",
  yellow: "#FFD600",
  red: "#FF2A6D",
  white: "#FFFFFF",
  pitchLine: "#00F0FF",
  playerFill: "#0A1626",
  dim: "#9FB3C8",
} as const;

export const neon = (c: NeonColor | "dim"): string =>
  c === "dim" ? COLORS.dim : COLORS[c];

export const FONT_DISPLAY = "Montserrat, Inter, Arial, sans-serif";
export const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

/**
 * Géométrie du "monde" : le terrain (68 x 105 m) est dessiné dans un canevas de 1080 x 1920 px,
 * centré, à l'échelle PX_PER_M. La caméra se déplace ensuite dans ce monde.
 */
export const WORLD = { width: 1080, height: 1920 } as const;
export const PITCH = { width: 68, length: 105 } as const;
export const PX_PER_M = 13.4;
export const PITCH_PX = {
  width: PITCH.width * PX_PER_M,
  height: PITCH.length * PX_PER_M,
};
export const PITCH_ORIGIN = {
  x: (WORLD.width - PITCH_PX.width) / 2,
  y: (WORLD.height - PITCH_PX.height) / 2,
};

/** Mètres (repère terrain) → pixels (repère monde). */
export const toPx = (p: Point): Point => ({
  x: PITCH_ORIGIN.x + p.x * PX_PER_M,
  y: PITCH_ORIGIN.y + p.y * PX_PER_M,
});

export const m = (meters: number) => meters * PX_PER_M;

export const PLAYER_RADIUS = 30;

/** Zone "sûre" verticale de l'UI TikTok : on garde les sous-titres au-dessus de la barre de description. */
export const SAFE = { top: 150, subtitleY: 1450 } as const;
