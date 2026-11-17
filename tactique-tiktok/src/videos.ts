import type { ScriptData } from "./types";
import { demo433vs442 } from "./scriptData";
import { remake433vs442 } from "./scripts/remake433";

/**
 * Registre des vidéos : chaque entrée devient une composition Remotion (id = meta.id)
 * et est prise en compte par `npm run audio`.
 */
export const VIDEOS: ScriptData[] = [remake433vs442, demo433vs442];
