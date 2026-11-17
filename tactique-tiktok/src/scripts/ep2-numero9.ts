/**
 * ============================================================================
 *  ÉPISODE 2 — "Le vrai rôle du numéro 9" (@clemitch)
 * ============================================================================
 *
 * Voix off générée en TTS (ElevenLabs, voix Corentin) à partir du script, mot pour mot.
 * Les instants ci-dessous sont en "temps scénario" : une fois la voix générée, toute la timeline
 * est recalée sur la durée réelle de chaque phrase (lib/retime.ts).
 *
 * Terrain : x 0 → 68 (gauche → droite), y 0 → 105 (but adverse en haut → notre but en bas).
 */
import type { ArrowDef, PlayerDef, ScriptData } from "../types";
import { chain, pass } from "../scriptData";

// Nous (jaune) en possession, 4-3-3 haut ; eux (rose) en bloc 4-4-2
const teamA: PlayerDef[] = [
  { id: "A1", number: 1, pos: { x: 34, y: 99 } },
  { id: "A4", number: 4, pos: { x: 26, y: 80 } },
  { id: "A5", number: 5, pos: { x: 42, y: 80 } },
  { id: "A3", number: 3, pos: { x: 8, y: 66 } },
  { id: "A2", number: 2, pos: { x: 60, y: 66 } },
  { id: "A6", number: 6, pos: { x: 34, y: 62 } },
  { id: "A8", number: 8, pos: { x: 23, y: 47 } },
  { id: "A10", number: 10, pos: { x: 45, y: 47 } },
  { id: "A11", number: 11, pos: { x: 7, y: 31 } },
  { id: "A7", number: 7, pos: { x: 61, y: 31 } },
  { id: "A9", number: 9, pos: { x: 34, y: 25 } },
].map((p, i) => ({ ...p, team: "A" as const, appearAt: 0.25 + i * 0.03 }));

const teamB: PlayerDef[] = [
  { id: "BG", pos: { x: 34, y: 4 } },
  { id: "BD1", pos: { x: 12, y: 20 } },
  { id: "BD2", pos: { x: 27, y: 19 } },
  { id: "BD3", pos: { x: 41, y: 19 } },
  { id: "BD4", pos: { x: 56, y: 20 } },
  { id: "BM1", pos: { x: 12, y: 35 } },
  { id: "BM2", pos: { x: 27, y: 37 } },
  { id: "BM3", pos: { x: 41, y: 37 } },
  { id: "BM4", pos: { x: 56, y: 35 } },
  { id: "BS1", pos: { x: 29, y: 53 } },
  { id: "BS2", pos: { x: 39, y: 53 } },
].map((p, i) => ({ ...p, team: "B" as const, appearAt: 0.45 + i * 0.03 }));

/** Le bloc jaune remonte de `dy` mètres (séq. 2). */
const blockUp = (dy: number) =>
  Object.fromEntries(
    teamA
      .filter((p) => !["A1", "A9", "A10", "A7", "A11"].includes(p.id))
      .map((p) => [p.id, { x: p.pos.x, y: p.pos.y - dy }]),
  );

const hub = (from: number, to: number): ArrowDef[] =>
  ["A11", "A8", "A10", "A7"].map((id, i) => ({
    from: from + i * 0.15,
    to,
    start: "A9",
    end: id,
    color: "cyan" as const,
    head: false,
    width: 4,
    drawDuration: 0.4,
  }));

export const ep2Numero9: ScriptData = {
  meta: {
    id: "Ep2Numero9",
    title: "ÉP.2 · NUMÉRO 9",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 86,
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
    // Respiration courte entre les phrases (~0,3 s), comme l'épisode 1 ; l'outro dure ~3,8 s après la voix
    pacing: { gap: 0.3, endHold: 3.8 },
    wordPunches: true,
    transitions: [16.8, 36.6, 57.2, 82.3],
    handle: "@clemitch",
    // Bruitages doux : variantes "soft", volume global réduit
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players: [...teamA, ...teamB],

  // -------------------------------------------------------------------------
  moves: [
    // Ch. 1 — les milieux offensifs s'installent dans la zone de liberté
    { at: 33.6, duration: 1.0, positions: { A8: { x: 27, y: 30 }, A10: { x: 41, y: 30 } } },
    // Ch. 2 — retour en place, puis appui dos au but
    { at: 37.0, duration: 1.0, positions: { A8: { x: 23, y: 47 }, A10: { x: 45, y: 47 } } },
    { at: 44.6, duration: 0.7, positions: { BD2: { x: 32, y: 21.5 } } }, // le central vient au contact
    { at: 47.2, duration: 0.9, positions: { A10: { x: 40, y: 35 } } }, // joueur lancé face au jeu
    { at: 52.6, duration: 1.4, positions: { ...blockUp(14), A10: { x: 42, y: 28 } } }, // tout le bloc remonte
    // Ch. 3 — appel croisé du 9 dans le dos, les centraux sont aspirés
    { at: 57.6, duration: 0.8, positions: { BD2: { x: 27, y: 19 } } },
    { at: 65.6, duration: 1.2, positions: { A9: { x: 47, y: 11 } } },
    { at: 72.2, duration: 1.0, positions: { BD3: { x: 46, y: 10 }, BD2: { x: 36, y: 12 }, BD4: { x: 58, y: 15 } } },
    { at: 75.6, duration: 1.1, positions: { A11: { x: 21, y: 20 }, A7: { x: 52, y: 22 } } },
  ],

  ball: [
    { at: 0.8, holder: "A6" },
    { at: 34.6, holder: "A10", passDuration: 0.5 },
    { at: 37.4, holder: "A5", passDuration: 0.6 },
    { at: 40.6, holder: "A9", passDuration: 0.6 },
    { at: 48.6, holder: "A10", passDuration: 0.35 },
    { at: 59.0, holder: "A6", passDuration: 0.6 },
    { at: 76.8, holder: "A11", passDuration: 0.6 },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 50 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 50 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // Accroche : léger zoom sur le 9 pendant "pivot central"
    { at: 8.6, duration: 1.4, focus: { x: 34, y: 38 }, zoom: 1.25 },
    { at: 13.6, duration: 1.0, focus: { x: 34, y: 52 }, zoom: 1.0 },
    // Ch. 1 : zoom sur le 9 et les deux centraux
    { at: 17.4, duration: 1.2, focus: { x: 34, y: 25 }, zoom: 1.75 },
    { at: 31.0, duration: 1.2, focus: { x: 34, y: 29 }, zoom: 1.55 },
    // Ch. 2 : appui dos au but, puis vue large quand le bloc remonte
    { at: 36.8, duration: 1.2, focus: { x: 34, y: 34 }, zoom: 1.4 },
    { at: 50.6, duration: 1.4, focus: { x: 34, y: 48 }, zoom: 1.0 },
    // Ch. 3 : vue haute pour les appels et les boulevards
    { at: 57.2, duration: 1.2, focus: { x: 34, y: 30 }, zoom: 1.3 },
    // Conclusion + outro
    { at: 77.8, duration: 1.4, focus: { x: 34, y: 40 }, zoom: 1.05 },
    { at: 82.3, duration: 2.5, focus: { x: 34, y: 50 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 1.0, to: 13.6, player: "A9" },
    { from: 20.6, to: 31.0, player: "BD2", color: "red" },
    { from: 20.6, to: 31.0, player: "BD3", color: "red" },
    { from: 38.6, to: 48.6, player: "A9", color: "cyan" },
    { from: 47.2, to: 50.4, player: "A10" },
    { from: 62.6, to: 72.0, player: "A9", color: "cyan" },
    { from: 75.4, to: 82.2, player: "A11", color: "cyan" },
    { from: 75.4, to: 82.2, player: "A7", color: "cyan" },
    { from: 77.8, to: 82.2, player: "A9" },
  ],

  tags: [
    { from: 9.0, to: 16.6, player: "A9", text: "AVANT-CENTRE", color: "yellow" },
    { from: 39.0, to: 43.4, player: "A9", text: "DOS AU BUT", color: "cyan" },
  ],

  arrows: [
    // Accroche — "marquer des buts"... "c'est faux"
    { from: 5.2, to: 7.4, start: "A9", end: { x: 34, y: 1 }, color: "yellow", width: 6, drawDuration: 0.5 },
    { from: 7.4, to: 8.8, start: "A9", end: { x: 34, y: 1 }, color: "red", width: 6, drawDuration: 0.15, cut: true },
    // "le pivot central qui fait fonctionner toute ton attaque"
    ...hub(10.2, 13.4),

    // Ch. 1 — fixation des deux centraux
    { from: 20.8, to: 36.4, start: "A9", end: "BD2", color: "red", head: false, dashed: true, width: 4, drawDuration: 0.4 },
    { from: 21.0, to: 36.4, start: "A9", end: "BD3", color: "red", head: false, dashed: true, width: 4, drawDuration: 0.4 },
    // "les empêche de monter ou de sortir presser au milieu"
    { from: 27.0, to: 31.0, start: { x: 27, y: 21.5 }, end: { x: 25, y: 33 }, color: "red", width: 5, drawDuration: 0.4, cut: true },
    { from: 27.3, to: 31.0, start: { x: 41, y: 21.5 }, end: { x: 43, y: 33 }, color: "red", width: 5, drawDuration: 0.4, cut: true },
    // Les milieux offensifs entrent dans la zone
    { from: 33.4, to: 36.4, start: { x: 23, y: 45 }, end: { x: 26.5, y: 33 }, color: "yellow", width: 5, drawDuration: 0.4 },
    { from: 33.5, to: 36.4, start: { x: 45, y: 45 }, end: { x: 41.5, y: 33 }, color: "yellow", width: 5, drawDuration: 0.4 },
    pass("A6", "A10", 34.5, 36.4),

    // Ch. 2 — appui, pression, remise en une touche
    pass("A5", "A9", 40.5, 43.0),
    { from: 44.4, to: 48.4, start: { x: 27, y: 18.5 }, end: { x: 31.5, y: 21 }, color: "red", width: 5, drawDuration: 0.35, label: "PRESSION", labelColor: "red" },
    { from: 47.0, to: 50.4, start: { x: 45, y: 46 }, end: { x: 41, y: 37.5 }, color: "yellow", width: 5, drawDuration: 0.4 },
    { from: 48.5, to: 50.4, start: "A9", end: "A10", color: "cyan", width: 6, drawDuration: 0.3, label: "REMISE", labelColor: "cyan" },
    // Le bloc remonte de 30 mètres
    ...[
      [26, 78, 26, 68],
      [42, 78, 42, 68],
      [34, 60, 34, 50],
      [8, 64, 8, 54],
      [60, 64, 60, 54],
    ].map(([x1, y1, x2, y2], i) => ({
      from: 52.4 + i * 0.06,
      to: 57.0,
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color: "yellow" as const,
      width: 5,
      drawDuration: 0.5,
    })),

    // Ch. 3 — courses croisées / appels dans le dos
    { from: 63.6, to: 71.8, start: "A9", end: { x: 47, y: 11 }, color: "yellow", width: 6, dashed: true, curve: -6, drawDuration: 0.6 },
    { from: 64.6, to: 71.8, start: { x: 34, y: 23 }, end: { x: 21, y: 12 }, color: "yellow", width: 5, dashed: true, curve: 5, drawDuration: 0.6 },
    // Les centraux sont aspirés
    { from: 72.0, to: 77.6, start: { x: 41, y: 18 }, end: { x: 45.5, y: 12.5 }, color: "red", width: 5, drawDuration: 0.4 },
    { from: 72.1, to: 77.6, start: { x: 27, y: 18 }, end: { x: 34.5, y: 13.5 }, color: "red", width: 5, drawDuration: 0.4 },
    // Les ailiers repiquent dans l'axe
    { from: 75.4, to: 82.0, start: { x: 7, y: 29 }, end: { x: 19.5, y: 21 }, color: "cyan", width: 6, curve: -3, drawDuration: 0.5 },
    { from: 75.5, to: 82.0, start: { x: 61, y: 29 }, end: { x: 53.5, y: 23.5 }, color: "cyan", width: 6, curve: 3, drawDuration: 0.5 },
    pass("A6", "A11", 76.7, 82.0),

    // Accroche — lignes de formation légères
    ...chain(["A3", "A4", "A5", "A2"], "yellow", 0.6, 7.0),
    ...chain(["A8", "A6", "A10"], "yellow", 0.7, 7.0),
    ...chain(["BD1", "BD2", "BD3", "BD4"], "red", 0.7, 7.0),
    ...chain(["BM1", "BM2", "BM3", "BM4"], "red", 0.8, 7.0),
  ],

  zones: [
    // Zone de liberté derrière le 9
    { from: 31.4, to: 36.4, shape: { kind: "rect", x: 18, y: 24, w: 32, h: 10 }, color: "cyan", fillOpacity: 0.16, label: "ZONE DE LIBERTÉ", labelAt: { x: 34, y: 33 } },
    // Boulevards ouverts dans le dos des centraux aspirés
    { from: 73.6, to: 82.0, shape: { kind: "rect", x: 14, y: 13, w: 14, h: 13 }, color: "cyan", fillOpacity: 0.16, label: "BOULEVARD", labelAt: { x: 21, y: 25 } },
    { from: 73.8, to: 82.0, shape: { kind: "rect", x: 46, y: 15, w: 12, h: 11 }, color: "cyan", fillOpacity: 0.16 },
  ],

  callouts: [
    { from: 24.8, to: 31.0, at: { x: 34, y: 15.5 }, text: "FIXÉS", color: "red", size: 26 },
    { from: 52.8, to: 57.0, at: { x: 56, y: 58 }, text: "+30 M", color: "yellow", size: 30 },
    { from: 60.0, to: 63.0, at: { player: "A9", dx: 0, dy: 4.8 }, text: "MOBILE", color: "cyan", size: 24 },
    { from: 66.8, to: 72.0, at: { x: 47, y: 7 }, text: "APPEL EN PROFONDEUR", color: "yellow", size: 22 },
    { from: 72.2, to: 77.6, at: { x: 40, y: 7.5 }, text: "ASPIRÉS", color: "red", size: 24 },
  ],

  icons: [
    { from: 25.4, to: 31.0, at: { player: "BD2", dx: -4.5, dy: -1 }, icon: "lock", color: "cyan" },
    { from: 25.6, to: 31.0, at: { player: "BD3", dx: 4.5, dy: -1 }, icon: "lock", color: "cyan" },
  ],

  measures: [],

  chapters: [
    { from: 16.8, number: "01", title: "La fixation", color: "yellow" },
    { from: 36.6, number: "02", title: "Le jeu en remise", color: "cyan" },
    { from: 57.2, number: "03", title: "Les appels", color: "red" },
  ],

  agenda: [
    {
      from: 13.6,
      to: 16.8,
      y: 330,
      items: [
        { number: "01", title: "La fixation", color: "yellow" },
        { number: "02", title: "Le jeu en remise", color: "cyan" },
        { number: "03", title: "Les appels", color: "red" },
      ],
    },
  ],

  pills: [
    { from: 19.0, to: 31.0, text: "Fixer les *2 défenseurs centraux*", color: "yellow" },
    { from: 31.0, to: 36.4, text: "Une *zone de liberté* derrière lui", color: "cyan" },
    { from: 38.6, to: 50.4, text: "*Point d'appui* dos au but", color: "cyan" },
    { from: 50.4, to: 57.0, text: "Tout le bloc *remonte*", color: "yellow" },
    { from: 59.8, to: 62.6, text: "~Jamais statique~", color: "red" },
    { from: 62.6, to: 77.6, text: "*Courses croisées* & *appels*", color: "yellow" },
    { from: 77.8, to: 82.2, text: "Le 9 fait *jouer toute l'attaque*", color: "yellow" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 13.6,
      lines: [
        { text: "LE VRAI RÔLE DU", color: "white", size: 64 },
        { text: "NUMÉRO 9", color: "yellow", size: 150 },
      ],
      pill: "Bien plus qu'un *buteur*",
      pillAt: 4.0,
    },
  ],

  stamps: [
    { cue: { line: 2, word: "faux" }, text: "Faux", color: "red", y: 470, hold: 1.2 },
    { cue: { line: 3, word: "pivot" }, text: "Pivot central", color: "cyan", y: 470, hold: 1.5 },
    { cue: { line: 8, word: "zone" }, text: "Zone de liberté", color: "cyan", y: 480, hold: 1.5 },
    { cue: { line: 11, word: "touche" }, text: "Une touche", color: "yellow", y: 520, hold: 1.3 },
    { cue: { line: 12, word: "30" }, text: "+30 mètres", color: "yellow", y: 480, hold: 1.4 },
    { cue: { line: 16, word: "boulevards" }, text: "Boulevards", color: "cyan", y: 480, hold: 1.4 },
    { cue: { line: 17, word: "stérile" }, text: "Stérile", color: "red", y: 480, hold: 1.6 },
  ],

  // Script fourni, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~ ; `speech` = texte prononcé.
  subtitles: [
    // Accroche
    /* 0 */ { from: 0.3, to: 4.0, text: "Quel est le vrai rôle du *numéro 9* sur un terrain ?", speech: "[confident] Quel est le vrai rôle du numéro neuf sur un terrain ?" },
    /* 1 */ { from: 4.0, to: 7.4, text: "Beaucoup pensent qu'il sert uniquement à ~marquer des buts~.", speech: "Beaucoup pensent qu'il sert uniquement à marquer des buts." },
    /* 2 */ { from: 7.4, to: 8.6, text: "*C'est faux*.", speech: "[serious] C'est faux." },
    /* 3 */ { from: 8.6, to: 13.6, text: "Sur le plan tactique, c'est le ^pivot central^ qui fait fonctionner toute ton attaque.", speech: "[confident] Sur le plan tactique, c'est le pivot central qui fait fonctionner toute ton attaque." },
    /* 4 */ { from: 13.6, to: 16.8, text: "Voici les *trois missions exactes* de ton avant-centre.", speech: "Voici les trois missions exactes de ton avant-centre.", pauseAfter: 0.12 },

    // Ch. 1 — la fixation des défenseurs
    /* 5 */ { from: 16.8, to: 19.0, text: "^Un :^ *la fixation des défenseurs*.", speech: "[confident] Un : la fixation des défenseurs." },
    /* 6 */ { from: 19.0, to: 24.8, text: "Le rôle principal du numéro 9 est d'occuper en permanence les ~deux défenseurs centraux~ adverses.", speech: "Le rôle principal du numéro neuf est d'occuper en permanence les deux défenseurs centraux adverses." },
    /* 7 */ { from: 24.8, to: 31.0, text: "En se plaçant ^exactement entre eux^, il les empêche de ~monter~ ou de ~sortir presser~ au milieu.", speech: "En se plaçant exactement entre eux, il les empêche de monter ou de sortir presser au milieu." },
    /* 8 */ { from: 31.0, to: 36.6, text: "Résultat : il crée une ^zone de liberté^ vitale juste derrière lui pour tes *milieux offensifs*.", speech: "Résultat : il crée une zone de liberté vitale juste derrière lui pour tes milieux offensifs.", pauseAfter: 0.12 },

    // Ch. 2 — le jeu en remise
    /* 9 */ { from: 36.6, to: 38.6, text: "^Deux :^ *le jeu en remise*.", speech: "[confident] Deux : le jeu en remise." },
    /* 10 */ { from: 38.6, to: 43.6, text: "Dos au but, ton numéro 9 est le ^point d'appui^ ultime pour *casser les lignes*.", speech: "Dos au but, ton numéro neuf est le point d'appui ultime pour casser les lignes." },
    /* 11 */ { from: 43.6, to: 50.4, text: "Il encaisse la ~pression physique~, protège son ballon et remet ^en une touche^ vers un joueur lancé face au jeu.", speech: "Il encaisse la pression physique, protège son ballon et remet en une touche vers un joueur lancé face au jeu." },
    /* 12 */ { from: 50.4, to: 57.2, text: "C'est cette action précise qui permet à tout ton bloc-équipe de remonter de *30 mètres* en *deux secondes*.", speech: "C'est cette action précise qui permet à tout ton bloc-équipe de remonter de trente mètres en deux secondes.", pauseAfter: 0.12 },

    // Ch. 3 — la création d'espaces par l'appel
    /* 13 */ { from: 57.2, to: 59.8, text: "^Trois :^ *la création d'espaces* par l'appel.", speech: "[confident] Trois : la création d'espaces par l'appel." },
    /* 14 */ { from: 59.8, to: 62.6, text: "Un bon numéro 9 ne reste ~jamais statique~.", speech: "Un bon numéro neuf ne reste jamais statique." },
    /* 15 */ { from: 62.6, to: 69.4, text: "Par ses ^courses croisées^ ou ses ^appels dans le dos^ de la défense, il étire le bloc adverse *en profondeur*.", speech: "Par ses courses croisées ou ses appels dans le dos de la défense, il étire le bloc adverse en profondeur." },
    /* 16 */ { from: 69.4, to: 77.6, text: "Même s'il ne reçoit pas le ballon, son déplacement ~aspire les défenseurs~ et ouvre des ^boulevards^ pour tes ailiers qui *repiquent dans l'axe*.", speech: "Même s'il ne reçoit pas le ballon, son déplacement aspire les défenseurs et ouvre des boulevards pour tes ailiers qui repiquent dans l'axe.", pauseAfter: 0.15 },

    // Conclusion
    /* 17 */ { from: 77.6, to: 82.2, text: "Sans un numéro 9 intelligent dans ses déplacements, ton attaque est totalement ~stérile~.", speech: "[serious] Sans un numéro neuf intelligent dans ses déplacements, ton attaque est totalement stérile." },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 4.0, sound: "softTick" },
    { at: 10.2, sound: "softTick" },
    // Sommaire
    { cue: { line: 4, word: "voici" }, sound: "softTick" },
    { cue: { line: 4, word: "voici", offset: 0.22 }, sound: "softTick" },
    { cue: { line: 4, word: "voici", offset: 0.44 }, sound: "softTick" },
    // Chapitres
    { cue: { line: 5, word: "un", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 9, word: "deux", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 13, word: "trois", offset: -0.12 }, sound: "softWhoosh" },
    // Étiquettes / actions
    { at: 19.0, sound: "softTick" },
    { at: 25.4, sound: "softTick" },
    { at: 38.6, sound: "softTick" },
    { at: 50.4, sound: "softTick" },
    { at: 59.8, sound: "softTick" },
    { at: 62.6, sound: "softTick" },
    { at: 77.8, sound: "softTick" },
    // Outro
    { at: 82.25, sound: "softWhoosh" },
    { at: 84.7, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 82.3,
    titleTop: "ABONNE-TOI POUR",
    titleHighlight: "L'ÉPISODE 3",
    pill: "UN POSTE DÉCORTIQUÉ À CHAQUE ÉPISODE",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 84.7,
  },
};
