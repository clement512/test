/**
 * ============================================================================
 *  ÉPISODE 3 — "Le piège du pressing (et comment éviter de prendre des contres)" (@clemitch)
 * ============================================================================
 *
 * Point de vue défensif : TON équipe (jaune) défend le but du bas, l'adversaire (rose) attaque
 * vers le bas. Séquence 1 = l'erreur (le milieu presse seul → trou → 3 contre 2).
 * Séquence 2 = la règle d'or (tout le bloc monte de 5 m → compacité).
 *
 * Voix off TTS (Corentin) à partir du texte fourni, mot pour mot ; timeline recalée sur la voix,
 * puis calée sur le rythme de la musique.
 */
import type { PlayerDef, Point, ScriptData } from "../types";

const teamA: PlayerDef[] = [
  { id: "A1", number: 1, pos: { x: 34, y: 100 } },
  { id: "A3", number: 3, pos: { x: 10, y: 82 } },
  { id: "A4", number: 4, pos: { x: 27, y: 84 } },
  { id: "A5", number: 5, pos: { x: 41, y: 84 } },
  { id: "A2", number: 2, pos: { x: 58, y: 82 } },
  { id: "A8", number: 8, pos: { x: 20, y: 67 } },
  { id: "A6", number: 6, pos: { x: 34, y: 69 } },
  { id: "A10", number: 10, pos: { x: 48, y: 67 } },
  { id: "A11", number: 11, pos: { x: 12, y: 52 } },
  { id: "A9", number: 9, pos: { x: 34, y: 49 } },
  { id: "A7", number: 7, pos: { x: 56, y: 52 } },
].map((p, i) => ({ ...p, team: "A" as const, appearAt: 0.25 + i * 0.03 }));

const teamB: PlayerDef[] = [
  { id: "BG", pos: { x: 34, y: 5 } },
  { id: "BD1", pos: { x: 14, y: 30 } },
  { id: "BD2", pos: { x: 28, y: 33 } },
  { id: "BD3", pos: { x: 40, y: 33 } },
  { id: "BD4", pos: { x: 54, y: 30 } },
  { id: "BM1", pos: { x: 22, y: 55 } },
  { id: "BM2", pos: { x: 38, y: 59 } }, // porteur du ballon
  { id: "BW1", pos: { x: 8, y: 66 } },
  { id: "BW2", pos: { x: 60, y: 66 } },
  { id: "BS1", pos: { x: 33, y: 77 } }, // attaquant qui va décrocher
  { id: "BS2", pos: { x: 21, y: 76 } },
].map((p, i) => ({ ...p, team: "B" as const, appearAt: 0.45 + i * 0.03 }));

const startPos = Object.fromEntries([...teamA, ...teamB].map((p) => [p.id, p.pos])) as Record<string, Point>;

export const ep3Pressing: ScriptData = {
  meta: {
    id: "Ep3Pressing",
    title: "ÉP.3 · PRESSING",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 56.6,
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
    music: {
      file: "music/son-tiktok-etendu.mp3",
      bpm: 117.4,
      offset: 0,
      volume: 0.3,
      duck: 0.4,
      beatSync: { lines: true, maxDelay: 0.22, snap: 0.15 },
    },
    pacing: { gap: 0.3, endHold: 2.2 },
    wordPunches: true,
    transitions: [34.5, 45.8],
    handle: "@clemitch",
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players: [...teamA, ...teamB],

  // -------------------------------------------------------------------------
  moves: [
    // Séq. 1 — le milieu sort presser le porteur
    { at: 11.0, duration: 0.9, positions: { A6: { x: 37, y: 62 } } },
    // L'attaquant décroche dans le trou, reçoit, se retourne… contre-attaque 3 contre 2
    { at: 26.6, duration: 0.8, positions: { BS1: { x: 34, y: 70 } } },
    { at: 30.6, duration: 1.6, positions: { BS1: { x: 34, y: 88 }, BS2: { x: 22, y: 91 }, BW2: { x: 48, y: 90 } } },
    { at: 30.8, duration: 1.6, positions: { A4: { x: 29, y: 94 }, A5: { x: 39, y: 94 } } },
    // Séq. 2 — retour à la situation de départ…
    { at: 34.6, duration: 0.9, positions: startPos },
    // …le milieu presse à nouveau, et TOUT le bloc monte de 5 m avec lui
    { at: 37.4, duration: 0.9, positions: { A6: { x: 37, y: 62 } } },
    {
      at: 39.2,
      duration: 1.1,
      positions: {
        A3: { x: 10, y: 77 },
        A4: { x: 27, y: 79 },
        A5: { x: 41, y: 79 },
        A2: { x: 58, y: 77 },
        A8: { x: 22, y: 63 },
        A10: { x: 46, y: 63 },
        A1: { x: 34, y: 95 },
      },
    },
    // L'attaquant n'a plus d'espace : il reste bloqué
    { at: 40.6, duration: 0.8, positions: { BS1: { x: 33, y: 73 } } },
  ],

  ball: [
    { at: 0.8, holder: "BM2" },
    { at: 28.0, holder: "BS1", passDuration: 0.5 },
    { at: 34.6, holder: "BM2", passDuration: 0.01 },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 62 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 60 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // "Regarde" : zoom sur la zone milieu / défense
    { at: 9.6, duration: 1.2, focus: { x: 34, y: 71 }, zoom: 1.45 },
    // Contre-attaque : la caméra suit vers le but
    { at: 30.4, duration: 1.6, focus: { x: 34, y: 82 }, zoom: 1.35 },
    // Règle d'or
    { at: 34.5, duration: 1.2, focus: { x: 34, y: 71 }, zoom: 1.35 },
    { at: 43.5, duration: 1.2, focus: { x: 34, y: 70 }, zoom: 1.2 },
    // Outro
    { at: 45.8, duration: 2.5, focus: { x: 34, y: 60 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 10.4, to: 15.5, player: "A6" },
    { from: 16.6, to: 25.5, player: "A4", color: "red" },
    { from: 16.6, to: 25.5, player: "A5", color: "red" },
    { from: 26.4, to: 34.4, player: "BS1", color: "red" },
    { from: 37.2, to: 43.5, player: "A6", color: "cyan" },
  ],

  tags: [
    { from: 11.2, to: 15.4, player: "A6", text: "PRESSE", color: "yellow" },
    { from: 17.6, to: 25.4, player: "A4", text: "NE MONTE PAS", color: "red" },
    { from: 26.8, to: 30.4, player: "BS1", text: "DÉCROCHE", color: "red" },
  ],

  arrows: [
    // Séq. 1
    { from: 10.8, to: 15.4, start: { x: 34, y: 69 }, end: { x: 37, y: 63.5 }, color: "yellow", width: 5, drawDuration: 0.4 },
    { from: 16.8, to: 22.0, start: { x: 27, y: 82 }, end: { x: 28, y: 74 }, color: "red", width: 5, drawDuration: 0.35, cut: true },
    { from: 16.9, to: 22.0, start: { x: 41, y: 82 }, end: { x: 40, y: 74 }, color: "red", width: 5, drawDuration: 0.35, cut: true },
    { from: 26.4, to: 30.4, start: { x: 33, y: 76 }, end: { x: 34, y: 71.5 }, color: "red", width: 5, drawDuration: 0.4 },
    { from: 27.9, to: 30.4, start: "BM2", end: "BS1", color: "red", width: 5, drawDuration: 0.3 },
    // Contre-attaque : 3 contre 2
    { from: 30.4, to: 34.4, start: { x: 34, y: 72 }, end: { x: 34, y: 86 }, color: "red", width: 6, drawDuration: 0.5 },
    { from: 30.5, to: 34.4, start: { x: 21, y: 78 }, end: { x: 22, y: 89 }, color: "red", width: 6, drawDuration: 0.5 },
    { from: 30.6, to: 34.4, start: { x: 60, y: 68 }, end: { x: 49, y: 88 }, color: "red", width: 6, curve: 3, drawDuration: 0.5 },

    // Séq. 2 — tout le bloc monte de 5 m
    { from: 37.2, to: 43.4, start: { x: 34, y: 69 }, end: { x: 37, y: 63.5 }, color: "yellow", width: 5, drawDuration: 0.4 },
    ...[
      [10, 82],
      [27, 84],
      [41, 84],
      [58, 82],
      [20, 67],
      [48, 67],
    ].map(([x, y], i) => ({
      from: 39.0 + i * 0.05,
      to: 43.4,
      start: { x, y },
      end: { x, y: y - 4.5 },
      color: "yellow" as const,
      width: 5,
      drawDuration: 0.4,
    })),
  ],

  zones: [
    // Le trou entre les lignes (séq. 1)
    { from: 22.2, to: 30.2, shape: { kind: "rect", x: 20, y: 70, w: 28, h: 10 }, color: "red", fillOpacity: 0.2, dashedBorder: true, label: "TROU ENTRE LES LIGNES", labelAt: { x: 34, y: 73.2 } },
    // Le bloc compact (séq. 2)
    { from: 41.0, to: 45.6, shape: { kind: "rect", x: 6, y: 59, w: 56, h: 23 }, color: "cyan", fillOpacity: 0.12, label: "BLOC COMPACT", labelAt: { x: 34, y: 86 } },
  ],

  callouts: [
    { from: 29.4, to: 31.0, at: { player: "BS1", dx: 8, dy: 0 }, text: "SE RETOURNE", color: "red", size: 22 },
    { from: 32.2, to: 34.4, at: { x: 58, y: 87 }, text: "3", color: "red", variant: "badge" },
    { from: 32.4, to: 34.4, at: { x: 58, y: 96 }, text: "2", color: "yellow", variant: "badge" },
    { from: 41.0, to: 43.4, at: { x: 34, y: 76 }, text: "PLUS D'ESPACE", color: "cyan", size: 22 },
  ],

  icons: [{ from: 14.0, to: 15.5, at: { player: "A6", dx: 5, dy: -4 }, icon: "check", color: "cyan" }],

  measures: [{ from: 39.6, to: 43.4, a: { x: 51, y: 85 }, b: { x: 51, y: 80 }, label: "5 M", color: "yellow" }],

  chapters: [{ from: 34.5, number: "!", title: "La règle d'or", color: "yellow" }],

  pills: [
    { from: 10.4, to: 15.5, text: "Le milieu *sort presser*", color: "yellow" },
    { from: 15.5, to: 25.5, text: "Le central ~ne suit pas~", color: "red" },
    { from: 25.5, to: 34.4, text: "~Contre-attaque~ : *3 contre 2*", color: "red" },
    { from: 36.0, to: 43.5, text: "Tout le bloc *monte de 5 m*", color: "yellow" },
    { from: 43.5, to: 45.8, text: "La ^compacité^", color: "cyan" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 9.5,
      lines: [
        { text: "LE PIÈGE DU", color: "white", size: 70 },
        { text: "PRESSING", color: "red", size: 150 },
      ],
      pill: "Comment éviter de *prendre des contres*",
      pillAt: 1.6,
    },
  ],

  stamps: [
    { cue: { line: 0, word: "90" }, text: "90 %", color: "red", y: 560, hold: 1.4 },
    { cue: { line: 5, word: "trou" }, text: "Trou énorme", color: "red", y: 520, hold: 1.4 },
    { cue: { line: 6, word: "3" }, text: "3 contre 2", color: "red", y: 520, hold: 1.5 },
    { cue: { line: 7, word: "5" }, text: "+5 mètres", color: "yellow", y: 520, hold: 1.4 },
    { cue: { line: 8, word: "compacité" }, text: "Compacité", color: "cyan", y: 520, hold: 1.5 },
  ],

  // Texte fourni, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~ ; `speech` = texte prononcé.
  subtitles: [
    /* 0 */ { from: 0.3, to: 9.5, text: "Si ton équipe préférée prend toujours le même but en ~contre-attaque~, c'est à cause de cette erreur que font *90 %* des joueurs amateurs.", speech: "[confident] Si ton équipe préférée prend toujours le même but en contre-attaque, c'est à cause de cette erreur que font quatre-vingt-dix % des joueurs amateurs." },
    /* 1 */ { from: 9.5, to: 10.3, text: "*Regarde* :", speech: "Regarde :" },
    /* 2 */ { from: 10.3, to: 14.0, text: "le milieu de terrain ^monte presser^ le porteur du ballon.", speech: "le milieu de terrain monte presser le porteur du ballon." },
    /* 3 */ { from: 14.0, to: 15.5, text: "Jusque-là, ^tout va bien^.", speech: "Jusque-là, tout va bien." },
    /* 4 */ { from: 15.5, to: 22.0, text: "Le problème, c'est que le ~défenseur central~ derrière lui ~ne monte pas~ pour fermer l'espace.", speech: "[serious] Le problème, c'est que le défenseur central derrière lui ne monte pas pour fermer l'espace." },
    /* 5 */ { from: 22.0, to: 25.5, text: "Résultat : il crée un ~trou énorme~ entre les lignes.", speech: "Résultat : il crée un trou énorme entre les lignes." },
    /* 6 */ { from: 25.5, to: 34.5, text: "L'attaquant adverse n'a plus qu'à ~décrocher~ dans cette zone, se retourner, et c'est *3 contre 2* pour le but.", speech: "L'attaquant adverse n'a plus qu'à décrocher dans cette zone, se retourner, et c'est trois contre deux pour le but.", pauseAfter: 0.15 },
    /* 7 */ { from: 34.5, to: 43.5, text: "La règle d'or au foot : quand un joueur sort presser, ^tout le bloc^ doit monter de *5 mètres* avec lui pour réduire l'espace.", speech: "[confident] La règle d'or au foot : quand un joueur sort presser, tout le bloc doit monter de cinq mètres avec lui pour réduire l'espace." },
    /* 8 */ { from: 43.5, to: 45.8, text: "C'est ce qu'on appelle ^la compacité^.", speech: "C'est ce qu'on appelle la compacité.", pauseAfter: 0.15 },
    /* 9 */ { from: 45.8, to: 54.6, text: "Identifie ton pote défenseur qui ~ne monte jamais~ sur le terrain, et dis-moi en commentaire quelle équipe *maîtrise le mieux* ce pressing !", speech: "[excited] Identifie ton pote défenseur qui ne monte jamais sur le terrain, et dis-moi en commentaire quelle équipe maîtrise le mieux ce pressing !", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 1.6, sound: "softTick" },
    { at: 10.4, sound: "softTick" },
    { at: 14.0, sound: "softTick" },
    { at: 15.5, sound: "softTick" },
    { at: 25.5, sound: "softTick" },
    { at: 28.0, sound: "softWhoosh" },
    { at: 30.4, sound: "softWhoosh" },
    { at: 32.2, sound: "softTick" },
    { at: 34.4, sound: "softWhoosh" },
    { at: 36.0, sound: "softTick" },
    { at: 39.2, sound: "softWhoosh" },
    { at: 43.5, sound: "softTick" },
    { at: 45.75, sound: "softWhoosh" },
    { at: 53.9, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 45.8,
    titleTop: "IDENTIFIE TON POTE",
    titleHighlight: "QUI NE MONTE JAMAIS",
    pill: "QUELLE ÉQUIPE MAÎTRISE LE MIEUX CE PRESSING ?",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 53.9,
  },
};
