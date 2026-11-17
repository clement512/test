/**
 * Types du "scénario" d'une vidéo tactique.
 *
 * Toutes les durées / instants sont exprimés en SECONDES (converties en frames au rendu).
 * Toutes les positions sur le terrain sont exprimées en MÈTRES dans le repère du terrain vertical :
 *   x : 0 (touche gauche) → 68 (touche droite)
 *   y : 0 (but du haut, celui de l'adversaire) → 105 (but du bas, le nôtre)
 * L'équipe A ("nous", jaune) attaque donc vers le HAUT.
 */

export type NeonColor = "cyan" | "yellow" | "red" | "white";

export type Point = { x: number; y: number };

/** Un point d'ancrage : soit une position fixe, soit un joueur (suivi en temps réel), avec décalage optionnel. */
export type Anchor = Point | string | { player: string; dx?: number; dy?: number };

/** Fenêtre de visibilité d'un élément (en secondes). */
export type Timed = { from: number; to: number };

export type Team = "A" | "B";

export type PlayerDef = {
  /** Identifiant unique, utilisé partout dans le scénario (ex: "A6", "B_MC1"). */
  id: string;
  team: Team;
  /** Numéro affiché au centre du pion (optionnel pour l'équipe B). */
  number?: number;
  /** Position initiale (mètres). */
  pos: Point;
  /** Instant d'apparition (pop-in). Défaut : 0. */
  appearAt?: number;
};

/** Déplacement d'un ou plusieurs joueurs vers de nouvelles positions, avec interpolation "spring". */
export type MoveKeyframe = {
  at: number;
  /** Durée de l'interpolation (s). Défaut : 0.9 s. */
  duration?: number;
  positions: Record<string, Point>;
};

/** Changement de porteur du ballon (une passe). Le ballon voyage de l'ancien porteur au nouveau. */
export type BallKeyframe = {
  at: number;
  holder: string | null;
  /** Durée du trajet du ballon (s). Défaut : 0.45 s. */
  passDuration?: number;
};

export type HighlightDef = Timed & { player: string; color?: NeonColor };

export type TagDef = Timed & { player: string; text: string; color?: NeonColor };

export type ArrowDef = Timed & {
  start: Anchor;
  end: Anchor;
  color: NeonColor;
  /** Durée du tracé progressif (s). Défaut : 0.6 s. */
  drawDuration?: number;
  dashed?: boolean;
  /** Courbure (mètres, perpendiculaire au segment). 0 = droit. */
  curve?: number;
  /** Afficher la pointe de flèche. Défaut : true. */
  head?: boolean;
  /** Croix rouge au milieu ("passe coupée"). */
  cut?: boolean;
  /** Texte affiché près du milieu (ex: "PRESSING CASSÉ"). */
  label?: string;
  labelColor?: NeonColor;
  /** Côté du label par rapport à la croix (si `cut`). Défaut : "right". */
  labelSide?: "left" | "right";
  /** Épaisseur du trait en px. Défaut : 5. */
  width?: number;
};

export type ZoneShape =
  | { kind: "polygon"; points: Anchor[] }
  | { kind: "rect"; x: number; y: number; w: number; h: number };

export type ZoneDef = Timed & {
  shape: ZoneShape;
  color: NeonColor | "dim";
  /** Opacité du remplissage. Défaut : 0.16. */
  fillOpacity?: number;
  /** Afficher la bordure lumineuse. Défaut : true. */
  border?: boolean;
  dashedBorder?: boolean;
  label?: string;
  labelAt?: Point;
};

export type CalloutDef = Timed & {
  at: Anchor;
  text: string;
  color: NeonColor;
  /** "text" = texte néon libre, "badge" = carré plein (ex: "2" / "3"). */
  variant?: "text" | "badge";
  size?: number;
};

export type IconDef = Timed & {
  at: Anchor;
  icon: "lock" | "check";
  color: NeonColor;
};

export type MeasureDef = Timed & {
  a: Point;
  b: Point;
  label: string;
  color: NeonColor;
};

export type CameraKeyframe = {
  at: number;
  /** Durée du mouvement (s). Défaut : 1.2 s. */
  duration?: number;
  /** Point visé au centre de l'écran (mètres). */
  focus: Point;
  zoom: number;
  /** Inclinaison 3D (degrés) — utile pour l'intro "terrain qui se redresse". */
  tilt?: number;
  /** Rotation dans le plan (degrés). */
  rotate?: number;
};

export type ChapterDef = {
  from: number;
  /** Durée d'affichage de la grande bannière (s). Défaut : 2.6 s. */
  duration?: number;
  number: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  color: NeonColor;
};

/** Pilule en haut de l'écran. Les mots entre *astérisques* sont colorés. */
export type PillDef = Timed & { text: string; color: NeonColor };

/** Phrase de voix off. Les mots entre *astérisques* passent en jaune. */
export type SubtitleDef = Timed & {
  text: string;
  /**
   * Texte réellement prononcé par la voix off, si différent de l'affichage
   * (ex: "4-3-3" → "quatre-trois-trois"). Garder le même nombre de mots pour un calage exact.
   */
  speech?: string;
  /** Position verticale (px) si on veut déplacer le sous-titre (ex: pendant l'outro). */
  y?: number;
  /** Respiration ajoutée après la réplique (s), en plus de `meta.pacing.gap`. */
  pauseAfter?: number;
};

/**
 * Repère calé sur la voix : l'instant où le mot `word` de la réplique `line` est prononcé
 * (+ `offset` secondes). Reste juste même si le texte ou la voix changent.
 */
export type Cue = { line: number; word: string; offset?: number };

/** Effet sonore ponctuel (nom d'un son de la bibliothèque `meta.sounds` / audioLibrary.ts). */
export type SfxDef = { at?: number; cue?: Cue; sound: string; volume?: number };

/** Gros mot-tampon incliné qui claque au milieu de l'écran (ex: "DÉTRUIT", "3 CONTRE 2"). */
export type StampDef = {
  cue?: Cue;
  at?: number;
  /** Durée d'affichage (s). Défaut : 1.3 s. */
  hold?: number;
  text: string;
  color: NeonColor;
  /** Position verticale (px). Défaut : 560. */
  y?: number;
  rotate?: number;
  /** Son joué à l'impact (défaut "stamp"), ou false. */
  sound?: string | false;
};

/** Sommaire des chapitres (pilules empilées). */
export type AgendaDef = Timed & {
  items: { number: string; title: string; color: NeonColor }[];
  stagger?: number;
  y?: number;
};

export type TitleCardDef = Timed & {
  lines: { text: string; color: NeonColor; size?: number }[];
  pill?: string;
};

export type OutroDef = {
  from: number;
  titleTop: string;
  titleHighlight: string;
  pill: string;
  button: string;
  buttonDone: string;
  /** Instant du clic du curseur (s). */
  clickAt: number;
};

export type ScriptData = {
  meta: {
    /** Identifiant unique (lettres, chiffres, tirets) : id de la composition et dossier audio. */
    id: string;
    /** Titre affiché dans le HUD : "ANALYSE TACTIQUE · <title>". */
    title: string;
    hudPrefix?: string;
    /**
     * Durée du scénario en "temps scénario". Si une voix off est générée, toute la timeline est
     * recalée sur la durée réelle des répliques (voir lib/retime.ts) : la vidéo finale dure
     * exactement le temps de la narration.
     */
    durationInSeconds: number;
    fps: number;
    width: number;
    height: number;
    /** Fichier audio optionnel supplémentaire (dans /public). */
    audio?: string | null;
    /** Voix off ElevenLabs (générée par `npm run audio`). */
    voice?: VoiceConfig;
    /** Musique de fond générée par ElevenLabs Music. */
    music?: MusicConfig;
    /** Bibliothèque d'effets sonores (s'ajoute à / remplace celle de audioLibrary.ts). */
    sounds?: Record<string, SoundDef>;
    /** Rythme de la narration. */
    pacing?: {
      /** Blanc entre deux répliques (s). Défaut : 0.12. */
      gap?: number;
      /** Temps gardé à la fin après la dernière réplique (s). Défaut : 1.2. */
      endHold?: number;
    };
    /** "Punch" de caméra sur chaque mot *surligné* prononcé. Défaut : true. */
    wordPunches?: boolean;
    /** Instants (s) où jouer le flash de transition entre séquences. */
    transitions?: number[];
  };
  players: PlayerDef[];
  moves: MoveKeyframe[];
  ball: BallKeyframe[];
  camera: CameraKeyframe[];
  highlights: HighlightDef[];
  tags: TagDef[];
  arrows: ArrowDef[];
  zones: ZoneDef[];
  callouts: CalloutDef[];
  icons: IconDef[];
  measures: MeasureDef[];
  chapters: ChapterDef[];
  pills: PillDef[];
  subtitles: SubtitleDef[];
  titleCards: TitleCardDef[];
  stamps?: StampDef[];
  agenda?: AgendaDef[];
  sfx?: SfxDef[];
  outro?: OutroDef;
};

export type VoiceConfig = {
  provider: "elevenlabs";
  voiceId: string;
  /** Défaut : "eleven_v4" (le plus expressif, accepte les balises [excited], [whispers]...). */
  modelId?: string;
  speed?: number;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  /** Volume de la voix dans le mix (0 → 1). Défaut : 1. */
  volume?: number;
};

export type MusicConfig = {
  prompt: string;
  /** Volume de base (0 → 1). Défaut : 0.2. Baissé automatiquement sous la voix. */
  volume?: number;
};

export type SoundDef = { prompt: string; duration: number; volume?: number };

/** Une réplique de voix off générée (produite par scripts/audio.ts). */
export type VoiceLine = {
  /** Index de la réplique dans `subtitles`. */
  index: number;
  hash: string;
  /** Chemin dans /public. */
  file: string;
  /** Instant (s, relatif au clip) où la parole commence vraiment. */
  speechStart: number;
  /** Instant (s, relatif au clip) où la parole se termine. */
  duration: number;
  /** Début (s, relatif au clip) de chaque mot affiché, ou null si calage proportionnel. */
  wordStarts: number[] | null;
};

/** Ligne de voix placée dans la vidéo (après recalage). */
export type PlacedVoiceLine = VoiceLine & { start: number };

/** Tout l'audio généré pour une vidéo (src/generated/audio.json). */
export type GeneratedAudio = {
  voice?: { voiceId: string; modelId: string; lines: VoiceLine[] };
  sounds?: Record<string, { file: string; hash: string }>;
  music?: { file: string; hash: string; seconds: number };
};
