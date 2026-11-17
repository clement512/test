import type { SoundDef } from "./types";

/**
 * Bibliothèque d'effets sonores par défaut, générés une fois par ElevenLabs (sound-generation)
 * puis mis en cache dans public/sfx/. Utilisables dans `sfx` du scénario par leur nom.
 */
export const DEFAULT_SOUNDS: Record<string, SoundDef> = {
  whoosh: { prompt: "fast cinematic whoosh swipe transition, punchy, short, clean", duration: 0.8, volume: 0.55 },
  impact: { prompt: "deep cinematic bass impact hit, boom, short punchy, trailer", duration: 1.2, volume: 0.6 },
  pop: { prompt: "clean bubbly UI pop notification sound, short, modern", duration: 0.5, volume: 0.5 },
  swipe: { prompt: "quick light air swish, short, subtle", duration: 0.5, volume: 0.3 },
  glitch: { prompt: "short digital glitch stutter sound effect, cyber, futuristic", duration: 0.7, volume: 0.45 },
  click: { prompt: "crisp mouse click, UI button press, short", duration: 0.5, volume: 0.9 },
  riser: { prompt: "short cinematic tension riser swell, building up, futuristic", duration: 1.6, volume: 0.4 },
  stamp: { prompt: "short punchy cinematic hit with a quick digital glitch, for big text slamming on screen, tight and dry", duration: 0.6, volume: 0.55 },
  tick: { prompt: "very short futuristic UI tick blip, clean, subtle", duration: 0.5, volume: 0.35 },
  // Variantes douces (moins agressives)
  softWhoosh: { prompt: "soft gentle airy whoosh, smooth and subtle transition, warm, no harsh highs", duration: 0.9, volume: 0.32 },
  softHit: { prompt: "soft muffled low thump, gentle warm accent for text appearing, subtle, no distortion", duration: 0.6, volume: 0.35 },
  softTick: { prompt: "very soft subtle UI tick, gentle wooden click, quiet and warm", duration: 0.5, volume: 0.22 },
  scan: { prompt: "futuristic hologram scan beep sweep, sci-fi interface, short", duration: 0.8, volume: 0.35 },
};

export const resolveSounds = (custom?: Record<string, SoundDef>) => ({ ...DEFAULT_SOUNDS, ...(custom ?? {}) });
