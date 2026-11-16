/**
 * ============================================================================
 *  SCÉNARIO DE LA VIDÉO — c'est le SEUL fichier à modifier pour créer une vidéo.
 * ============================================================================
 *
 * Repère du terrain (mètres) :  x : 0 (touche gauche) → 68 (touche droite)
 *                               y : 0 (but adverse, en haut) → 105 (notre but, en bas)
 * Tous les temps sont en secondes.
 *
 * Mots entre *astérisques* dans les sous-titres / pilules = mis en couleur.
 * Les ancres (`Anchor`) peuvent être un id de joueur ("A6"), un point {x, y},
 * ou {player: "A6", dx, dy} pour un décalage relatif qui suit le joueur.
 */
import type { ArrowDef, NeonColor, PlayerDef, ScriptData } from "./types";

// ---------------------------------------------------------------------------
// Petits helpers de saisie (purement "data")
// ---------------------------------------------------------------------------

/** Relie une liste de joueurs par des segments sans pointe (ex: lignes d'une formation). */
const chain = (
  ids: string[],
  color: NeonColor,
  from: number,
  to: number,
  stagger = 0.08,
): ArrowDef[] =>
  ids.slice(1).map((id, i) => ({
    from: from + i * stagger,
    to,
    start: ids[i],
    end: id,
    color,
    head: false,
    width: 3,
    drawDuration: 0.4,
  }));

/** Ligne de passe cyan entre deux joueurs. */
const pass = (from: string, to: string, at: number, until = at + 1.6): ArrowDef => ({
  from: at,
  to: until,
  start: from,
  end: to,
  color: "cyan",
  drawDuration: 0.35,
  width: 5,
});

// ---------------------------------------------------------------------------
// Effectifs
// ---------------------------------------------------------------------------

/** Équipe A — 4-3-3 (nous, jaune), attaque vers le haut. */
const teamA: PlayerDef[] = [
  { id: "A1", number: 1, pos: { x: 34, y: 99 } },
  { id: "A4", number: 4, pos: { x: 26, y: 87 } },
  { id: "A5", number: 5, pos: { x: 42, y: 87 } },
  { id: "A3", number: 3, pos: { x: 9, y: 79 } },
  { id: "A2", number: 2, pos: { x: 59, y: 79 } },
  { id: "A6", number: 6, pos: { x: 34, y: 67 } },
  { id: "A8", number: 8, pos: { x: 22, y: 53 } },
  { id: "A10", number: 10, pos: { x: 46, y: 53 } },
  { id: "A11", number: 11, pos: { x: 8, y: 33 } },
  { id: "A7", number: 7, pos: { x: 60, y: 33 } },
  { id: "A9", number: 9, pos: { x: 34, y: 27 } },
].map((p, i) => ({ ...p, team: "A" as const, appearAt: 0.55 + i * 0.07 }));

/** Équipe B — 4-4-2 (adversaire, rose). */
const teamB: PlayerDef[] = [
  { id: "BG", pos: { x: 34, y: 5 } },
  { id: "BD1", pos: { x: 11, y: 22 } },
  { id: "BD2", pos: { x: 26, y: 20 } },
  { id: "BD3", pos: { x: 42, y: 20 } },
  { id: "BD4", pos: { x: 57, y: 22 } },
  { id: "BM1", pos: { x: 11, y: 39 } },
  { id: "BM2", pos: { x: 27, y: 41 } },
  { id: "BM3", pos: { x: 41, y: 41 } },
  { id: "BM4", pos: { x: 57, y: 39 } },
  { id: "BS1", pos: { x: 28, y: 58 } },
  { id: "BS2", pos: { x: 40, y: 58 } },
].map((p, i) => ({ ...p, team: "B" as const, appearAt: 1.25 + i * 0.07 }));

// Essuie-glace des deux milieux centraux roses (séquence 2)
const WIPER_LEFT = { BM2: { x: 20, y: 43 }, BM3: { x: 33, y: 43 } };
const WIPER_RIGHT = { BM2: { x: 35, y: 43 }, BM3: { x: 48, y: 43 } };
const wiperArrows = (at: number, dir: "left" | "right"): ArrowDef[] =>
  (["BM2", "BM3"] as const).map((id) => {
    const l = WIPER_LEFT[id].x + 2;
    const r = WIPER_RIGHT[id].x - 2;
    return {
      from: at,
      to: at + 1.5,
      start: { x: dir === "left" ? r : l, y: 37 },
      end: { x: dir === "left" ? l : r, y: 37 },
      color: "red" as const,
      width: 5,
      drawDuration: 0.4,
    };
  });

export const demo433vs442: ScriptData = {
  meta: {
    title: "4-3-3 VS 4-4-2",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 60,
    fps: 60,
    width: 1080,
    height: 1920,
    audio: null, // ex: "voixoff.mp3" placé dans /public
    transitions: [6, 22, 38, 52],
  },

  players: [...teamA, ...teamB],

  // -------------------------------------------------------------------------
  // Déplacements des joueurs
  // -------------------------------------------------------------------------
  moves: [
    // Séq. 2 — essuie-glace
    { at: 12.9, duration: 0.8, positions: WIPER_LEFT },
    { at: 14.5, duration: 0.8, positions: WIPER_RIGHT },
    { at: 16.1, duration: 0.8, positions: WIPER_LEFT },
    { at: 17.4, duration: 0.7, positions: WIPER_RIGHT },
    { at: 19.3, duration: 0.7, positions: WIPER_LEFT },
    // Séq. 3 — retour en bloc + pressing de l'attaquant sur le 6
    { at: 22.4, duration: 1.0, positions: { BM2: { x: 27, y: 41 }, BM3: { x: 41, y: 41 } } },
    { at: 32.0, duration: 0.7, positions: { BS2: { x: 37, y: 64 } } },
    { at: 35.5, duration: 1.0, positions: { BS2: { x: 40, y: 58 } } },
    // Séq. 4 — ailiers collés à la touche, latéraux aspirés
    {
      at: 39.4,
      duration: 1.1,
      positions: {
        A7: { x: 65.5, y: 30 },
        A11: { x: 2.5, y: 30 },
        A2: { x: 61, y: 64 },
        A3: { x: 7, y: 64 },
        BD1: { x: 5.5, y: 24 },
        BD4: { x: 62.5, y: 24 },
      },
    },
    // Repli des milieux roses, attaquants restés hauts
    {
      at: 43.8,
      duration: 1.0,
      positions: {
        BM1: { x: 13, y: 30 },
        BM2: { x: 26, y: 31 },
        BM3: { x: 42, y: 31 },
        BM4: { x: 55, y: 30 },
        BS1: { x: 27, y: 61 },
        BS2: { x: 41, y: 61 },
      },
    },
    // Le 10 s'engouffre dans le vide
    { at: 47.0, duration: 0.9, positions: { A10: { x: 40, y: 50.5 } } },
  ],

  // -------------------------------------------------------------------------
  // Ballon (chaque entrée = une passe vers le nouveau porteur)
  // -------------------------------------------------------------------------
  ball: [
    { at: 1.2, holder: "A5" },
    { at: 6.6, holder: "A6", passDuration: 0.5 },
    { at: 17.0, holder: "A10" },
    { at: 18.5, holder: "A6" },
    { at: 19.8, holder: "A8" },
    { at: 23.0, holder: "A6" },
    { at: 32.5, holder: "A8", passDuration: 0.35 },
    { at: 33.6, holder: "A10", passDuration: 0.4 },
    { at: 36.4, holder: "A6" },
    { at: 47.6, holder: "A10", passDuration: 0.5 },
  ],

  // -------------------------------------------------------------------------
  // Caméra (focus en mètres, zoom, tilt 3D)
  // -------------------------------------------------------------------------
  camera: [
    { at: 0, focus: { x: 34, y: 56 }, zoom: 0.78, tilt: 55 },
    { at: 0.2, duration: 2.8, focus: { x: 34, y: 55 }, zoom: 1.0, tilt: 0 },
    // Séq. 2 : zoom milieu
    { at: 6.0, duration: 1.4, focus: { x: 34, y: 51 }, zoom: 1.85 },
    { at: 16.0, duration: 2.0, focus: { x: 34, y: 54 }, zoom: 1.7 },
    // Séq. 3 : vue large puis zoom pressing
    { at: 22.0, duration: 1.4, focus: { x: 34, y: 52 }, zoom: 1.12 },
    { at: 31.0, duration: 1.0, focus: { x: 37.5, y: 60 }, zoom: 1.4 },
    { at: 35.4, duration: 1.4, focus: { x: 34, y: 55 }, zoom: 1.3 },
    // Séq. 4 : vue globale des couloirs
    { at: 38.0, duration: 1.4, focus: { x: 34, y: 47 }, zoom: 1.0 },
    { at: 46.0, duration: 1.6, focus: { x: 34, y: 46 }, zoom: 1.12 },
    // Séq. 5 : recul + inclinaison pour l'outro
    { at: 52.0, duration: 3.0, focus: { x: 34, y: 52 }, zoom: 0.9, tilt: 25 },
  ],

  // -------------------------------------------------------------------------
  // Mises en évidence (cercles pulsants)
  // -------------------------------------------------------------------------
  highlights: [
    { from: 9.0, to: 12.4, player: "A8" },
    { from: 9.2, to: 12.4, player: "A10" },
    { from: 9.0, to: 21.6, player: "A6", color: "cyan" },
    { from: 31.0, to: 33.0, player: "A6", color: "cyan" },
    { from: 40.0, to: 44.0, player: "A7" },
    { from: 40.0, to: 44.0, player: "A11" },
    { from: 47.6, to: 51.8, player: "A10", color: "cyan" },
  ],

  tags: [
    { from: 31.0, to: 33.4, player: "A6", text: "CIBLE", color: "red" },
  ],

  // -------------------------------------------------------------------------
  // Flèches, lignes de passe, lignes de formation
  // -------------------------------------------------------------------------
  arrows: [
    // Séq. 1 — lignes de la formation
    ...chain(["A3", "A4", "A5", "A2"], "yellow", 2.3, 5.7),
    ...chain(["A8", "A6", "A10"], "yellow", 2.5, 5.7),
    ...chain(["A11", "A9", "A7"], "yellow", 2.7, 5.7),
    ...chain(["BD1", "BD2", "BD3", "BD4"], "red", 2.6, 5.7),
    ...chain(["BM1", "BM2", "BM3", "BM4"], "red", 2.8, 5.7),
    ...chain(["BS1", "BS2"], "red", 3.0, 5.7),

    // Séq. 2 — passes + essuie-glace
    pass("A5", "A6", 6.5, 8.0),
    ...wiperArrows(12.8, "left"),
    ...wiperArrows(14.4, "right"),
    ...wiperArrows(16.0, "left"),
    ...wiperArrows(17.3, "right"),
    pass("A6", "A10", 16.9, 18.4),
    pass("A10", "A6", 18.4, 19.8),
    pass("A6", "A8", 19.7, 21.6),

    // Séq. 3 — lignes rigides du 4-4-2
    { from: 24.8, to: 37.6, start: { x: 3, y: 21 }, end: { x: 65, y: 21 }, color: "red", head: false, width: 4, drawDuration: 0.8 },
    { from: 25.2, to: 37.6, start: { x: 3, y: 40 }, end: { x: 65, y: 40 }, color: "red", head: false, width: 4, drawDuration: 0.8 },
    { from: 25.6, to: 37.6, start: { x: 18, y: 58 }, end: { x: 50, y: 58 }, color: "red", head: false, width: 4, drawDuration: 0.6 },
    // Pressing cassé
    {
      from: 32.0,
      to: 37.4,
      start: { x: 41, y: 56.5 },
      end: { x: 37, y: 62 },
      color: "red",
      width: 6,
      drawDuration: 0.5,
      cut: true,
      label: "PRESSING CASSÉ",
      labelColor: "red",
    },
    pass("A6", "A8", 32.4, 37.4),
    pass("A8", "A10", 33.5, 37.4),

    // Séq. 4 — repli des milieux roses
    ...[
      [11, 38, 13, 32],
      [27, 40, 26, 33],
      [41, 40, 42, 33],
      [57, 38, 55, 32],
    ].map(([x1, y1, x2, y2]) => ({
      from: 43.6,
      to: 47.0,
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color: "red" as const,
      width: 5,
      drawDuration: 0.5,
    })),
    // Ligne "équipe coupée en deux"
    {
      from: 45.4,
      to: 51.8,
      start: { x: 1, y: 41 },
      end: { x: 67, y: 41 },
      color: "red",
      head: false,
      dashed: true,
      width: 5,
      drawDuration: 0.9,
      label: "ÉQUIPE COUPÉE EN DEUX",
    },
    pass("A6", "A10", 47.5, 51.8),
  ],

  // -------------------------------------------------------------------------
  // Zones
  // -------------------------------------------------------------------------
  zones: [
    // Séq. 2 — zone du milieu
    { from: 8.6, to: 21.6, shape: { kind: "rect", x: 14, y: 34, w: 40, h: 39 }, color: "dim" },
    // Séq. 3 — réseau de triangles
    ...[
      ["A4", "A5", "A6"],
      ["A6", "A8", "A10"],
      ["A8", "A9", "A10"],
      ["A3", "A8", "A4"],
      ["A2", "A10", "A5"],
      ["A11", "A8", "A9"],
      ["A7", "A10", "A9"],
    ].map((ids, i) => ({
      from: 27.4 + i * 0.32,
      to: 37.6,
      shape: { kind: "polygon" as const, points: ids },
      color: "cyan" as const,
      fillOpacity: 0.13,
    })),
    // Séq. 4 — bande vide entre les lignes
    { from: 45.6, to: 51.8, shape: { kind: "rect", x: 0, y: 35, w: 68, h: 22 }, color: "red", fillOpacity: 0.13, border: false },
  ],

  callouts: [
    { from: 9.2, to: 21.6, at: { x: 52, y: 40 }, text: "2", color: "red", variant: "badge" },
    { from: 9.6, to: 21.6, at: { x: 52, y: 62 }, text: "3", color: "yellow", variant: "badge" },
    { from: 12.4, to: 21.6, at: { player: "A6", dx: 7.5, dy: 0.5 }, text: "LIBRE", color: "cyan" },
    { from: 12.9, to: 19.4, at: { x: 34, y: 33.5 }, text: "ESSUIE-GLACE", color: "red", size: 26 },
    { from: 25.4, to: 31.0, at: { x: 52, y: 17 }, text: "LIGNES RIGIDES", color: "red", size: 24 },
    { from: 29.8, to: 37.4, at: { x: 34, y: 76.5 }, text: "TRIANGLES", color: "cyan", size: 26 },
    { from: 48.2, to: 51.8, at: { player: "A10", dx: 7.5, dy: 0.4 }, text: "LIBRE", color: "cyan" },
  ],

  icons: [
    { from: 41.0, to: 51.8, at: { player: "BD1", dx: 0, dy: -5 }, icon: "lock", color: "cyan" },
    { from: 41.2, to: 51.8, at: { player: "BD4", dx: 0, dy: -5 }, icon: "lock", color: "cyan" },
  ],

  measures: [
    { from: 46.4, to: 51.8, a: { x: 58, y: 32.5 }, b: { x: 58, y: 59.5 }, label: "40 MÈTRES", color: "yellow" },
  ],

  // -------------------------------------------------------------------------
  // Habillage écran (hors caméra)
  // -------------------------------------------------------------------------
  chapters: [
    { from: 6.15, number: "01", title: "Le surnombre", subtitle: "3 contre 2 au cœur du jeu", tags: ["6 · 8 · 10", "2 milieux"], color: "yellow" },
    { from: 22.15, number: "02", title: "La géométrie", subtitle: "Lignes droites vs triangles", tags: ["4-4-2 rigide", "triangles"], color: "red" },
    { from: 38.15, number: "03", title: "Les couloirs", subtitle: "Étirer pour couper", tags: ["ailiers à la touche", "40 m"], color: "yellow" },
  ],

  pills: [
    { from: 9.0, to: 15.6, text: "*3 contre 2* permanent", color: "yellow" },
    { from: 15.8, to: 21.6, text: "Ils courent *dans le vide*", color: "red" },
    { from: 24.8, to: 29.6, text: "*Lignes droites* vs triangles", color: "red" },
    { from: 29.8, to: 37.6, text: "Toujours *2 options* de passe", color: "cyan" },
    { from: 40.4, to: 44.6, text: "Ailiers *collés à la touche*", color: "yellow" },
    { from: 44.8, to: 51.8, text: "Le 4-4-2 *coupé en deux*", color: "red" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 5.7,
      lines: [
        { text: "4-3-3", color: "yellow" },
        { text: "VS", color: "white", size: 80 },
        { text: "4-4-2", color: "red" },
      ],
      pill: "Qui gagne le *duel tactique* ?",
    },
  ],

  // Voix off / sous-titres cinétiques
  subtitles: [
    { from: 0.3, to: 2.8, text: "4-3-3 contre 4-4-2 : *qui gagne* ?" },
    { from: 2.8, to: 6.0, text: "Trois failles vont faire *exploser* ce bloc." },

    { from: 6.0, to: 8.6, text: "Chapitre un : *le surnombre*." },
    { from: 8.6, to: 12.4, text: "Au milieu, on joue à *trois contre deux* en permanence." },
    { from: 12.4, to: 16.2, text: "Les deux milieux adverses font l'*essuie-glace*..." },
    { from: 16.2, to: 19.4, text: "...et courent *dans le vide* à chaque passe." },
    { from: 19.4, to: 22.0, text: "Le 6 reste *libre*. Toujours." },

    { from: 22.0, to: 24.6, text: "Chapitre deux : *la géométrie*." },
    { from: 24.6, to: 27.4, text: "Le 4-4-2 défend en *lignes droites*." },
    { from: 27.4, to: 31.0, text: "Le 4-3-3 crée des *triangles* partout." },
    { from: 31.0, to: 34.4, text: "Tu presses le 6 ? Il a *deux options*." },
    { from: 34.4, to: 38.0, text: "Résultat : *pressing cassé*, ligne éliminée." },

    { from: 38.0, to: 40.4, text: "Chapitre trois : *les couloirs*." },
    { from: 40.4, to: 43.8, text: "Les ailiers *collent la ligne* et fixent les latéraux." },
    { from: 43.8, to: 47.2, text: "Les milieux adverses *reculent* pour fermer..." },
    { from: 47.2, to: 49.6, text: "...et l'équipe se *coupe en deux*." },
    { from: 49.6, to: 52.0, text: "*40 mètres* de vide au cœur du jeu." },

    { from: 52.2, to: 55.2, text: "Tu veux le *playbook complet* ?", y: 1640 },
    { from: 55.2, to: 59.6, text: "*Abonne-toi*, la suite arrive.", y: 1640 },
  ],

  outro: {
    from: 52.0,
    titleTop: "TU VEUX LE PLAYBOOK",
    titleHighlight: "COMPLET ?",
    pill: "EXPLOITE LES FAILLES DE TOUTES LES FORMATIONS",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 56.8,
  },
};
