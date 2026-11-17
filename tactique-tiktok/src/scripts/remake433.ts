/**
 * ============================================================================
 *  REMAKE À L'IDENTIQUE — "4-3-3 VS 4-4-2" (vidéo d'origine du second compte, ré-éditée @clemitch)
 * ============================================================================
 *
 * La voix off reprend l'enregistrement d'origine (reference/433-vs-442-original.mp3) converti dans la
 * voix ElevenLabs choisie (mode speech-to-speech) : intonations, pauses et minutage identiques.
 * Tous les instants ci-dessous sont donc ceux de la vidéo d'origine (en secondes).
 */
import type { ArrowDef, ScriptData } from "../types";
import { chain, pass, teamA, teamB, WIPER_LEFT, WIPER_RIGHT } from "../scriptData";

const wiper = (at: number, dir: "left" | "right"): ArrowDef[] =>
  (["BM2", "BM3"] as const).map((id) => {
    const l = WIPER_LEFT[id].x + 2;
    const r = WIPER_RIGHT[id].x - 2;
    return {
      from: at,
      to: at + 1.0,
      start: { x: dir === "left" ? r : l, y: 37 },
      end: { x: dir === "left" ? l : r, y: 37 },
      color: "red" as const,
      width: 5,
      drawDuration: 0.3,
    };
  });

export const remake433vs442: ScriptData = {
  meta: {
    id: "Remake433vs442",
    title: "4-3-3 VS 4-4-2",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 83.2,
    fps: 60,
    width: 1080,
    height: 1920,
    audio: null,
    voice: {
      provider: "elevenlabs",
      voiceId: "IHngRooVccHyPqB4uQkG", // Corentin
      mode: "speech-to-speech",
      referenceAudio: "reference/433-vs-442-original.mp3",
      modelId: "eleven_multilingual_sts_v2",
      stability: 0.5,
      similarityBoost: 0.85,
      style: 0.2,
      volume: 1,
    },
    pacing: { endHold: 1.0 },
    wordPunches: true,
    transitions: [13.3, 34.9, 56.75, 78.0],
    handle: "@clemitch",
  },

  players: [...teamA, ...teamB].map((p) => ({ ...p, appearAt: (p.appearAt ?? 0) * 0.4 })),

  // -------------------------------------------------------------------------
  moves: [
    // Ch. 1 — essuie-glace des milieux roses ("l'essuie-glace et à courir dans le vide")
    { at: 31.6, duration: 0.55, positions: WIPER_LEFT },
    { at: 32.4, duration: 0.55, positions: WIPER_RIGHT },
    { at: 33.2, duration: 0.55, positions: WIPER_LEFT },
    { at: 34.0, duration: 0.55, positions: WIPER_RIGHT },
    { at: 35.0, duration: 0.8, positions: { BM2: { x: 27, y: 41 }, BM3: { x: 41, y: 41 } } },
    // Ch. 2 — pressing de l'attaquant sur le 6 ("le pressing du 4-4-2 est biomécaniquement cassé")
    { at: 52.6, duration: 0.7, positions: { BS2: { x: 37, y: 64 } } },
    { at: 56.6, duration: 0.8, positions: { BS2: { x: 40, y: 58 } } },
    // Ch. 3 — ailiers collés à la touche, latéraux fixés très bas
    {
      at: 63.5,
      duration: 1.0,
      positions: { A7: { x: 65.5, y: 30 }, A11: { x: 2.5, y: 30 }, A2: { x: 61, y: 64 }, A3: { x: 7, y: 64 } },
    },
    { at: 65.3, duration: 0.9, positions: { BD1: { x: 5.5, y: 24 }, BD4: { x: 62.5, y: 24 } } },
    // Les milieux extérieurs reculent pour aider ("obligés de reculer")
    {
      at: 69.9,
      duration: 1.0,
      positions: { BM1: { x: 8, y: 27 }, BM4: { x: 60, y: 27 }, BM2: { x: 26, y: 31 }, BM3: { x: 42, y: 31 } },
    },
    // Les deux attaquants restent hauts, isolés
    { at: 73.4, duration: 1.0, positions: { BS1: { x: 29, y: 62 }, BS2: { x: 39, y: 62 } } },
  ],

  ball: [
    { at: 0.6, holder: "A5" },
    { at: 15.4, holder: "A6", passDuration: 0.5 },
    { at: 54.3, holder: "A8", passDuration: 0.35 },
    { at: 55.2, holder: "A10", passDuration: 0.4 },
    { at: 57.6, holder: "A6" },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 54 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 54 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // Ch. 1 : zoom sur le milieu à "La faille"
    { at: 17.0, duration: 1.2, focus: { x: 34, y: 51 }, zoom: 1.85 },
    { at: 26.0, duration: 1.4, focus: { x: 34, y: 53 }, zoom: 1.75 },
    // Ch. 2 : vue globale, puis zoom sur le 6 au moment des 2 options
    { at: 34.9, duration: 1.2, focus: { x: 34, y: 53 }, zoom: 1.0 },
    { at: 48.6, duration: 1.2, focus: { x: 35, y: 57 }, zoom: 1.35 },
    // Ch. 3 : vue globale
    { at: 56.75, duration: 1.2, focus: { x: 34, y: 52.5 }, zoom: 1.0 },
    // Outro
    { at: 78.0, duration: 2.5, focus: { x: 34, y: 52 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 20.9, to: 24.0, player: "BM2", color: "red" },
    { from: 20.9, to: 24.0, player: "BM3", color: "red" },
    { from: 22.5, to: 26.2, player: "A8" },
    { from: 22.5, to: 26.2, player: "A10" },
    { from: 22.5, to: 26.2, player: "A6" },
    { from: 26.3, to: 34.8, player: "A6", color: "cyan" },
    { from: 48.6, to: 52.5, player: "A6", color: "cyan" },
    { from: 63.5, to: 67.0, player: "A7" },
    { from: 63.5, to: 67.0, player: "A11" },
    { from: 75.4, to: 77.9, player: "BS1", color: "red" },
    { from: 75.4, to: 77.9, player: "BS2", color: "red" },
  ],

  tags: [],

  arrows: [
    // Accroche — lignes des deux formations
    ...chain(["A3", "A4", "A5", "A2"], "yellow", 0.6, 12.9),
    ...chain(["A8", "A6", "A10"], "yellow", 0.7, 12.9),
    ...chain(["A11", "A9", "A7"], "yellow", 0.8, 12.9),
    ...chain(["BD1", "BD2", "BD3", "BD4"], "red", 0.7, 12.9),
    ...chain(["BM1", "BM2", "BM3", "BM4"], "red", 0.8, 12.9),
    ...chain(["BS1", "BS2"], "red", 0.9, 12.9),

    // Ch. 1
    pass("A5", "A6", 15.3, 16.6),
    ...wiper(31.5, "left"),
    ...wiper(32.3, "right"),
    ...wiper(33.1, "left"),
    ...wiper(33.9, "right"),

    // Ch. 2 — lignes droites rigides du 4-4-2 ("les lignes droites", "deux lignes horizontales")
    { from: 39.6, to: 56.5, start: { x: 3, y: 21 }, end: { x: 65, y: 21 }, color: "red", head: false, width: 4, drawDuration: 0.6 },
    { from: 39.9, to: 56.5, start: { x: 3, y: 40 }, end: { x: 65, y: 40 }, color: "red", head: false, width: 4, drawDuration: 0.6 },
    // 2 options de passe courte
    { from: 51.1, to: 56.5, start: "A6", end: "A8", color: "yellow", head: false, width: 6, drawDuration: 0.35 },
    { from: 51.25, to: 56.5, start: "A6", end: "A10", color: "yellow", head: false, width: 6, drawDuration: 0.35 },
    // Pressing cassé
    {
      from: 52.7,
      to: 56.5,
      start: { x: 41, y: 56.5 },
      end: { x: 37, y: 62 },
      color: "red",
      width: 6,
      drawDuration: 0.5,
      cut: true,
      label: "PRESSING CASSÉ",
      labelColor: "red",
    },
    pass("A6", "A8", 54.2, 56.4),
    pass("A8", "A10", 55.1, 56.4),

    // Ch. 3 — repli des milieux extérieurs
    ...[
      [11, 38, 8, 29],
      [57, 38, 60, 29],
    ].map(([x1, y1, x2, y2]) => ({
      from: 69.9,
      to: 77.9,
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color: "red" as const,
      width: 5,
      drawDuration: 0.5,
    })),
    {
      from: 71.5,
      to: 77.9,
      start: { x: 1, y: 44 },
      end: { x: 67, y: 44 },
      color: "red",
      head: false,
      dashed: true,
      width: 5,
      drawDuration: 0.8,
      label: "COUPÉE EN DEUX",
    },
  ],

  zones: [
    { from: 15.5, to: 34.8, shape: { kind: "rect", x: 14, y: 34, w: 40, h: 39 }, color: "dim" },
    ...[
      ["A6", "A8", "A10"],
      ["A4", "A5", "A6"],
      ["A8", "A9", "A10"],
      ["A3", "A8", "A4"],
      ["A2", "A10", "A5"],
      ["A11", "A8", "A9"],
      ["A7", "A10", "A9"],
    ].map((ids, i) => ({
      from: 40.6 + i * 0.28,
      to: 56.5,
      shape: { kind: "polygon" as const, points: ids },
      color: "cyan" as const,
      fillOpacity: 0.13,
    })),
    { from: 64.2, to: 77.9, shape: { kind: "rect", x: -0.3, y: 0, w: 0.6, h: 105 }, color: "yellow", fillOpacity: 0.9 },
    { from: 64.2, to: 77.9, shape: { kind: "rect", x: 67.7, y: 0, w: 0.6, h: 105 }, color: "yellow", fillOpacity: 0.9 },
    { from: 71.5, to: 77.9, shape: { kind: "rect", x: 0, y: 33, w: 68, h: 24 }, color: "red", fillOpacity: 0.14, border: false },
  ],

  callouts: [
    { from: 0.8, to: 12.9, at: { x: 34, y: 93.5 }, text: "4-3-3", color: "yellow", size: 26 },
    { from: 0.9, to: 12.9, at: { x: 34, y: 11.5 }, text: "4-4-2", color: "red", size: 26 },
    { from: 21.2, to: 34.8, at: { x: 52, y: 40 }, text: "2", color: "red", variant: "badge" },
    { from: 23.7, to: 34.8, at: { x: 52, y: 62 }, text: "3", color: "yellow", variant: "badge" },
    { from: 27.6, to: 34.8, at: { player: "A6", dx: 7.5, dy: 0.5 }, text: "LIBRE", color: "cyan" },
    { from: 31.6, to: 34.8, at: { x: 34, y: 33.5 }, text: "ESSUIE-GLACE", color: "red", size: 26 },
    { from: 43.9, to: 56.5, at: { x: 52, y: 17 }, text: "LIGNES RIGIDES", color: "red", size: 24 },
    { from: 51.4, to: 56.5, at: { player: "A6", dx: 0, dy: 4.8 }, text: "2 OPTIONS", color: "yellow", size: 24 },
    { from: 64.2, to: 67.0, at: { x: 34, y: 47 }, text: "COLLÉS À LA TOUCHE", color: "yellow", size: 22 },
    { from: 75.4, to: 77.9, at: { x: 34, y: 66.5 }, text: "ISOLÉS", color: "red", size: 26 },
  ],

  icons: [
    { from: 65.4, to: 77.9, at: { player: "BD1", dx: 0, dy: -5 }, icon: "lock", color: "cyan" },
    { from: 65.5, to: 77.9, at: { player: "BD4", dx: 0, dy: -5 }, icon: "lock", color: "cyan" },
  ],

  measures: [
    { from: 76.2, to: 77.9, a: { x: 58, y: 29 }, b: { x: 58, y: 61 }, label: "40 M", color: "white" },
  ],

  chapters: [
    { from: 13.25, number: "01", title: "Le surnombre fatal", color: "yellow" },
    { from: 34.85, number: "02", title: "La géométrie parfaite", color: "cyan" },
    { from: 56.7, number: "03", title: "Les couloirs", color: "red" },
  ],

  agenda: [
    {
      from: 10.9,
      to: 13.3,
      y: 330,
      items: [
        { number: "01", title: "Le surnombre", color: "yellow" },
        { number: "02", title: "La géométrie", color: "cyan" },
        { number: "03", title: "Les couloirs", color: "red" },
      ],
    },
  ],

  pills: [
    { from: 15.0, to: 19.6, text: "*3 contre 2* permanent", color: "yellow" },
    { from: 19.7, to: 29.1, text: "*2 milieux* contre *3 milieux*", color: "yellow" },
    { from: 29.2, to: 34.8, text: "Ils courent *dans le vide*", color: "red" },
    { from: 36.0, to: 44.9, text: "~Lignes droites~ vs ^triangles^", color: "red" },
    { from: 45.0, to: 56.5, text: "Toujours *2 options* de passe", color: "cyan" },
    { from: 57.6, to: 66.9, text: "Ailiers *collés à la touche*", color: "yellow" },
    { from: 67.0, to: 77.9, text: "Le 4-4-2 *coupé en deux*", color: "red" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 10.9,
      lines: [
        { text: "4-3-3", color: "yellow" },
        { text: "VS", color: "white", size: 76 },
        { text: "4-4-2", color: "red" },
      ],
      pill: "Qui gagne le *duel tactique* ?",
      pillAt: 2.2,
    },
  ],

  stamps: [
    { cue: { line: 2, word: "détruit" }, text: "Détruit", color: "red", y: 470, hold: 1.5 },
    { cue: { line: 3, word: "mathématique" }, text: "Mathématique", color: "yellow", y: 470, hold: 1.1 },
    { cue: { line: 7, word: "3" }, text: "3 contre 2", color: "yellow", y: 520, hold: 1.4 },
    { cue: { line: 11, word: "joueur" }, text: "Joueur libre", color: "cyan", y: 520, hold: 1.4 },
    { cue: { line: 19, word: "cassé" }, text: "Cassé", color: "red", y: 480, hold: 1.3 },
    { cue: { line: 20, word: "l'écartèlement" }, text: "Écartèlement", color: "red", y: 520, hold: 1.0 },
    { cue: { line: 24, word: "coupe" }, text: "Coupé en deux", color: "red", y: 480, hold: 1.6 },
    { cue: { line: 25, word: "40" }, text: "40 mètres", color: "red", y: 480, hold: 1.4 },
  ],

  // Texte d'origine, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~.
  subtitles: [
    /* 0 */ { from: 0.06, to: 2.2, text: "^4-3-3^ contre ^4-4-2^." },
    /* 1 */ { from: 2.2, to: 4.06, text: "Qui gagne le *duel tactique* ?" },
    /* 2 */ { from: 4.06, to: 8.8, text: "Si les deux équipes ont le même niveau, le 4-3-3 ^détruit^ le 4-4-2 à chaque fois." },
    /* 3 */ { from: 8.8, to: 10.2, text: "*C'est mathématique*." },
    /* 4 */ { from: 10.2, to: 13.46, text: "Voici les trois *raisons exactes* de cette domination absolue." },
    /* 5 */ { from: 13.46, to: 15.6, text: "^Un :^ *le surnombre* fatal." },
    /* 6 */ { from: 15.6, to: 17.02, text: "L'asphyxie de l'axe." },
    /* 7 */ { from: 17.02, to: 19.66, text: "La faille : un ^3 contre 2 permanent^." },
    /* 8 */ { from: 19.66, to: 22.38, text: "Le 4-4-2 aligne seulement deux ~milieux axiaux~." },
    /* 9 */ { from: 22.38, to: 24.34, text: "Ton 4-3-3 en aligne *trois*." },
    /* 10 */ { from: 24.34, to: 26.28, text: "Une sentinelle et *deux relayeurs*." },
    /* 11 */ { from: 26.28, to: 29.26, text: "Tu as systématiquement ^un joueur libre^ au cœur du jeu." },
    /* 12 */ { from: 29.26, to: 34.98, text: "Les deux milieux adverses vont passer 90 minutes ~à faire l'essuie-glace~ et à courir ~dans le vide~ sans jamais toucher le ballon." },
    /* 13 */ { from: 34.98, to: 37.0, text: "Deux : la géométrie *parfaite*." },
    /* 14 */ { from: 37.0, to: 38.68, text: "La destruction du *pressing*." },
    /* 15 */ { from: 38.68, to: 41.48, text: "La faille : ~les lignes~ droites *contre les* triangles." },
    /* 16 */ { from: 41.48, to: 44.64, text: "Le 4-4-2 défend sur ^2^ lignes ~horizontales~ très ~rigides~." },
    /* 17 */ { from: 44.64, to: 48.64, text: "Le 4-3-3 attaque en créant des *triangles de passes* permanents sur tout le terrain." },
    /* 18 */ { from: 48.64, to: 52.54, text: "Quoi qu'il arrive, ton porteur de balle aura toujours au moins ^2 options^ de ^passe^ courte." },
    /* 19 */ { from: 52.54, to: 56.86, text: "Le pressing du 4-4-2 est ~biomécaniquement~ cassé avant même d'avoir commencé." },
    /* 20 */ { from: 56.86, to: 59.98, text: "Trois : la paralysie des *couloirs*, ~l'écartèlement~." },
    /* 21 */ { from: 59.98, to: 62.2, text: "La faille : ^fixer la défense^." },
    /* 22 */ { from: 62.2, to: 66.96, text: "Dans ton 4-3-3, tes deux ailiers *collent* la ligne *de touche* et fixent les latéraux adverses très bas." },
    /* 23 */ { from: 66.96, to: 71.32, text: "Résultat, les milieux extérieurs du 4-4-2 sont obligés de ~reculer~ pour venir aider," },
    /* 24 */ { from: 71.32, to: 73.3, text: "ce qui coupe ~totalement~ leur ~équipe en deux~." },
    /* 25 */ { from: 73.3, to: 78.02, text: "Leur duo d'attaquants se retrouve ~complètement isolé~ à 40 mètres du reste de l'équipe." },
    /* 26 */ { from: 78.02, to: 83.2, text: "Tu veux le *playbook* tactique *complet* pour exploiter les ^failles de toutes^ les formations ^adverses^ ?", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "impact", volume: 0.55 },
    { at: 0.15, sound: "whoosh", volume: 0.45 },
    { at: 2.2, sound: "tick" },
    { at: 10.9, sound: "tick" },
    { at: 11.12, sound: "tick" },
    { at: 11.34, sound: "tick" },
    { at: 13.2, sound: "whoosh" },
    { at: 13.3, sound: "glitch", volume: 0.35 },
    { at: 15.0, sound: "tick" },
    { at: 19.7, sound: "tick" },
    { at: 21.2, sound: "tick" },
    { at: 23.7, sound: "tick" },
    { at: 29.2, sound: "tick" },
    { at: 34.8, sound: "whoosh" },
    { at: 34.9, sound: "glitch", volume: 0.35 },
    { at: 36.0, sound: "tick" },
    { at: 45.0, sound: "tick" },
    { at: 53.2, sound: "glitch", volume: 0.4 },
    { at: 56.65, sound: "whoosh" },
    { at: 56.75, sound: "glitch", volume: 0.35 },
    { at: 57.6, sound: "tick" },
    { at: 65.4, sound: "tick" },
    { at: 67.0, sound: "tick" },
    { at: 77.95, sound: "whoosh", volume: 0.5 },
    { at: 82.3, sound: "click" },
  ],

  outro: {
    from: 78.0,
    titleTop: "TU VEUX LE PLAYBOOK",
    titleHighlight: "COMPLET ?",
    pill: "EXPLOITE LES FAILLES DE TOUTES LES FORMATIONS",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 82.3,
  },
};
