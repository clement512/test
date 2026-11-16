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
  /** Position verticale (px) si on veut déplacer le sous-titre (ex: pendant l'outro). */
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
    /** Titre affiché dans le HUD : "ANALYSE TACTIQUE · <title>". */
    title: string;
    hudPrefix?: string;
    durationInSeconds: number;
    fps: number;
    width: number;
    height: number;
    /** Fichier audio optionnel (dans /public), ex: "voixoff.mp3". */
    audio?: string | null;
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
  outro?: OutroDef;
};
