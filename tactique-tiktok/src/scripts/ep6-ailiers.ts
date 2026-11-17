/**
 * ============================================================================
 *  ÉPISODE 6 — "L'exercice qui transforme tes ailiers" (@clemitch)
 * ============================================================================
 *
 * Exercice sur un demi-terrain (on attaque vers le haut), couloir droit de 10 m.
 * Jaune : ailier (7), latéral (2), deux attaquants (9, 10). Rose : un défenseur + le gardien.
 * Pas de musique (uniquement voix off + bruitages). Script validé, mot pour mot.
 */
import type { CalloutDef, PlayerDef, ScriptData, ZoneDef } from "../types";

const players: PlayerDef[] = [
  { id: "A7", team: "A", number: 7, pos: { x: 61, y: 52 }, appearAt: 16.0 },
  { id: "A2", team: "A", number: 2, pos: { x: 61, y: 66 }, appearAt: 16.6 },
  { id: "DEF", team: "B", pos: { x: 61, y: 38 }, appearAt: 17.2 },
  { id: "A9", team: "A", number: 9, pos: { x: 38, y: 30 }, appearAt: 18.2 },
  { id: "A10", team: "A", number: 10, pos: { x: 28, y: 33 }, appearAt: 18.5 },
  { id: "GK", team: "B", pos: { x: 34, y: 3 }, appearAt: 18.8 },
];

/** Plots jaunes le long du couloir (petits triangles). */
const cones: ZoneDef[] = [16, 26, 36, 46, 56, 66].map((y, i) => ({
  from: 11.4 + i * 0.12,
  to: 57.0,
  shape: { kind: "polygon", points: [{ x: 58, y: y - 0.9 }, { x: 58.9, y: y + 0.7 }, { x: 57.1, y: y + 0.7 }] },
  color: "yellow",
  fillOpacity: 0.95,
  border: false,
}));

/** Chrono de 6 secondes qui défile pendant la finition. */
const chrono: CalloutDef[] = [6, 5, 4, 3, 2, 1].map((n, i) => ({
  from: 40.4 + i * 0.6,
  to: 40.4 + (i + 1) * 0.6,
  at: { x: 50, y: 22 },
  text: `${n} S`,
  color: n <= 2 ? "red" : "yellow",
  variant: "badge",
  size: 40,
}));

/** Compteur de touches de l'ailier. */
const touches: CalloutDef[] = [1, 2, 3].map((n, i) => ({
  from: 46.4 + i * 0.8,
  to: 49.4,
  at: { player: "A7", dx: -7 - i * 0.2, dy: 0 },
  text: `${n}/3`,
  color: n === 3 ? "red" : "yellow",
  variant: "badge",
  size: 30,
}));

export const ep6Ailiers: ScriptData = {
  meta: {
    id: "Ep6Ailiers",
    title: "ÉP.6 · AILIERS",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 61,
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
    transitions: [19.6, 25.6, 38.0, 55.6],
    handle: "@clemitch",
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players,

  // -------------------------------------------------------------------------
  moves: [
    // Étape 1 — l'ailier fixe : il conduit droit sur le défenseur, qui se positionne
    { at: 21.8, duration: 1.6, positions: { A7: { x: 61, y: 44 }, A2: { x: 61, y: 58 } } },
    { at: 22.6, duration: 1.0, positions: { DEF: { x: 60, y: 39.5 } } },
    // Étape 2 — option A : le défenseur reste, le latéral chevauche par l'extérieur
    { at: 28.4, duration: 1.8, positions: { A2: { x: 66, y: 33 } } },
    // Option B : on rejoue — le défenseur suit le latéral, l'ailier repique dans l'axe
    { at: 32.8, duration: 0.8, positions: { A7: { x: 61, y: 44 }, A2: { x: 61, y: 58 }, DEF: { x: 60, y: 39.5 } } },
    { at: 33.6, duration: 1.6, positions: { A2: { x: 66, y: 33 } } },
    { at: 34.2, duration: 1.2, positions: { DEF: { x: 65, y: 36 } } },
    { at: 35.4, duration: 1.2, positions: { A7: { x: 49, y: 35 } } },
    // Étape 3 — finition : centre, attaque du premier et du second poteau
    { at: 38.2, duration: 0.9, positions: { A7: { x: 62, y: 30 }, A2: { x: 61, y: 58 }, DEF: { x: 58, y: 24 }, A9: { x: 38, y: 30 }, A10: { x: 28, y: 33 } } },
    { at: 40.6, duration: 1.4, positions: { A7: { x: 63, y: 18 } } },
    { at: 41.4, duration: 1.4, positions: { A9: { x: 41, y: 9 }, A10: { x: 27, y: 11 } } },
    // La règle : 3 touches maximum
    { at: 45.8, duration: 0.8, positions: { A7: { x: 61, y: 50 }, A9: { x: 38, y: 30 }, A10: { x: 28, y: 33 }, DEF: { x: 60, y: 39.5 } } },
    { at: 46.4, duration: 0.6, positions: { A7: { x: 61, y: 46 } } },
    { at: 47.2, duration: 0.6, positions: { A7: { x: 62, y: 42 } } },
    { at: 48.0, duration: 0.6, positions: { A7: { x: 64, y: 37 } } },
  ],

  ball: [
    { at: 16.0, holder: "A7" },
    { at: 31.4, holder: "A2", passDuration: 0.5 },
    { at: 32.8, holder: "A7", passDuration: 0.01 },
    { at: 42.6, holder: "A9", passDuration: 0.55 },
    { at: 45.8, holder: "A7", passDuration: 0.01 },
    { at: 48.7, holder: "A9", passDuration: 0.55 },
  ],

  camera: [
    { at: 0, focus: { x: 40, y: 40 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 40, y: 40 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // Mise en place : demi-terrain
    { at: 9.4, duration: 1.4, focus: { x: 44, y: 36 }, zoom: 1.45 },
    // Étapes 1 & 2 : zoom sur le couloir
    { at: 19.6, duration: 1.2, focus: { x: 54, y: 44 }, zoom: 1.7 },
    // Étape 3 : la surface
    { at: 38.0, duration: 1.2, focus: { x: 44, y: 22 }, zoom: 1.55 },
    // La règle
    { at: 45.6, duration: 1.0, focus: { x: 52, y: 38 }, zoom: 1.5 },
    { at: 51.4, duration: 1.4, focus: { x: 44, y: 36 }, zoom: 1.3 },
    // Outro
    { at: 55.6, duration: 2.5, focus: { x: 40, y: 40 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 21.4, to: 25.6, player: "A7" },
    { from: 27.2, to: 32.6, player: "A2", color: "cyan" },
    { from: 32.8, to: 38.0, player: "A7", color: "cyan" },
    { from: 41.4, to: 45.6, player: "A9" },
    { from: 41.4, to: 45.6, player: "A10" },
    { from: 45.8, to: 49.6, player: "A7" },
  ],

  tags: [
    { from: 16.0, to: 19.6, player: "A7", text: "AILIER", color: "yellow" },
    { from: 16.6, to: 19.6, player: "A2", text: "LATÉRAL", color: "yellow" },
    { from: 17.2, to: 19.6, player: "DEF", text: "DÉFENSEUR", color: "red" },
    { from: 18.2, to: 19.6, player: "A9", text: "ATTAQUANT", color: "yellow" },
    { from: 18.5, to: 19.6, player: "A10", text: "ATTAQUANT", color: "yellow" },
  ],

  arrows: [
    // Étape 1 — conduite droit sur le défenseur
    { from: 21.6, to: 25.6, start: { x: 61, y: 50 }, end: { x: 61, y: 46 }, color: "yellow", width: 5, drawDuration: 0.6 },
    // Option A — chevauchement par l'extérieur
    { from: 28.2, to: 32.6, start: { x: 62, y: 56 }, end: { x: 66, y: 35 }, color: "cyan", width: 6, curve: -4, dashed: true, drawDuration: 0.8 },
    { from: 31.3, to: 32.6, start: "A7", end: "A2", color: "cyan", width: 5, drawDuration: 0.3 },
    // Option B — le défenseur suit, l'ailier repique
    { from: 33.6, to: 38.0, start: { x: 62, y: 56 }, end: { x: 66, y: 35 }, color: "cyan", width: 5, curve: -4, dashed: true, drawDuration: 0.6 },
    { from: 34.2, to: 38.0, start: { x: 60, y: 38 }, end: { x: 64, y: 36 }, color: "red", width: 5, drawDuration: 0.4 },
    { from: 35.2, to: 38.0, start: { x: 60, y: 43 }, end: { x: 50.5, y: 36 }, color: "cyan", width: 6, curve: 3, drawDuration: 0.6, label: "REPIQUE", labelColor: "cyan" },
    // Étape 3 — appels aux deux poteaux + centre
    { from: 41.2, to: 45.6, start: { x: 38, y: 28 }, end: { x: 40.5, y: 11 }, color: "yellow", width: 5, drawDuration: 0.6 },
    { from: 41.3, to: 45.6, start: { x: 28, y: 31 }, end: { x: 27.5, y: 13 }, color: "yellow", width: 5, drawDuration: 0.6 },
    { from: 42.5, to: 45.6, start: { x: 62, y: 18 }, end: { x: 42, y: 10 }, color: "cyan", width: 6, curve: -3, drawDuration: 0.5 },
    // La règle — centre après la 3e touche
    { from: 48.6, to: 51.4, start: { x: 63, y: 36 }, end: { x: 40, y: 30 }, color: "cyan", width: 5, curve: -3, drawDuration: 0.5 },
  ],

  zones: [
    // Demi-terrain + couloir de 10 m
    { from: 9.6, to: 57.0, shape: { kind: "rect", x: 0, y: 0, w: 68, h: 52.5 }, color: "dim", fillOpacity: 0.06 },
    { from: 10.4, to: 57.0, shape: { kind: "rect", x: 58, y: 12, w: 10, h: 58 }, color: "yellow", fillOpacity: 0.1, dashedBorder: true, label: "COULOIR", labelAt: { x: 63, y: 74 } },
    ...cones,
    // Premier et second poteau
    { from: 41.2, to: 45.6, shape: { kind: "rect", x: 37, y: 5, w: 9, h: 8 }, color: "yellow", fillOpacity: 0.16, label: "1ER POTEAU", labelAt: { x: 44, y: 16 } },
    { from: 41.3, to: 45.6, shape: { kind: "rect", x: 22, y: 5, w: 9, h: 8 }, color: "cyan", fillOpacity: 0.16, label: "2ND POTEAU", labelAt: { x: 24, y: 16 } },
  ],

  callouts: [
    ...chrono,
    ...touches,
    { from: 22.8, to: 25.6, at: { player: "DEF", dx: -7, dy: 0 }, text: "FIXÉ", color: "red", size: 24 },
    { from: 27.2, to: 32.6, at: { x: 46, y: 46 }, text: "OPTION A", color: "cyan", variant: "badge", size: 30 },
    { from: 32.8, to: 38.0, at: { x: 46, y: 46 }, text: "OPTION B", color: "cyan", variant: "badge", size: 30 },
  ],

  icons: [],

  measures: [{ from: 11.0, to: 19.6, a: { x: 58, y: 62 }, b: { x: 68, y: 62 }, label: "10 M", color: "yellow" }],

  chapters: [
    { from: 19.6, number: "01", title: "Fixer", color: "yellow" },
    { from: 25.6, number: "02", title: "Le choix", color: "cyan" },
    { from: 38.0, number: "03", title: "La finition", color: "red" },
  ],

  pills: [
    { from: 9.4, to: 19.6, text: "*Mise en place*", color: "yellow" },
    { from: 21.4, to: 25.6, text: "L'ailier *fixe* le défenseur", color: "yellow" },
    { from: 27.2, to: 32.6, text: "Il reste → ^chevauchement^", color: "cyan" },
    { from: 32.8, to: 38.0, text: "Il suit → ^repique^ ou ^1 contre 1^", color: "cyan" },
    { from: 39.6, to: 45.6, text: "Centre en *moins de 6 s*", color: "red" },
    { from: 45.6, to: 51.4, text: "*3 touches max*", color: "red" },
    { from: 51.4, to: 55.6, text: "*10 min* par séance", color: "yellow" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 9.2,
      lines: [
        { text: "L'EXERCICE QUI", color: "white", size: 64 },
        { text: "TRANSFORME", color: "yellow", size: 120 },
        { text: "TES AILIERS", color: "cyan", size: 110 },
      ],
      pill: "Exercice tactique · *ailiers*",
      pillAt: 3.0,
    },
  ],

  stamps: [
    { cue: { line: 1, word: "manque" }, text: "Manque de solutions", color: "red", y: 1180, hold: 1.5 },
    { cue: { line: 8, word: "chevauchement" }, text: "Chevauchement", color: "cyan", y: 480, hold: 1.3 },
    { cue: { line: 9, word: "repique" }, text: "Repique", color: "cyan", y: 480, hold: 1.2 },
    { cue: { line: 12, word: "trois" }, text: "3 touches max", color: "red", y: 480, hold: 1.4 },
    { cue: { line: 14, word: "imprévisibles" }, text: "Imprévisibles", color: "cyan", y: 480, hold: 1.5 },
  ],

  // Script validé, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~.
  subtitles: [
    // Accroche
    /* 0 */ { from: 0.3, to: 3.0, text: "Ton ailier perd tous ses ~un contre un~ ?", speech: "[confident] Ton ailier perd tous ses un contre un ?" },
    /* 1 */ { from: 3.0, to: 7.0, text: "Le problème, ce n'est pas sa technique, c'est son ~manque de solutions~.", speech: "Le problème, ce n'est pas sa technique, c'est son manque de solutions." },
    /* 2 */ { from: 7.0, to: 9.4, text: "Voici *l'exercice parfait* pour le régler.", speech: "[confident] Voici l'exercice parfait pour le régler.", pauseAfter: 0.1 },

    // Mise en place
    /* 3 */ { from: 9.4, to: 15.2, text: "La mise en place : un demi-terrain, un couloir de *dix mètres* de large tracé le long de la touche.", speech: "La mise en place : un demi-terrain, un couloir de dix mètres de large tracé le long de la touche." },
    /* 4 */ { from: 15.2, to: 19.6, text: "Un ^ailier^, un ^latéral^, un ~défenseur~, et ^deux attaquants^ dans la surface.", speech: "Un ailier, un latéral, un défenseur, et deux attaquants dans la surface.", pauseAfter: 0.1 },

    // Étape 1
    /* 5 */ { from: 19.6, to: 21.4, text: "^Étape un :^ *l'ailier fixe*.", speech: "[confident] Étape un : l'ailier fixe." },
    /* 6 */ { from: 21.4, to: 25.6, text: "Il conduit le ballon droit sur le défenseur pour l'obliger à *se positionner*.", speech: "Il conduit le ballon droit sur le défenseur pour l'obliger à se positionner.", pauseAfter: 0.1 },

    // Étape 2
    /* 7 */ { from: 25.6, to: 27.2, text: "^Étape deux :^ *le choix*.", speech: "[confident] Étape deux : le choix." },
    /* 8 */ { from: 27.2, to: 32.6, text: "Si le défenseur reste sur lui, le latéral déborde par l'extérieur : c'est ^le chevauchement^.", speech: "Si le défenseur reste sur lui, le latéral déborde par l'extérieur : c'est le chevauchement." },
    /* 9 */ { from: 32.6, to: 38.0, text: "Si le défenseur suit le latéral, l'ailier ^repique dans l'axe^ ou l'élimine en ^un contre un^.", speech: "Si le défenseur suit le latéral, l'ailier repique dans l'axe ou l'élimine en un contre un.", pauseAfter: 0.1 },

    // Étape 3
    /* 10 */ { from: 38.0, to: 39.6, text: "^Étape trois :^ *la finition*.", speech: "[confident] Étape trois : la finition." },
    /* 11 */ { from: 39.6, to: 45.6, text: "Centre en moins de ~six secondes~, avec deux attaquants qui attaquent le *premier* et le *second poteau*.", speech: "Centre en moins de six secondes, avec deux attaquants qui attaquent le premier et le second poteau.", pauseAfter: 0.1 },

    // La règle
    /* 12 */ { from: 45.6, to: 49.6, text: "La règle qui change tout : ~trois touches maximum~ pour l'ailier.", speech: "[serious] La règle qui change tout : trois touches maximum pour l'ailier." },
    /* 13 */ { from: 49.6, to: 51.4, text: "Ça l'oblige à *décider vite*.", speech: "Ça l'oblige à décider vite.", pauseAfter: 0.1 },

    // Conclusion + CTA
    /* 14 */ { from: 51.4, to: 55.6, text: "Fais-le *dix minutes* par séance, et tes ailiers deviennent ^imprévisibles^.", speech: "[confident] Fais-le dix minutes par séance, et tes ailiers deviennent imprévisibles.", pauseAfter: 0.1 },
    /* 15 */ { from: 55.6, to: 58.8, text: "Enregistre la vidéo pour ton *prochain entraînement* !", speech: "[excited] Enregistre la vidéo pour ton prochain entraînement !", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 3.0, sound: "softTick" },
    { at: 9.4, sound: "softWhoosh" },
    // Plots + joueurs qui apparaissent
    { at: 11.4, sound: "softTick" },
    { at: 16.0, sound: "softTick" },
    { at: 16.6, sound: "softTick" },
    { at: 17.2, sound: "softTick" },
    { at: 18.2, sound: "softTick" },
    // Chapitres
    { cue: { line: 5, word: "étape", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 7, word: "étape", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 10, word: "étape", offset: -0.12 }, sound: "softWhoosh" },
    // Actions
    { at: 27.2, sound: "softTick" },
    { at: 28.4, sound: "softWhoosh" },
    { at: 32.8, sound: "softTick" },
    { at: 35.4, sound: "softWhoosh" },
    // Chrono
    { at: 40.4, sound: "softTick" },
    { at: 41.0, sound: "softTick" },
    { at: 41.6, sound: "softTick" },
    { at: 42.2, sound: "softTick" },
    { at: 42.6, sound: "softWhoosh" },
    // Compteur de touches
    { at: 46.4, sound: "softTick" },
    { at: 47.2, sound: "softTick" },
    { at: 48.0, sound: "softTick" },
    { at: 48.7, sound: "softWhoosh" },
    // Outro
    { at: 55.55, sound: "softWhoosh" },
    { at: 58.4, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 55.6,
    titleTop: "ENREGISTRE POUR TON",
    titleHighlight: "PROCHAIN ENTRAÎNEMENT",
    pill: "ÉPISODE 6 · EXERCICE AILIERS",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 58.4,
  },
};
