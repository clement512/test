import type { ScriptData } from "./types";
import { demo433vs442 } from "./scriptData";

/**
 * Registre des vidéos : chaque entrée devient une composition Remotion (id = meta.id)
 * et est prise en compte par `npm run voiceover`.
 */
export const VIDEOS: ScriptData[] = [demo433vs442];
