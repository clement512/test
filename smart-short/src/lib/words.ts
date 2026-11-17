/** Espaces insécables autour de la ponctuation française, pour qu'elle reste collée à son mot. */
export const normalizeText = (s: string) =>
  s
    .replace(/«\s+/g, "« ")
    .replace(/\s+»/g, " »")
    .replace(/\s+([:;?!])/g, " $1")
    .replace(/\s+/g, (m) => (m.includes(" ") ? m : " "))
    .trim();

/** Mots séparés par des espaces ordinaires (les espaces insécables restent dans le mot). */
export const tokensOf = (s: string) => normalizeText(s).split(" ").filter(Boolean);

/** Forme de comparaison : minuscules, sans accents ni ponctuation autour. */
export const normWord = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[«»"“”().,;:!? ]/g, "")
    .replace(/^(l|d|qu|n|s|c|j)['’]/, (m) => m)
    .trim();
