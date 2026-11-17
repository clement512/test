/**
 * Analyse rythmique d'un morceau : tempo (BPM) et grille des temps.
 *
 * Méthode : flux spectral (onsets) → autocorrélation pour le tempo → recherche de la phase qui
 * maximise l'énergie sur la grille → affinage local de chaque temps sur le pic d'onset le plus proche.
 * Nécessite ffmpeg pour décoder l'audio.
 */
import { execFileSync } from "node:child_process";

const SR = 22050;
const HOP = 512;
const WIN = 1024;

const fft = (re: Float64Array, im: Float64Array) => {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(ang * k);
        const wi = Math.sin(ang * k);
        const ar = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
        const ai = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
        re[i + k + len / 2] = re[i + k] - ar;
        im[i + k + len / 2] = im[i + k] - ai;
        re[i + k] += ar;
        im[i + k] += ai;
      }
    }
  }
};

export type BeatAnalysis = { bpm: number; beats: number[]; duration: number };

export const analyzeBeats = (file: string, bpmHint?: number): BeatAnalysis => {
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], {
    maxBuffer: 1024 * 1024 * 512,
  });
  const x = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
  const duration = x.length / SR;

  // 1. Enveloppe d'onsets (flux spectral sur le log-spectre)
  const nFrames = Math.max(0, Math.floor((x.length - WIN) / HOP));
  const win = new Float64Array(WIN).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / WIN));
  let prev = new Float64Array(WIN / 2);
  const onset = new Float64Array(nFrames);
  for (let f = 0; f < nFrames; f++) {
    const re = new Float64Array(WIN);
    const im = new Float64Array(WIN);
    for (let i = 0; i < WIN; i++) re[i] = x[f * HOP + i] * win[i];
    fft(re, im);
    const mag = new Float64Array(WIN / 2);
    let flux = 0;
    for (let k = 1; k < WIN / 2; k++) {
      mag[k] = Math.log1p(100 * Math.hypot(re[k], im[k]));
      const d = mag[k] - prev[k];
      if (d > 0) flux += d;
    }
    onset[f] = flux;
    prev = mag;
  }
  // Normalisation + retrait de la moyenne locale
  const fps = SR / HOP;
  const W = Math.round(fps * 0.5);
  const env = new Float64Array(nFrames);
  for (let f = 0; f < nFrames; f++) {
    let s = 0;
    let c = 0;
    for (let j = Math.max(0, f - W); j < Math.min(nFrames, f + W); j++) {
      s += onset[j];
      c++;
    }
    env[f] = Math.max(0, onset[f] - s / c);
  }

  // 2. Tempo : autocorrélation pondérée autour de 120 BPM
  let bestLag = 0;
  let bestScore = -Infinity;
  const lo = bpmHint ? bpmHint * 0.98 : 70;
  const hi = bpmHint ? bpmHint * 1.02 : 180;
  for (let bpm = lo; bpm <= hi; bpm += 0.05) {
    const lag = (60 / bpm) * fps;
    let s = 0;
    for (let f = 0; f + lag < nFrames; f++) {
      const l = f + lag;
      const i0 = Math.floor(l);
      s += env[f] * (env[i0] * (1 - (l - i0)) + (env[i0 + 1] ?? 0) * (l - i0));
    }
    const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 0.9, 2));
    if (s * prior > bestScore) {
      bestScore = s * prior;
      bestLag = lag;
    }
  }

  // 3. Phase : décalage qui maximise l'énergie des onsets sur la grille
  let bestPhase = 0;
  let bestSum = -Infinity;
  for (let ph = 0; ph < bestLag; ph += 0.5) {
    let s = 0;
    for (let t = ph; t < nFrames; t += bestLag) s += env[Math.round(t)] ?? 0;
    if (s > bestSum) {
      bestSum = s;
      bestPhase = ph;
    }
  }

  // 4. Suivi : chaque temps est prédit depuis le précédent (déjà recalé) puis affiné sur le pic
  //    d'onset le plus proche (±10 % de période) → pas de dérive si le tempo estimé est un peu faux
  const beats: number[] = [];
  const tol = Math.max(1, Math.round(bestLag * 0.1));
  let t = bestPhase;
  while (t < nFrames) {
    const c = Math.round(t);
    let bi = c;
    for (let j = c - tol; j <= c + tol; j++) if ((env[j] ?? -1) > (env[bi] ?? -1)) bi = j;
    // Si aucun onset net, on garde la prédiction
    const pick = (env[bi] ?? 0) > 0 ? bi : c;
    beats.push(+((pick * HOP + WIN / 2) / SR).toFixed(3));
    // Lissage : moitié prédiction, moitié position recalée
    t = (pick + c) / 2 + bestLag;
  }
  const ibis = beats.slice(1).map((b, i) => b - beats[i]).sort((x, y) => x - y);
  const bpm = ibis.length ? +(60 / ibis[Math.floor(ibis.length / 2)]).toFixed(2) : +(60 / (bestLag / fps)).toFixed(2);
  return { bpm, beats, duration };
};
