import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg: "#0a0907",
  bg2: "#18130b",
  gold: "#d9ab4f",
  goldHi: "#f6d68f",
  goldDeep: "#8c6a28",
  cream: "#f2e8d5",
  muted: "#968b76",
  dim: "#5d5547",
  line: "rgba(217,171,79,0.35)",
  red: "#d9573f",
  paper: "#e8dabb",
  ink: "#2b2217",
  panel: "rgba(22,18,12,0.88)",
};

export const ANTON = "Anton, 'Anton Ext', sans-serif";
export const BARLOW = "'Barlow Condensed', 'Barlow Condensed Ext', sans-serif";
export const INTER = "Inter, sans-serif";
export const SERIF = "'Playfair Display', 'DejaVu Serif', serif";

const fonts: [string, string, string, string?][] = [
  ["Anton", "anton-latin-400-normal", "400"],
  ["Anton Ext", "anton-latin-ext-400-normal", "400"],
  ["Barlow Condensed", "barlow-condensed-latin-600-normal", "600"],
  ["Barlow Condensed", "barlow-condensed-latin-700-normal", "700"],
  ["Barlow Condensed", "barlow-condensed-latin-800-normal", "800"],
  ["Barlow Condensed Ext", "barlow-condensed-latin-ext-700-normal", "700"],
  ["Barlow Condensed Ext", "barlow-condensed-latin-ext-800-normal", "800"],
  ["Inter", "inter-latin-500-normal", "500"],
  ["Inter", "inter-latin-700-normal", "700"],
  ["Playfair Display", "playfair-display-latin-700-normal", "700"],
  ["Playfair Display", "playfair-display-latin-900-normal", "900"],
  ["Playfair Display", "playfair-display-latin-700-italic", "700", "italic"],
];
fonts.forEach(([family, file, weight, style]) => {
  loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight, style: style ?? "normal" });
});

export const easeOut = Easing.bezier(0.16, 0.84, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progression 0 → 1 entre `at` et `at + len` (en images), adoucie. */
export const prog = (f: number, at: number, len = 14, ease = easeOut) =>
  interpolate(f, [at, at + len], [0, 1], { ...clamp, easing: ease });

/** Fenêtre visible [a, b[ avec fondu d'entrée et de sortie. */
export const windowed = (f: number, a: number, b = Infinity, len = 10) =>
  Math.min(prog(f, a, len), b === Infinity ? 1 : 1 - prog(f, b - len, len));
