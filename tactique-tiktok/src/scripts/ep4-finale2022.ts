/**
 * ============================================================================
 *  ÉPISODE 4 — "Pourquoi la France a perdu la finale 2022 ?" (@clemitch)
 * ============================================================================
 *
 * France (jaune, 4-3-3) attaque vers le haut ; Argentine (rose) défend en haut, en 4-4-2 sans
 * ballon. L'aile gauche argentine (Di María) est donc à DROITE de l'écran, face au couloir
 * Dembélé / Koundé. Voix off TTS (Corentin), script validé mot pour mot.
 */
import type { PlayerDef, Point, ScriptData } from "../types";
import { chain } from "../scriptData";

const france: PlayerDef[] = [
  { id: "LLORIS", number: 1, pos: { x: 34, y: 100 } },
  { id: "HERNANDEZ", number: 22, pos: { x: 10, y: 80 } },
  { id: "UPAMECANO", number: 18, pos: { x: 27, y: 84 } },
  { id: "VARANE", number: 4, pos: { x: 41, y: 84 } },
  { id: "KOUNDE", number: 5, pos: { x: 58, y: 80 } },
  { id: "TCHOUAMENI", number: 8, pos: { x: 34, y: 67 } },
  { id: "RABIOT", number: 14, pos: { x: 23, y: 58 } },
  { id: "GRIEZMANN", number: 7, pos: { x: 45, y: 56 } },
  { id: "MBAPPE", number: 10, pos: { x: 9, y: 42 } },
  { id: "DEMBELE", number: 11, pos: { x: 59, y: 42 } },
  { id: "GIROUD", number: 9, pos: { x: 34, y: 34 } },
].map((p, i) => ({ ...p, team: "A" as const, appearAt: 0.25 + i * 0.03 }));

const argentine: PlayerDef[] = [
  { id: "MARTINEZ", pos: { x: 34, y: 5 } },
  { id: "MOLINA", pos: { x: 12, y: 22 } },
  { id: "ROMERO", pos: { x: 27, y: 20 } },
  { id: "OTAMENDI", pos: { x: 41, y: 20 } },
  { id: "TAGLIAFICO", pos: { x: 56, y: 22 } },
  { id: "DEPAUL", pos: { x: 14, y: 37 } },
  { id: "ENZO", pos: { x: 28, y: 39 } },
  { id: "MACALLISTER", pos: { x: 40, y: 39 } },
  { id: "DIMARIA", pos: { x: 55, y: 37 } },
  { id: "MESSI", pos: { x: 29, y: 50 } },
  { id: "ALVAREZ", pos: { x: 39, y: 50 } },
].map((p, i) => ({ ...p, team: "B" as const, appearAt: 0.45 + i * 0.03 }));

const startPos = Object.fromEntries([...france, ...argentine].map((p) => [p.id, p.pos])) as Record<string, Point>;

export const ep4Finale2022: ScriptData = {
  meta: {
    id: "Ep4Finale2022",
    title: "ÉP.4 · FINALE",
    hudPrefix: "ANALYSE TACTIQUE",
    durationInSeconds: 81,
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
    transitions: [12.8, 30.6, 47.8, 58.8, 72.6],
    handle: "@clemitch",
    sfxGain: 0.75,
    stampSound: "softHit",
  },

  players: [...france, ...argentine],

  // -------------------------------------------------------------------------
  moves: [
    // Ch. 1 — Di María attaque le couloir Dembélé / Koundé
    { at: 20.0, duration: 1.2, positions: { DIMARIA: { x: 60, y: 70 }, KOUNDE: { x: 59, y: 74 } } },
    { at: 24.4, duration: 0.9, positions: { DIMARIA: { x: 56, y: 87 }, DEMBELE: { x: 54, y: 84 } } },
    // Le contre du 2-0 : Di María repart haut à gauche
    { at: 26.8, duration: 0.8, positions: { DIMARIA: { x: 57, y: 62 }, DEMBELE: { x: 59, y: 42 }, KOUNDE: { x: 52, y: 80 } } },
    { at: 28.4, duration: 1.4, positions: { DIMARIA: { x: 56, y: 86 } } },
    // Ch. 2 — retour au bloc, puis deux lignes de quatre très serrées
    { at: 30.8, duration: 0.9, positions: startPos },
    {
      at: 33.4,
      duration: 1.0,
      positions: {
        MOLINA: { x: 16, y: 21 },
        ROMERO: { x: 28, y: 20 },
        OTAMENDI: { x: 40, y: 20 },
        TAGLIAFICO: { x: 52, y: 21 },
        DEPAUL: { x: 18, y: 33 },
        ENZO: { x: 29, y: 34 },
        MACALLISTER: { x: 39, y: 34 },
        DIMARIA: { x: 50, y: 33 },
        MESSI: { x: 30, y: 46 },
        ALVAREZ: { x: 38, y: 46 },
      },
    },
    // Pressing sur chaque relance
    { at: 38.0, duration: 0.8, positions: { ALVAREZ: { x: 35, y: 61 }, ENZO: { x: 25, y: 51 }, MACALLISTER: { x: 43, y: 50 } } },
    // Ch. 3 — avec le ballon : trois milieux + Messi qui décroche
    {
      at: 48.2,
      duration: 1.2,
      positions: {
        MOLINA: { x: 12, y: 38 },
        ROMERO: { x: 27, y: 34 },
        OTAMENDI: { x: 41, y: 34 },
        TAGLIAFICO: { x: 56, y: 38 },
        DEPAUL: { x: 23, y: 52 },
        ENZO: { x: 34, y: 49 },
        MACALLISTER: { x: 45, y: 52 },
        DIMARIA: { x: 60, y: 62 },
        MESSI: { x: 33, y: 71 },
        ALVAREZ: { x: 41, y: 75 },
        TCHOUAMENI: { x: 34, y: 66 },
        RABIOT: { x: 25, y: 62 },
        GRIEZMANN: { x: 46, y: 47 },
      },
    },
    { at: 51.6, duration: 0.9, positions: { MESSI: { x: 34, y: 59 } } },
    // Tchouaméni et Rabiot courent dans le vide
    { at: 55.0, duration: 0.7, positions: { TCHOUAMENI: { x: 40, y: 63 }, RABIOT: { x: 31, y: 58 } } },
    { at: 56.2, duration: 0.7, positions: { TCHOUAMENI: { x: 29, y: 64 }, RABIOT: { x: 20, y: 56 } } },
    { at: 57.4, duration: 0.7, positions: { TCHOUAMENI: { x: 38, y: 62 }, RABIOT: { x: 28, y: 57 } } },
    // Constat — retour en place
    { at: 58.8, duration: 1.0, positions: startPos },
  ],

  ball: [
    { at: 0.8, holder: "TCHOUAMENI" },
    { at: 19.6, holder: "DIMARIA", passDuration: 0.6 },
    { at: 26.6, holder: "MESSI", passDuration: 0.01 },
    { at: 27.4, holder: "ALVAREZ", passDuration: 0.4 },
    { at: 27.9, holder: "MACALLISTER", passDuration: 0.4 },
    { at: 28.6, holder: "DIMARIA", passDuration: 0.6 },
    { at: 30.8, holder: "TCHOUAMENI", passDuration: 0.01 },
    { at: 48.2, holder: "ENZO", passDuration: 0.01 },
    { at: 52.6, holder: "MESSI", passDuration: 0.4 },
    { at: 53.4, holder: "DEPAUL", passDuration: 0.4 },
    { at: 58.8, holder: "TCHOUAMENI", passDuration: 0.01 },
  ],

  camera: [
    { at: 0, focus: { x: 34, y: 52 }, zoom: 0.9, tilt: 32, rotate: -4 },
    { at: 0.1, duration: 1.8, focus: { x: 34, y: 52 }, zoom: 1.0, tilt: 0, rotate: 0 },
    // Ch. 1 : zoom sur le couloir droit français (gauche argentine)
    { at: 14.8, duration: 1.2, focus: { x: 48, y: 58 }, zoom: 1.45 },
    { at: 24.2, duration: 1.0, focus: { x: 46, y: 72 }, zoom: 1.45 },
    // Ch. 2 : vue large du bloc
    { at: 30.6, duration: 1.2, focus: { x: 34, y: 42 }, zoom: 1.15 },
    // Ch. 3 : zoom milieu
    { at: 47.8, duration: 1.2, focus: { x: 34, y: 58 }, zoom: 1.45 },
    // Constat
    { at: 58.8, duration: 1.2, focus: { x: 34, y: 52 }, zoom: 1.0 },
    { at: 68.4, duration: 2.0, focus: { x: 34, y: 52 }, zoom: 0.95, tilt: 14 },
    // Outro
    { at: 72.6, duration: 2.5, focus: { x: 34, y: 52 }, zoom: 0.9, tilt: 25 },
  ],

  highlights: [
    { from: 14.8, to: 30.4, player: "DIMARIA", color: "red" },
    { from: 19.8, to: 24.2, player: "DEMBELE", color: "red" },
    { from: 19.8, to: 24.2, player: "KOUNDE" },
    { from: 37.6, to: 42.4, player: "ENZO", color: "red" },
    { from: 37.6, to: 42.4, player: "MACALLISTER", color: "red" },
    { from: 37.6, to: 42.4, player: "DEPAUL", color: "red" },
    { from: 42.4, to: 47.6, player: "GRIEZMANN" },
    { from: 42.4, to: 47.6, player: "GIROUD", color: "red" },
    { from: 51.4, to: 54.6, player: "MESSI", color: "red" },
    { from: 54.6, to: 58.6, player: "TCHOUAMENI" },
    { from: 54.6, to: 58.6, player: "RABIOT" },
    { from: 59.4, to: 63.0, player: "GIROUD", color: "red" },
    { from: 59.4, to: 63.0, player: "DEMBELE", color: "red" },
    { from: 63.0, to: 68.4, player: "MBAPPE", color: "cyan" },
  ],

  tags: [
    { from: 15.0, to: 30.4, player: "DIMARIA", text: "DI MARÍA", color: "red" },
    { from: 16.6, to: 24.2, player: "DEMBELE", text: "DEMBÉLÉ", color: "yellow" },
    { from: 16.8, to: 24.2, player: "KOUNDE", text: "KOUNDÉ", color: "yellow" },
    { from: 37.8, to: 42.4, player: "DEPAUL", text: "DE PAUL", color: "red" },
    { from: 37.9, to: 42.4, player: "ENZO", text: "ENZO", color: "red" },
    { from: 38.0, to: 42.4, player: "MACALLISTER", text: "MAC ALLISTER", color: "red" },
    { from: 42.4, to: 47.6, player: "GRIEZMANN", text: "GRIEZMANN", color: "yellow" },
    { from: 42.6, to: 47.6, player: "GIROUD", text: "GIROUD", color: "red" },
    { from: 51.4, to: 54.6, player: "MESSI", text: "MESSI", color: "red" },
    { from: 54.6, to: 58.6, player: "TCHOUAMENI", text: "TCHOUAMÉNI", color: "yellow" },
    { from: 54.7, to: 58.6, player: "RABIOT", text: "RABIOT", color: "yellow" },
    { from: 59.6, to: 63.0, player: "GIROUD", text: "SORTI 41'", color: "red" },
    { from: 59.7, to: 63.0, player: "DEMBELE", text: "SORTI 41'", color: "red" },
    { from: 63.0, to: 68.4, player: "MBAPPE", text: "MBAPPÉ ×3", color: "cyan" },
  ],

  arrows: [
    // Accroche — formations
    ...chain(["HERNANDEZ", "UPAMECANO", "VARANE", "KOUNDE"], "yellow", 0.6, 12.6),
    ...chain(["RABIOT", "TCHOUAMENI", "GRIEZMANN"], "yellow", 0.7, 12.6),
    ...chain(["MBAPPE", "GIROUD", "DEMBELE"], "yellow", 0.8, 12.6),
    ...chain(["MOLINA", "ROMERO", "OTAMENDI", "TAGLIAFICO"], "red", 0.7, 12.6),
    ...chain(["DEPAUL", "ENZO", "MACALLISTER", "DIMARIA"], "red", 0.8, 12.6),
    ...chain(["MESSI", "ALVAREZ"], "red", 0.9, 12.6),

    // Ch. 1 — Di María attaque le dos de Dembélé
    { from: 19.8, to: 24.2, start: { x: 56, y: 39 }, end: { x: 60, y: 67 }, color: "red", width: 6, drawDuration: 0.6 },
    { from: 20.4, to: 24.2, start: { x: 59, y: 44 }, end: { x: 59, y: 60 }, color: "yellow", width: 5, dashed: true, drawDuration: 0.4, cut: true },
    { from: 24.4, to: 26.6, start: { x: 60, y: 72 }, end: { x: 56.5, y: 85 }, color: "red", width: 6, drawDuration: 0.4, cut: true, label: "PENALTY", labelColor: "red" },
    // Le contre du 2-0 : Messi → Álvarez → Mac Allister → Di María
    { from: 27.3, to: 30.4, start: "MESSI", end: "ALVAREZ", color: "red", width: 5, dashed: true, drawDuration: 0.3 },
    { from: 27.8, to: 30.4, start: "ALVAREZ", end: "MACALLISTER", color: "red", width: 5, dashed: true, drawDuration: 0.3 },
    { from: 28.4, to: 30.4, start: { x: 40, y: 39 }, end: { x: 55, y: 84 }, color: "red", width: 6, curve: 4, drawDuration: 0.5, label: "CONTRE", labelColor: "red" },

    // Ch. 2 — deux lignes de quatre
    { from: 34.0, to: 47.6, start: { x: 4, y: 21 }, end: { x: 64, y: 21 }, color: "red", head: false, width: 4, drawDuration: 0.6 },
    { from: 34.3, to: 47.6, start: { x: 4, y: 33.5 }, end: { x: 64, y: 33.5 }, color: "red", head: false, width: 4, drawDuration: 0.6 },
    // Pressing sur chaque relance
    { from: 37.8, to: 42.4, start: { x: 38, y: 47 }, end: { x: 35, y: 59 }, color: "red", width: 5, drawDuration: 0.35 },
    { from: 37.9, to: 42.4, start: { x: 29, y: 36 }, end: { x: 25, y: 49 }, color: "red", width: 5, drawDuration: 0.35 },
    { from: 38.0, to: 42.4, start: { x: 39, y: 36 }, end: { x: 43, y: 48 }, color: "red", width: 5, drawDuration: 0.35 },
    // Griezmann ne trouve plus Giroud
    { from: 43.0, to: 47.6, start: "GRIEZMANN", end: "GIROUD", color: "yellow", width: 5, dashed: true, drawDuration: 0.4, cut: true },
    { from: 43.4, to: 47.6, start: "TCHOUAMENI", end: "GIROUD", color: "yellow", width: 5, dashed: true, drawDuration: 0.4, cut: true },

    // Ch. 3 — Messi décroche
    { from: 51.4, to: 54.6, start: { x: 33, y: 70 }, end: { x: 34, y: 61.5 }, color: "red", width: 5, drawDuration: 0.4 },
    // Courses dans le vide
    { from: 54.8, to: 58.6, start: { x: 30, y: 68 }, end: { x: 40, y: 68 }, color: "yellow", width: 4, drawDuration: 0.3 },
    { from: 56.0, to: 58.6, start: { x: 40, y: 68 }, end: { x: 29, y: 68 }, color: "yellow", width: 4, drawDuration: 0.3 },
  ],

  zones: [
    // Bloc compact (ch. 2)
    { from: 34.6, to: 47.6, shape: { kind: "rect", x: 8, y: 17, w: 52, h: 20 }, color: "red", fillOpacity: 0.1, border: false, label: "2 LIGNES DE 4", labelAt: { x: 34, y: 28 } },
    // Milieu en surnombre (ch. 3)
    { from: 49.4, to: 58.6, shape: { kind: "rect", x: 16, y: 46, w: 36, h: 22 }, color: "dim" },
    { from: 50.2, to: 58.6, shape: { kind: "polygon", points: ["DEPAUL", "ENZO", "MESSI"] }, color: "red", fillOpacity: 0.12 },
    { from: 50.4, to: 58.6, shape: { kind: "polygon", points: ["ENZO", "MACALLISTER", "MESSI"] }, color: "red", fillOpacity: 0.12 },
  ],

  callouts: [
    { from: 0.9, to: 12.6, at: { x: 34, y: 93.5 }, text: "FRANCE · 4-3-3", color: "yellow", size: 24 },
    { from: 1.0, to: 12.6, at: { x: 34, y: 12 }, text: "ARGENTINE · 4-4-2", color: "red", size: 24 },
    { from: 21.6, to: 24.2, at: { x: 50, y: 70 }, text: "1 VS 1", color: "red", size: 26 },
    { from: 44.0, to: 47.6, at: { player: "GIROUD", dx: 0, dy: 4.6 }, text: "ISOLÉ", color: "red", size: 24 },
    { from: 50.4, to: 58.6, at: { x: 12, y: 49 }, text: "4", color: "red", variant: "badge" },
    { from: 50.6, to: 58.6, at: { x: 12, y: 64 }, text: "2", color: "yellow", variant: "badge" },
    { from: 55.4, to: 58.6, at: { x: 34, y: 72 }, text: "DANS LE VIDE", color: "yellow", size: 22 },
  ],

  icons: [],
  measures: [],

  chapters: [
    { from: 12.8, number: "01", title: "Di María à gauche", color: "yellow" },
    { from: 30.6, number: "02", title: "Le 4-4-2 sans ballon", color: "cyan" },
    { from: 47.8, number: "03", title: "Surnombre au milieu", color: "red" },
  ],

  agenda: [
    {
      from: 11.0,
      to: 12.8,
      y: 330,
      items: [
        { number: "01", title: "Di María à gauche", color: "yellow" },
        { number: "02", title: "Le 4-4-2 sans ballon", color: "cyan" },
        { number: "03", title: "Surnombre au milieu", color: "red" },
      ],
    },
  ],

  pills: [
    { from: 14.8, to: 24.2, text: "Di María vs *Koundé*", color: "red" },
    { from: 24.2, to: 30.4, text: "*23'* penalty · *36'* 2-0", color: "red" },
    { from: 32.8, to: 42.4, text: "~2 lignes de 4~ serrées", color: "red" },
    { from: 42.4, to: 47.6, text: "Giroud *coupé* de l'équipe", color: "yellow" },
    { from: 50.0, to: 58.6, text: "*3 milieux + Messi*", color: "red" },
    { from: 58.8, to: 63.0, text: "41' : *double changement*", color: "yellow" },
    { from: 63.0, to: 68.4, text: "Mbappé : *triplé*, 3-3", color: "cyan" },
    { from: 68.4, to: 72.4, text: "Tirs au but : ~4-2~", color: "red" },
  ],

  titleCards: [
    {
      from: 0.3,
      to: 11.0,
      lines: [
        { text: "POURQUOI LA FRANCE", color: "white", size: 62 },
        { text: "A PERDU ?", color: "red", size: 140 },
      ],
      pill: "Finale 2022 · le piège de *Scaloni*",
      pillAt: 2.6,
    },
  ],

  stamps: [
    { cue: { line: 1, word: "seul" }, text: "0 tir", color: "red", y: 560, hold: 1.4 },
    { cue: { line: 3, word: "piège" }, text: "Piège", color: "red", y: 560, hold: 1.3 },
    { cue: { line: 7, word: "seul" }, text: "1 contre 1", color: "red", y: 480, hold: 1.4 },
    { cue: { line: 8, word: "penalty" }, text: "Penalty 23'", color: "red", y: 480, hold: 1.3 },
    { cue: { line: 8, word: "deuxième" }, text: "2-0", color: "red", y: 480, hold: 1.2 },
    { cue: { line: 12, word: "coupé" }, text: "Giroud isolé", color: "red", y: 520, hold: 1.4 },
    { cue: { line: 14, word: "trois" }, text: "Surnombre", color: "red", y: 480, hold: 1.4 },
    { cue: { line: 16, word: "41e" }, text: "41e minute", color: "yellow", y: 480, hold: 1.4 },
    { cue: { line: 17, word: "3" }, text: "3-3", color: "cyan", y: 480, hold: 1.2 },
  ],

  // Script validé, mot pour mot. Couleurs : *jaune*, ^cyan^, ~rose~ ; `speech` = texte prononcé.
  subtitles: [
    // Accroche
    /* 0 */ { from: 0.3, to: 2.6, text: "Finale de la *Coupe du monde 2022*.", speech: "[confident] Finale de la Coupe du monde deux-mille-vingt-deux." },
    /* 1 */ { from: 2.6, to: 6.6, text: "À la mi-temps, la France n'a pas tenté ~un seul tir~.", speech: "À la mi-temps, la France n'a pas tenté un seul tir." },
    /* 2 */ { from: 6.6, to: 7.4, text: "*Pourquoi* ?", speech: "Pourquoi ?" },
    /* 3 */ { from: 7.4, to: 11.0, text: "Parce que Scaloni lui a tendu un ~piège tactique~ parfait.", speech: "[serious] Parce que Scaloni lui a tendu un piège tactique parfait." },
    /* 4 */ { from: 11.0, to: 12.8, text: "Voici les *trois clés*.", speech: "Voici les trois clés.", pauseAfter: 0.12 },

    // Ch. 1 — Di María à gauche
    /* 5 */ { from: 12.8, to: 14.8, text: "^Un :^ *Di María à gauche*.", speech: "[confident] Un : Di María à gauche." },
    /* 6 */ { from: 14.8, to: 19.8, text: "Scaloni le place sur l'aile gauche, dans le couloir de ~Dembélé~ et ~Koundé~.", speech: "Scaloni le place sur l'aile gauche, dans le couloir de Dembélé et Koundé." },
    /* 7 */ { from: 19.8, to: 24.2, text: "Dembélé ~ne défend pas~, et Koundé se retrouve ~seul en un contre un~.", speech: "Dembélé ne défend pas, et Koundé se retrouve seul en un contre un." },
    /* 8 */ { from: 24.2, to: 30.6, text: "Résultat : ~penalty à la 23e minute~, puis le *deuxième but* en contre, encore par ce côté.", speech: "Résultat : penalty à la vingt-troisième minute, puis le deuxième but en contre, encore par ce côté.", pauseAfter: 0.12 },

    // Ch. 2 — le 4-4-2 sans ballon
    /* 9 */ { from: 30.6, to: 32.8, text: "^Deux :^ *le 4-4-2 sans ballon*.", speech: "[confident] Deux : le quatre-quatre-deux sans ballon." },
    /* 10 */ { from: 32.8, to: 37.6, text: "À la perte, l'Argentine se replie en ~deux lignes de quatre~ très serrées.", speech: "À la perte, l'Argentine se replie en deux lignes de quatre très serrées." },
    /* 11 */ { from: 37.6, to: 42.4, text: "Mac Allister, De Paul et Enzo Fernández ~ferment l'axe~ et pressent *chaque relance*.", speech: "Mac Allister, De Paul et Enzo Fernández ferment l'axe et pressent chaque relance." },
    /* 12 */ { from: 42.4, to: 47.8, text: "Griezmann ne trouve plus de solution, et Giroud est ~coupé du reste de l'équipe~.", speech: "Griezmann ne trouve plus de solution, et Giroud est coupé du reste de l'équipe.", pauseAfter: 0.12 },

    // Ch. 3 — le surnombre au milieu
    /* 13 */ { from: 47.8, to: 50.0, text: "^Trois :^ *le surnombre au milieu*.", speech: "[confident] Trois : le surnombre au milieu." },
    /* 14 */ { from: 50.0, to: 54.6, text: "Avec le ballon, l'Argentine joue avec ~trois milieux~, plus ~Messi qui décroche~.", speech: "Avec le ballon, l'Argentine joue avec trois milieux, plus Messi qui décroche." },
    /* 15 */ { from: 54.6, to: 58.8, text: "Tchouaméni et Rabiot sont en ~infériorité~ et courent *dans le vide*.", speech: "Tchouaméni et Rabiot sont en infériorité et courent dans le vide.", pauseAfter: 0.12 },

    // Constat
    /* 16 */ { from: 58.8, to: 63.0, text: "Le constat : dès la *41e minute*, Deschamps sort ~Giroud et Dembélé~.", speech: "[serious] Le constat : dès la quarante-et-unième minute, Deschamps sort Giroud et Dembélé." },
    /* 17 */ { from: 63.0, to: 68.4, text: "Mbappé ramènera la France à ^3 partout^, mais le plan argentin a dicté *80 minutes* de finale.", speech: "Mbappé ramènera la France à trois partout, mais le plan argentin a dicté quatre-vingts minutes de finale." },
    /* 18 */ { from: 68.4, to: 72.6, text: "Et aux tirs au but, c'est ~l'Argentine~ qui soulève la Coupe.", speech: "Et aux tirs au but, c'est l'Argentine qui soulève la Coupe.", pauseAfter: 0.15 },

    // Outro
    /* 19 */ { from: 72.6, to: 78.8, text: "Et toi, qu'est-ce que tu aurais changé à la place de *Deschamps* ? Dis-le-moi *en commentaire* !", speech: "[excited] Et toi, qu'est-ce que tu aurais changé à la place de Deschamps ? Dis-le-moi en commentaire !", y: 1680 },
  ],

  sfx: [
    { at: 0.02, sound: "softHit" },
    { at: 0.15, sound: "softWhoosh" },
    { at: 2.6, sound: "softTick" },
    // Sommaire
    { cue: { line: 4, word: "voici" }, sound: "softTick" },
    { cue: { line: 4, word: "voici", offset: 0.22 }, sound: "softTick" },
    { cue: { line: 4, word: "voici", offset: 0.44 }, sound: "softTick" },
    // Chapitres
    { cue: { line: 5, word: "un", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 9, word: "deux", offset: -0.12 }, sound: "softWhoosh" },
    { cue: { line: 13, word: "trois", offset: -0.12 }, sound: "softWhoosh" },
    // Actions
    { at: 14.8, sound: "softTick" },
    { at: 20.0, sound: "softWhoosh" },
    { at: 28.4, sound: "softWhoosh" },
    { at: 32.8, sound: "softTick" },
    { at: 38.0, sound: "softTick" },
    { at: 42.4, sound: "softTick" },
    { at: 50.0, sound: "softTick" },
    { at: 58.8, sound: "softWhoosh" },
    { at: 63.0, sound: "softTick" },
    { at: 68.4, sound: "softTick" },
    // Outro
    { at: 72.55, sound: "softWhoosh" },
    { at: 78.4, sound: "click", volume: 0.45 },
  ],

  outro: {
    from: 72.6,
    titleTop: "À LA PLACE DE DESCHAMPS",
    titleHighlight: "TU CHANGES QUOI ?",
    pill: "DIS-LE-MOI EN COMMENTAIRE",
    button: "ABONNE-TOI",
    buttonDone: "ABONNÉ",
    clickAt: 78.4,
  },
};
