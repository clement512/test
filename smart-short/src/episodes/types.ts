export type Badge = "ÉTABLI" | "RAPPORTÉ" | "DISPUTÉ" | "MYTHE ?" | "LECTURE SMART";

export type Segment = {
  /** Identifiant de la scène (clé dans le registre des scènes de l'épisode). */
  id: string;
  /** Chapitre affiché dans l'en-tête. */
  chapter: string;
  badge: Badge;
  /** Texte affiché en sous-titres (et prononcé si `speech` est absent). */
  text: string;
  /** Texte prononcé, s'il diffère : même nombre de mots (séparés par des espaces) que `text`. */
  speech?: string;
  /** Respiration ajoutée après la réplique, en secondes. */
  pauseAfter?: number;
};

export type Episode = {
  id: string;
  number: string;
  /** Sous-titre de l'en-tête, ex. « mars 1812 ». */
  when: string;
  title: string;
  /** Mots surlignés en doré dans les sous-titres (comparaison sans accents ni ponctuation). */
  gold: string[];
  segments: Segment[];
  next?: string;
  /** Vitesse de la voix ElevenLabs (0.7–1.2). */
  voiceSpeed?: number;
};

export type VoiceWord = { w: string; s: number; e: number };
export type VoiceSegment = { id: string; file: string; start: number; duration: number; words: VoiceWord[] };
export type VoiceTrack = { voiceId: string; model: string; segments: VoiceSegment[]; voiceEnd: number; total: number };
