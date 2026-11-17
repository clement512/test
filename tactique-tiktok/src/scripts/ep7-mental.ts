/**
 * ============================================================================
 *  ÉPISODE 7 — "Le mental, l'arme tactique oubliée" (@clemitch)
 * ============================================================================
 *
 * Ton équipe (jaune) en bloc 4-4-2 compact qui défend le but du bas ; quelques attaquants roses.
 * Pas de musique (voix off + bruitages). Script validé, mot pour mot.
 */
import type { CalloutDef, PlayerDef, Point, ScriptData } from "../types";
import { chain } from "../scriptData";

const BLOCK: Record<string, Point> = {
  A1: { x: 34, y: 99 },
  A3: { x: 13, y: 77 },
  A4: { x: 27, y: 79 },
  A5: { x: 41, y: 79 },
  A2: { x: 55, y: 77 },
  A11: { x: 13, y: 63 },
  A8: { x: 27, y: 65 },
  A6: { x: 41, y: 65 },
  A7: { x: 55, y: 63 },
  A9: { x: 29, y: 51 },
  A10: { x: 39, y: 51 },
};

/** Bloc désorganisé (coup dur, déconcentration). */
const SCATTER: Record<string, Point> = {
  A3: { x: 7, y: 70 },
  A4: { x: 22, y: 86 },
  A5: { x: 47, y: 74 },
  A2: { x: 63, y: 84 },
  A11: { x: 8, y: 52 },
  A8: { x: 30, y: 56 },
  A6: { x: 48, y: 71 },
  A7: { x: 62, y: 55 },
  A9: { x: 22, y: 42 },
  A10: { x: 45, y: 44 },
};

/** Bloc trop étiré, avant les consignes. */
const LOOSE: Record<string, Point> = {
  A3: { x: 9, y: 80 },
  A4: { x: 25, y: 84 },
  A5: { x: 43, y: 84 },
  A2: { x: 59, y: 80 },
  A11: { x: 9, y: 60 },
  A8: { x: 26, y: 61 },
  A6: { x: 42, y: 61 },
  A7: { x: 59, y: 60 },
};

const yellow: PlayerDef[] = Object.entries(BLOCK).map(([id, pos], i) => ({
  id,
  team: "A" as const,
  number: Number(id.slice(1)),
  pos,
  appearAt: 0.25 + i * 0.03,
}));

const pink: PlayerDef[] = [
  { id: "BL", pos: { x: 10, y: 52 } },
  { id: "BC", pos: { x: 34, y: 43 } },
  { id: "BR", pos: { x: 58, y: 52 } },
  { id: "BS", pos: { x: 34, y: 71 } },
].map((p, i) => ({ ...p, team: "B" as const, appearAt: 0.45 + i * 0.04 }));

/** Chrono des 5 secondes au-dessus du joueur qui vient de perdre le ballon. */
const chrono: CalloutDef[] = [5, 4, 3, 2, 1].map((n, i) => ({
  from: 14.4 + i * 0.55,
  to: 14.4 + (i + 1) * 0.55,
  at: { player: "A8", dx: 0, dy: -6.5 },
  text: `${n} S`,
  color: n <= 2 ? "red" : "yellow",
  variant: "badge",
  size: 34,
}));

export const ep7Mental: ScriptData = {
  meta: {
    id: "Ep7Mental",
    title: "ÉP.7 · MENTAL",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 54.5,
    fps: 60,
    width: 1080,
    height: 1920,
    audio: null,
    voice: {
      provider: "elevenlabs",
      voiceId: "IHngRooVccHyPqB4uQkG", // Corentin
      modelId: "eleven_v4",
      speed: 1.1,
      stability: 0.45,
      similarityBoost: 0.8,
      style: 0.45,
      volume: 1,
    },
    // Pas de musique : voix off + bruitages uniquement
    pacing: { gap: 0.3, endHold: 2.2 },
    wordPunches: true,
    transitions: [9.8, 21.4, 31.4, 47.8],
    handle: "@clemitch",
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players: [...yellow, ...pink],

  // -------------------------------------------------------------------------
  moves: [
    // Accroche : au premier coup dur, le bloc s'effondre… puis se reforme
    { at: 4.4, duration: 0.9, positions: SCATTER },
    { at: 7.0, duration: 1.0, positions: BLOCK },
    // Ch. 1 — le 8 perd le ballon plus haut
    { at: 11.6, duration: 0.8, positions: { A8: { x: 23, y: 55 }, BC: { x: 26, y: 50 } } },
    // …il se replace après ses 5 secondes
    { at: 17.0, duration: 0.8, positions: { A8: { x: 27, y: 65 } } },
    // Contre-exemple : il reste tête basse → trou, l'attaquant s'y engouffre
    { at: 17.9, duration: 0.6, positions: { A8: { x: 23, y: 55 } } },
    { at: 19.4, duration: 0.9, positions: { BS: { x: 29, y: 64.5 } } },
    // Ch. 2 — bloc étiré, puis les consignes le resserrent
    { at: 21.6, duration: 0.9, positions: { ...LOOSE, A8: { x: 26, y: 61 }, BS: { x: 34, y: 71 }, BC: { x: 34, y: 43 } } },
    { at: 26.0, duration: 0.8, positions: { A3: { x: 13, y: 76 }, A4: { x: 27, y: 78 }, A5: { x: 41, y: 78 }, A2: { x: 55, y: 76 } } }, // « Monte »
    { at: 26.8, duration: 0.8, positions: { A4: { x: 30, y: 74 } } }, // « Couvre »
    { at: 27.6, duration: 0.8, positions: { A11: { x: 13, y: 64 }, A8: { x: 27, y: 66 }, A6: { x: 41, y: 66 }, A7: { x: 55, y: 64 } } },
    // Ch. 3 — après le but : relâchement…
    { at: 31.6, duration: 0.8, positions: BLOCK },
    { at: 36.8, duration: 1.0, positions: SCATTER },
    // …les meilleures resserrent le bloc
    { at: 39.8, duration: 1.0, positions: BLOCK },
  ],

  ball: [
    { at: 0.8, holder: "A8" },
    { at: 4.6, holder: "BC", passDuration: 0.4 },
    { at: 7.2, holder: "A8", passDuration: 0.01 },
    { at: 12.4, holder: "BC", passDuration: 0.3 },
    { at: 19.6, holder: "BS", passDuration: 0.5 },
    { at: 21.8, holder: "BC", passDuration: 0.01 },
    { at: 27.8, holder: "A6", passDuration: 0.4 },
    { at: 31.6, holder: "A5", passDuration: 0.01 },
    // Jeu simple : passes courtes
    { at: 41.2, holder: "A4", passDuration: 0.3 },
    { at: 41.8, holder: "A8", passDuration: 0.3 },
    { at: 42.4, holder: "A6", passDuration: 0.3 },
    { at: 43.0, holder: "A5", passDuration: 0.3 },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 66 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 66 }, zoom: 1.1, tilt: 0, rotate: 0 },
    // Ch. 1 : zoom sur le 8
    { at: 11.6, duration: 1.0, focus: { x: 29, y: 61 }, zoom: 1.6 },
    // Ch. 2 : le bloc
    { at: 21.4, duration: 1.0, focus: { x: 34, y: 69 }, zoom: 1.3 },
    // Ch. 3
    { at: 31.4, duration: 1.0, focus: { x: 34, y: 68 }, zoom: 1.25 },
    { at: 40.6, duration: 1.0, focus: { x: 34, y: 70 }, zoom: 1.45 },
    // Conclusion / outro
    { at: 43.4, duration: 1.4, focus: { x: 34, y: 66 }, zoom: 1.1 },
    { at: 47.8, duration: 2.5, focus: { x: 34, y: 62 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 11.8, to: 21.4, player: "A8" },
    { from: 19.4, to: 21.4, player: "BS", color: "red" },
    { from: 26.0, to: 27.0, player: "A5", color: "cyan" },
    { from: 26.8, to: 27.8, player: "A4", color: "cyan" },
    { from: 27.6, to: 31.0, player: "A6", color: "cyan" },
  ],

  tags: [
    { from: 18.2, to: 21.4, player: "A8", text: "TÊTE BASSE", color: "red" },
  ],

  arrows: [
    // Accroche — lignes du bloc
    ...chain(["A3", "A4", "A5", "A2"], "yellow", 0.6, 4.4),
    ...chain(["A11", "A8", "A6", "A7"], "yellow", 0.7, 4.4),
    ...chain(["A9", "A10"], "yellow", 0.8, 4.4),
    // Ch. 1 — le 8 se replace
    { from: 16.9, to: 17.8, start: { x: 23, y: 57 }, end: { x: 26.5, y: 62.5 }, color: "cyan", width: 6, drawDuration: 0.4, label: "SE REPLACE", labelColor: "cyan" },
    // L'attaquant s'engouffre dans le trou
    { from: 19.2, to: 21.4, start: { x: 34, y: 69 }, end: { x: 30, y: 65.5 }, color: "red", width: 5, drawDuration: 0.4 },
    // Ch. 2 — les consignes
    ...[13, 27, 41, 55].map((x, i) => ({
      from: 25.9 + i * 0.04,
      to: 27.6,
      start: { x, y: x === 13 || x === 55 ? 80 : 84 },
      end: { x, y: x === 13 || x === 55 ? 77.5 : 79.5 },
      color: "cyan" as const,
      width: 5,
      drawDuration: 0.3,
    })),
    { from: 26.7, to: 28.4, start: { x: 27, y: 78 }, end: { x: 29.5, y: 75.5 }, color: "cyan", width: 5, drawDuration: 0.3 },
    { from: 27.7, to: 31.0, start: "A8", end: "A6", color: "cyan", width: 5, drawDuration: 0.3 },
    // Ch. 3 — passes simples
    { from: 41.1, to: 43.4, start: "A5", end: "A4", color: "cyan", width: 4, drawDuration: 0.2 },
    { from: 41.7, to: 43.4, start: "A4", end: "A8", color: "cyan", width: 4, drawDuration: 0.2 },
    { from: 42.3, to: 43.4, start: "A8", end: "A6", color: "cyan", width: 4, drawDuration: 0.2 },
    { from: 42.9, to: 43.4, start: "A6", end: "A5", color: "cyan", width: 4, drawDuration: 0.2 },
  ],

  zones: [
    // Le trou laissé par le joueur tête basse
    { from: 18.6, to: 21.4, shape: { kind: "rect", x: 21, y: 60, w: 13, h: 9 }, color: "red", fillOpacity: 0.2, dashedBorder: true, label: "TROU", labelAt: { x: 27.5, y: 69 } },
    // Bloc compact après les consignes
    { from: 28.4, to: 31.2, shape: { kind: "rect", x: 9, y: 59, w: 50, h: 23 }, color: "cyan", fillOpacity: 0.1, label: "BLOC COMPACT", labelAt: { x: 34, y: 85 } },
    // Bloc resserré après le but
    { from: 40.6, to: 43.4, shape: { kind: "rect", x: 9, y: 59, w: 50, h: 23 }, color: "cyan", fillOpacity: 0.1, label: "BLOC SERRÉ", labelAt: { x: 34, y: 85 } },
  ],

  callouts: [
    ...chrono,
    { from: 12.4, to: 14.2, at: { player: "A8", dx: 0, dy: -6.5 }, text: "PERDU", color: "red", variant: "badge", size: 28 },
    // Bulles de consignes
    { from: 25.9, to: 27.4, at: { player: "A5", dx: 0, dy: -6 }, text: "MONTE !", color: "cyan", variant: "badge", size: 28 },
    { from: 26.7, to: 28.2, at: { player: "A4", dx: -2, dy: -6 }, text: "COUVRE !", color: "cyan", variant: "badge", size: 28 },
    { from: 27.5, to: 29.0, at: { player: "A6", dx: 0, dy: -6 }, text: "SEUL !", color: "yellow", variant: "badge", size: 28 },
    // Horloge des 5 minutes
    { from: 34.2, to: 39.6, at: { x: 34, y: 46 }, text: "5:00", color: "red", variant: "badge", size: 40 },
    { from: 37.4, to: 39.6, at: { x: 34, y: 90 }, text: "DÉCONCENTRÉS", color: "red", size: 26 },
  ],

  icons: [],
  measures: [],

  chapters: [
    { from: 9.8, number: "01", title: "La règle des 5 s", color: "yellow" },
    { from: 21.4, number: "02", title: "La communication", color: "cyan" },
    { from: 31.4, number: "03", title: "Après un but", color: "red" },
  ],

  agenda: [
    {
      from: 6.6,
      to: 9.8,
      y: 330,
      items: [
        { number: "01", title: "La règle des 5 s", color: "yellow" },
        { number: "02", title: "La communication", color: "cyan" },
        { number: "03", title: "Après un but", color: "red" },
      ],
    },
  ],

  pills: [
    { from: 14.2, to: 17.8, text: "*5 secondes* pour râler", color: "yellow" },
    { from: 17.8, to: 21.4, text: "Tête basse = ~trou~", color: "red" },
    { from: 23.4, to: 31.2, text: "Une équipe qui *parle*", color: "cyan" },
    { from: 34.0, to: 39.6, text: "~5 minutes~ de danger", color: "red" },
    { from: 39.6, to: 43.4, text: "^Bloc serré^ + ^jeu simple^", color: "cyan" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 6.6,
      lines: [
        { text: "LE MENTAL", color: "yellow", size: 150 },
        { text: "L'ARME TACTIQUE OUBLIÉE", color: "white", size: 54 },
      ],
      pill: "3 réflexes des *grandes équipes*",
      pillAt: 3.2,
    },
  ],

  stamps: [
    { cue: { line: 1, word: "s'effondre" }, text: "S'effondre", color: "red", y: 1180, hold: 1.4 },
    { cue: { line: 6, word: "trou" }, text: "Un trou", color: "red", y: 480, hold: 1.3 },
    { cue: { line: 8, word: "compacte" }, text: "Compacte", color: "cyan", y: 480, hold: 1.2 },
    { cue: { line: 11, word: "marques" }, text: "But !", color: "yellow", y: 480, hold: 1.2 },
    { cue: { line: 12, word: "simple" }, text: "Joue simple", color: "cyan", y: 480, hold: 1.3 },
    { cue: { line: 13, word: "s'entraîne" }, text: "Ça s'entraîne", color: "cyan", y: 480, hold: 1.5 },
  ],

  // Script validé, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~.
  subtitles: [
    // Accroche
    /* 0 */ { from: 0.3, to: 3.2, text: "Tu peux avoir le meilleur plan tactique du monde :", speech: "[confident] Tu peux avoir le meilleur plan tactique du monde :" },
    /* 1 */ { from: 3.2, to: 6.6, text: "sans le mental, ton équipe ~s'effondre~ au premier coup dur.", speech: "[serious] sans le mental, ton équipe s'effondre au premier coup dur." },
    /* 2 */ { from: 6.6, to: 9.8, text: "Voici les *trois réflexes mentaux* des grandes équipes.", speech: "[confident] Voici les trois réflexes mentaux des grandes équipes.", pauseAfter: 0.1 },

    // Ch. 1
    /* 3 */ { from: 9.8, to: 11.8, text: "^Un :^ *la règle des cinq secondes*.", speech: "[confident] Un : la règle des cinq secondes." },
    /* 4 */ { from: 11.8, to: 14.2, text: "Tu perds le ballon ou tu ~rates une passe~ ?", speech: "Tu perds le ballon ou tu rates une passe ?" },
    /* 5 */ { from: 14.2, to: 17.8, text: "Tu as *cinq secondes* pour râler, puis ^tu te replaces^.", speech: "Tu as cinq secondes pour râler, puis tu te replaces." },
    /* 6 */ { from: 17.8, to: 21.4, text: "Un joueur qui ~baisse la tête~, c'est ~un trou dans ton bloc~.", speech: "[serious] Un joueur qui baisse la tête, c'est un trou dans ton bloc.", pauseAfter: 0.1 },

    // Ch. 2
    /* 7 */ { from: 21.4, to: 23.4, text: "^Deux :^ *la communication*.", speech: "[confident] Deux : la communication." },
    /* 8 */ { from: 23.4, to: 25.8, text: "Une équipe qui parle reste ^compacte^.", speech: "Une équipe qui parle reste compacte." },
    /* 9 */ { from: 25.8, to: 31.4, text: "^Monte^, ^couvre^, *seul* : chaque consigne criée fait gagner du temps à ton coéquipier.", speech: "Monte, couvre, seul : chaque consigne criée fait gagner du temps à ton coéquipier.", pauseAfter: 0.1 },

    // Ch. 3
    /* 10 */ { from: 31.4, to: 34.0, text: "^Trois :^ *les cinq minutes après un but*.", speech: "[confident] Trois : les cinq minutes après un but." },
    /* 11 */ { from: 34.0, to: 39.6, text: "Que tu marques ou que tu encaisses, c'est un moment où beaucoup d'équipes ~se déconcentrent~.", speech: "Que tu marques ou que tu encaisses, c'est un moment où beaucoup d'équipes se déconcentrent." },
    /* 12 */ { from: 39.6, to: 43.4, text: "Les meilleures ^resserrent le bloc^ et ^jouent simple^.", speech: "Les meilleures resserrent le bloc et jouent simple.", pauseAfter: 0.1 },

    // Conclusion + CTA
    /* 13 */ { from: 43.4, to: 47.8, text: "Le mental, ce n'est pas un don : ^ça s'entraîne^, comme une tactique.", speech: "[confident] Le mental, ce n'est pas un don : ça s'entraîne, comme une tactique.", pauseAfter: 0.1 },
    /* 14 */ { from: 47.8, to: 52.0, text: "Et toi, c'est quoi *ton réflexe* après une erreur ? Dis-le *en commentaire* !", speech: "[excited] Et toi, c'est quoi ton réflexe après une erreur ? Dis-le en commentaire !", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 3.2, sound: "softTick" },
    { at: 4.4, sound: "softWhoosh" },
    // Sommaire
    { cue: { line: 2, word: "voici" }, sound: "softTick" },
    { cue: { line: 2, word: "voici", offset: 0.22 }, sound: "softTick" },
    { cue: { line: 2, word: "voici", offset: 0.44 }, sound: "softTick" },
    // Chapitres
    { cue: { line: 3, word: "un", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 7, word: "deux", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 10, word: "trois", offset: -0.12 }, sound: "softWhoosh" },
    // Ch. 1 — perte + chrono
    { at: 12.4, sound: "softTick" },
    { at: 14.4, sound: "softTick" },
    { at: 14.95, sound: "softTick" },
    { at: 15.5, sound: "softTick" },
    { at: 16.05, sound: "softTick" },
    { at: 16.6, sound: "softTick" },
    { at: 17.0, sound: "softWhoosh" },
    // Ch. 2 — consignes
    { cue: { line: 9, word: "monte" }, sound: "softTick" },
    { cue: { line: 9, word: "couvre" }, sound: "softTick" },
    { cue: { line: 9, word: "seul" }, sound: "softTick" },
    // Ch. 3
    { at: 34.2, sound: "softTick" },
    { at: 36.8, sound: "softWhoosh" },
    { at: 39.8, sound: "softWhoosh" },
    // Outro
    { at: 47.75, sound: "softWhoosh" },
    { at: 51.6, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 47.8,
    titleTop: "C'EST QUOI TON RÉFLEXE",
    titleHighlight: "APRÈS UNE ERREUR ?",
    pill: "DIS-LE EN COMMENTAIRE",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 51.6,
  },
};
