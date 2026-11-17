import type { ScriptData } from "./types";
import { demo433vs442 } from "./scriptData";
import { remake433vs442 } from "./scripts/remake433";
import { ep2Numero9 } from "./scripts/ep2-numero9";
import { ep3Pressing } from "./scripts/ep3-pressing";
import { ep4Finale2022 } from "./scripts/ep4-finale2022";
import { ep5_4231 } from "./scripts/ep5-4231";
import { ep6Ailiers } from "./scripts/ep6-ailiers";
import { ep7Mental } from "./scripts/ep7-mental";

/**
 * Registre des vidéos : chaque entrée devient une composition Remotion (id = meta.id)
 * et est prise en compte par `npm run audio`.
 */
export const VIDEOS: ScriptData[] = [ep7Mental, ep6Ailiers, ep5_4231, ep4Finale2022, ep3Pressing, ep2Numero9, remake433vs442, demo433vs442];
