/**
 * ============================================================================
 *  ÉPISODE 5 — "Pourquoi le 4-2-3-1 domine le 4-5-1" (@clemitch)
 * ============================================================================
 *
 * Une seule équipe (jaune) qui attaque vers le haut : on la fait passer du 4-5-1 au 4-2-3-1
 * et inversement. Voix off TTS (Corentin), texte fourni mot pour mot.
 */
import type { ArrowDef, PlayerDef, Point, ScriptData } from "../types";
import { chain } from "../scriptData";

// 4-5-1 de départ
const F451: Record<string, Point> = {
  A1: { x: 34, y: 100 },
  A3: { x: 10, y: 82 },
  A4: { x: 26, y: 85 },
  A5: { x: 42, y: 85 },
  A2: { x: 58, y: 82 },
  A11: { x: 8, y: 63 },
  A8: { x: 21, y: 64 },
  A10: { x: 34, y: 65 },
  A6: { x: 47, y: 64 },
  A7: { x: 60, y: 63 },
  A9: { x: 34, y: 36 },
};
// 4-2-3-1
const F4231: Record<string, Point> = {
  A8: { x: 27, y: 67 },
  A6: { x: 41, y: 67 },
  A10: { x: 34, y: 50 },
  A11: { x: 10, y: 46 },
  A7: { x: 58, y: 46 },
};
// Repli défensif : les ailiers reculent d'un cran → 4-5-1 compact
const COMPACT: Record<string, Point> = {
  A11: { x: 11, y: 61 },
  A7: { x: 57, y: 61 },
  A10: { x: 34, y: 58 },
  A8: { x: 26, y: 65 },
  A6: { x: 42, y: 65 },
  A9: { x: 34, y: 45 },
  A3: { x: 12, y: 79 },
  A4: { x: 27, y: 81 },
  A5: { x: 41, y: 81 },
  A2: { x: 56, y: 79 },
};

const team: PlayerDef[] = Object.entries(F451).map(([id, pos], i) => ({
  id,
  team: "A" as const,
  number: Number(id.slice(1)),
  pos,
  appearAt: 0.25 + i * 0.04,
}));

/** Flèches de transformation 4-5-1 → 4-2-3-1. */
const morphArrows = (from: number, to: number): ArrowDef[] =>
  (["A8", "A6", "A10", "A11", "A7"] as const).map((id, i) => ({
    from: from + i * 0.05,
    to,
    start: { x: F451[id].x, y: F451[id].y - 2 },
    end: { x: F4231[id].x, y: F4231[id].y + 2.5 },
    color: "cyan" as const,
    width: 5,
    curve: id === "A11" ? -3 : id === "A7" ? 3 : 0,
    drawDuration: 0.45,
  }));

const dots = (f: Record<string, Point>) => Object.values(f);

export const ep5_4231: ScriptData = {
  meta: {
    id: "Ep5_4231",
    title: "ÉP.5 · 4-2-3-1",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 59,
    fps: 60,
    width: 1080,
    height: 1920,
    audio: null,
    voice: {
      provider: "elevenlabs",
      voiceId: "IHngRooVccHyPqB4uQkG", // Corentin
      modelId: "eleven_v4",
      speed: 1.1,
      stability: 0.4,
      similarityBoost: 0.8,
      style: 0.5,
      volume: 1,
    },
    music: {
      file: "music/son-tiktok-etendu.mp3",
      bpm: 117.4,
      offset: 0,
      volume: 0.3,
      duck: 0.4,
      beatSync: { lines: true, maxDelay: 0.22, snap: 0.15 },
    },
    pacing: { gap: 0.28, endHold: 2.2 },
    wordPunches: true,
    transitions: [8.6, 21.0, 35.0, 46.8],
    handle: "@clemitch",
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players: team,

  // -------------------------------------------------------------------------
  moves: [
    // Accroche : le 4-5-1 se transforme en 4-2-3-1, puis revient
    { at: 2.4, duration: 1.1, positions: F4231 },
    { at: 7.8, duration: 1.0, positions: F451 },
    // Le problème : milieux alignés trop bas
    { at: 15.6, duration: 0.8, positions: { A11: { x: 8, y: 66 }, A8: { x: 21, y: 67 }, A10: { x: 34, y: 68 }, A6: { x: 47, y: 67 }, A7: { x: 60, y: 66 } } },
    // Le 4-2-3-1 casse la ligne de cinq
    { at: 21.6, duration: 1.2, positions: F4231 },
    // Le triangle offensif se rapproche du buteur
    { at: 26.4, duration: 0.9, positions: { A10: { x: 34, y: 45 }, A11: { x: 14, y: 41 }, A7: { x: 54, y: 41 } } },
    // Repli : les ailiers reculent d'un cran → 4-5-1 compact
    { at: 41.6, duration: 1.2, positions: COMPACT },
  ],

  ball: [
    { at: 0.8, holder: "A8" },
    { at: 22.4, holder: "A6", passDuration: 0.4 },
    // Combinaisons rapides en une touche autour du buteur
    { at: 30.6, holder: "A10", passDuration: 0.35 },
    { at: 31.3, holder: "A9", passDuration: 0.3 },
    { at: 31.9, holder: "A7", passDuration: 0.3 },
    { at: 32.5, holder: "A10", passDuration: 0.3 },
    { at: 33.1, holder: "A9", passDuration: 0.3 },
    { at: 35.4, holder: "A8", passDuration: 0.01 },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 62 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 62 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // Problème : l'attaquant isolé
    { at: 12.4, duration: 1.2, focus: { x: 34, y: 50 }, zoom: 1.35 },
    { at: 21.0, duration: 1.2, focus: { x: 34, y: 58 }, zoom: 1.1 },
    // Triangle offensif + combinaisons
    { at: 25.0, duration: 1.2, focus: { x: 34, y: 46 }, zoom: 1.55 },
    // Double pivot
    { at: 35.0, duration: 1.2, focus: { x: 34, y: 72 }, zoom: 1.5 },
    // Repli compact
    { at: 40.0, duration: 1.2, focus: { x: 34, y: 64 }, zoom: 1.15 },
    // Conclusion / outro
    { at: 52.0, duration: 2.5, focus: { x: 34, y: 62 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 12.6, to: 21.0, player: "A9", color: "red" },
    { from: 25.0, to: 30.0, player: "A10", color: "cyan" },
    { from: 26.0, to: 30.0, player: "A11" },
    { from: 26.0, to: 30.0, player: "A7" },
    { from: 30.0, to: 35.0, player: "A9", color: "cyan" },
    { from: 35.2, to: 39.0, player: "A6", color: "cyan" },
    { from: 35.2, to: 39.0, player: "A8", color: "cyan" },
    { from: 41.4, to: 46.6, player: "A11" },
    { from: 41.4, to: 46.6, player: "A7" },
  ],

  tags: [
    { from: 25.4, to: 30.0, player: "A10", text: "NUMÉRO 10", color: "cyan" },
    { from: 35.6, to: 39.0, player: "A8", text: "PIVOT", color: "cyan" },
    { from: 35.7, to: 39.0, player: "A6", text: "PIVOT", color: "cyan" },
  ],

  arrows: [
    // Accroche — lignes de formation + transformation
    ...chain(["A3", "A4", "A5", "A2"], "yellow", 0.6, 2.3),
    ...chain(["A11", "A8", "A10", "A6", "A7"], "yellow", 0.7, 2.3),
    ...morphArrows(2.3, 4.6),

    // Problème — la ligne de 5 trop basse, le soutien trop lent
    { from: 15.6, to: 21.0, start: { x: 3, y: 66.5 }, end: { x: 65, y: 66.5 }, color: "red", head: false, width: 4, drawDuration: 0.6, label: "LIGNE DE 5 TROP BASSE", labelColor: "red" },
    ...[[21, 64], [34, 65], [47, 64]].map(([x, y], i) => ({
      from: 18.2 + i * 0.15,
      to: 21.0,
      start: { x, y: y - 2 },
      end: { x: 34 + (x - 34) * 0.3, y: 42 },
      color: "yellow" as const,
      width: 4,
      dashed: true,
      drawDuration: 1.6,
    })),

    // Le 4-2-3-1 casse la ligne
    ...morphArrows(21.5, 24.8),
    // Le triangle se relie au buteur
    { from: 26.6, to: 30.0, start: "A10", end: "A9", color: "cyan", head: false, width: 4, drawDuration: 0.3 },
    { from: 26.7, to: 30.0, start: "A11", end: "A9", color: "cyan", head: false, width: 4, drawDuration: 0.3 },
    { from: 26.8, to: 30.0, start: "A7", end: "A9", color: "cyan", head: false, width: 4, drawDuration: 0.3 },

    // Double pivot qui verrouille l'axe
    { from: 36.4, to: 39.0, start: "A8", end: "A6", color: "cyan", head: false, width: 6, drawDuration: 0.35 },
    // Les ailiers reculent d'un cran
    { from: 41.4, to: 46.6, start: { x: 14, y: 43 }, end: { x: 11.5, y: 57.5 }, color: "yellow", width: 5, drawDuration: 0.5 },
    { from: 41.5, to: 46.6, start: { x: 54, y: 43 }, end: { x: 56.5, y: 57.5 }, color: "yellow", width: 5, drawDuration: 0.5 },
  ],

  zones: [
    // L'attaquant isolé, coupé du reste
    { from: 13.0, to: 21.0, shape: { kind: "rect", x: 26, y: 30, w: 16, h: 12 }, color: "red", fillOpacity: 0.12, dashedBorder: true },
    // Triangle offensif
    { from: 26.2, to: 35.0, shape: { kind: "polygon", points: ["A11", "A10", "A7"] }, color: "cyan", fillOpacity: 0.14, label: "TRIANGLE OFFENSIF", labelAt: { x: 34, y: 54 } },
    // Axe verrouillé
    { from: 36.6, to: 39.0, shape: { kind: "rect", x: 22, y: 64, w: 24, h: 18 }, color: "cyan", fillOpacity: 0.14, label: "AXE VERROUILLÉ", labelAt: { x: 34, y: 76 } },
    // Bloc compact de 5
    { from: 43.0, to: 46.6, shape: { kind: "rect", x: 5, y: 55, w: 58, h: 30 }, color: "cyan", fillOpacity: 0.1, label: "BLOC DE 5", labelAt: { x: 34, y: 88 } },
  ],

  callouts: [
    { from: 0.9, to: 2.3, at: { x: 34, y: 93.5 }, text: "4-5-1", color: "yellow", size: 28 },
    { from: 3.4, to: 7.6, at: { x: 34, y: 93.5 }, text: "4-2-3-1", color: "cyan", size: 28 },
    { from: 14.0, to: 21.0, at: { x: 34, y: 28 }, text: "ISOLÉ", color: "red", size: 26 },
    { from: 18.6, to: 21.0, at: { x: 52, y: 52 }, text: "TROP LOIN", color: "yellow", size: 22 },
    { from: 31.0, to: 35.0, at: { x: 34, y: 30 }, text: "UNE TOUCHE", color: "cyan", size: 22 },
  ],

  icons: [
    { from: 36.8, to: 39.0, at: { x: 34, y: 61 }, icon: "lock", color: "cyan" },
  ],

  measures: [
    { from: 17.2, to: 21.0, a: { x: 62, y: 38 }, b: { x: 62, y: 65 }, label: "TROP BAS", color: "red" },
  ],

  chapters: [
    { from: 8.6, number: "01", title: "Le problème du 4-5-1", color: "red" },
    { from: 21.0, number: "02", title: "L'attaque du 4-2-3-1", color: "cyan" },
    { from: 35.0, number: "03", title: "Double pivot", color: "yellow" },
  ],

  pills: [
    { from: 10.6, to: 21.0, text: "4-5-1 : *attaquant isolé*", color: "red" },
    { from: 22.0, to: 30.0, text: "*Un 10* + *deux ailiers hauts*", color: "cyan" },
    { from: 30.0, to: 35.0, text: "Combinaisons *plus rapides*", color: "cyan" },
    { from: 36.0, to: 40.0, text: "*Double pivot* : axe verrouillé", color: "yellow" },
    { from: 40.0, to: 46.6, text: "Sans ballon : ^4-5-1 compact^", color: "cyan" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 8.4,
      lines: [
        { text: "4-5-1 VS 4-2-3-1", color: "yellow", size: 96 },
        { text: "LE PIÈGE", color: "red", size: 140 },
      ],
      pill: "Pourquoi l'un a *remplacé l'autre*",
      pillAt: 3.8,
    },
  ],

  compare: [
    {
      from: 46.8,
      to: 52.0,
      left: { title: "4-5-1", subtitle: "Solide", color: "red", dots: dots(F451) },
      right: { title: "4-2-3-1", subtitle: "Attaque + défense", color: "cyan", dots: dots({ ...F451, ...F4231 }) },
      caption: "4-2-3-1 = flexibilité totale",
      captionColor: "yellow",
      captionAt: 49.0,
    },
  ],

  stamps: [
    { cue: { line: 1, word: "remplacé" }, text: "Remplacé", color: "red", y: 560, hold: 1.3 },
    { cue: { line: 4, word: "isolé" }, text: "Isolé", color: "red", y: 520, hold: 1.3 },
    { cue: { line: 6, word: "cassant" }, text: "Ligne cassée", color: "cyan", y: 520, hold: 1.4 },
    { cue: { line: 8, word: "rapides" }, text: "Plus rapide", color: "cyan", y: 480, hold: 1.3 },
    { cue: { line: 11, word: "ultra-compact" }, text: "Ultra-compact", color: "cyan", y: 480, hold: 1.4 },
  ],

  // Texte fourni, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~ ; `speech` = texte prononcé.
  subtitles: [
    // Accroche
    /* 0 */ { from: 0.3, to: 3.8, text: "Sur le papier, le ~4-5-1~ et le ^4-2-3-1^ se ressemblent.", speech: "[excited] Sur le papier, le quatre-cinq-un et le quatre-deux-trois-un se ressemblent." },
    /* 1 */ { from: 3.8, to: 7.6, text: "Pourtant, l'un a presque *remplacé l'autre* au plus haut niveau.", speech: "Pourtant, l'un a presque remplacé l'autre au plus haut niveau." },
    /* 2 */ { from: 7.6, to: 8.6, text: "*Voici pourquoi*.", speech: "[confident] Voici pourquoi.", pauseAfter: 0.1 },

    // Le problème du 4-5-1
    /* 3 */ { from: 8.6, to: 12.6, text: "Le 4-5-1 classique est ^ultra-solide^, mais il a un ~défaut majeur~ :", speech: "Le quatre-cinq-un classique est ultra-solide, mais il a un défaut majeur :" },
    /* 4 */ { from: 12.6, to: 15.4, text: "l'attaquant de pointe est trop souvent ~isolé~.", speech: "[serious] l'attaquant de pointe est trop souvent isolé." },
    /* 5 */ { from: 15.4, to: 21.0, text: "Les cinq milieux sont alignés ~trop bas~ et le soutien met ~trop de temps~ à arriver.", speech: "Les cinq milieux sont alignés trop bas et le soutien met trop de temps à arriver.", pauseAfter: 0.12 },

    // L'avantage du 4-2-3-1
    /* 6 */ { from: 21.0, to: 25.0, text: "Le 4-2-3-1 règle ce problème en ^cassant cette ligne de cinq^.", speech: "[confident] Le quatre-deux-trois-un règle ce problème en cassant cette ligne de cinq." },
    /* 7 */ { from: 25.0, to: 30.0, text: "Tu places un ^numéro 10^ juste derrière l'attaquant, épaulé par *deux ailiers hauts*.", speech: "Tu places un numéro dix juste derrière l'attaquant, épaulé par deux ailiers hauts." },
    /* 8 */ { from: 30.0, to: 35.0, text: "Résultat : ton buteur ^n'est plus seul^ et les combinaisons deviennent *beaucoup plus rapides*.", speech: "Résultat : ton buteur n'est plus seul et les combinaisons deviennent beaucoup plus rapides.", pauseAfter: 0.12 },

    // Double pivot + flexibilité
    /* 9 */ { from: 35.0, to: 39.0, text: "Derrière, le ^double pivot^ verrouille l'axe et *protège la défense*.", speech: "Derrière, le double pivot verrouille l'axe et protège la défense." },
    /* 10 */ { from: 39.0, to: 40.2, text: "*Et le meilleur* ?", speech: "[excited] Et le meilleur ?" },
    /* 11 */ { from: 40.2, to: 46.8, text: "Dès que tu perds le ballon, tes ailiers *reculent d'un cran* et ton équipe redevient un ^4-5-1 ultra-compact^.", speech: "Dès que tu perds le ballon, tes ailiers reculent d'un cran et ton équipe redevient un quatre-cinq-un ultra-compact.", pauseAfter: 0.12 },

    // Conclusion & CTA
    /* 12 */ { from: 46.8, to: 52.0, text: "Le 4-2-3-1 t'offre donc ^l'attaque^ d'un système offensif et ^la défense^ du 4-5-1.", speech: "[confident] Le quatre-deux-trois-un t'offre donc l'attaque d'un système offensif et la défense du quatre-cinq-un." },
    /* 13 */ { from: 52.0, to: 56.6, text: "Et toi, tu préfères *quel système* pour ton équipe ? Dis-le *en commentaire*", speech: "[excited] Et toi, tu préfères quel système pour ton équipe ? Dis-le en commentaire", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 2.3, sound: "softWhoosh" },
    { at: 3.8, sound: "softTick" },
    { cue: { line: 3, word: "le", offset: -0.15 }, sound: "softWhoosh" },
    { at: 10.6, sound: "softTick" },
    { at: 15.6, sound: "softTick" },
    { cue: { line: 6, word: "le", offset: -0.15 }, sound: "softWhoosh" },
    { at: 21.5, sound: "softWhoosh" },
    { at: 26.4, sound: "softTick" },
    { at: 30.6, sound: "softTick" },
    { at: 31.3, sound: "softTick" },
    { at: 31.9, sound: "softTick" },
    { at: 32.5, sound: "softTick" },
    { cue: { line: 9, word: "derrière", offset: -0.15 }, sound: "softWhoosh" },
    { at: 36.8, sound: "softTick" },
    { at: 41.4, sound: "softWhoosh" },
    { at: 46.75, sound: "softWhoosh" },
    { at: 49.0, sound: "softHit" },
    { at: 52.0, sound: "softWhoosh" },
    { at: 56.0, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 52.0,
    titleTop: "ET TOI, TU PRÉFÈRES",
    titleHighlight: "QUEL SYSTÈME ?",
    pill: "DIS-LE EN COMMENTAIRE",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 56.0,
  },
};
