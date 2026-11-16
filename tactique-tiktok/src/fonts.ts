import { loadFont } from "@remotion/fonts";
import montserrat700 from "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2";
import montserrat800 from "@fontsource/montserrat/files/montserrat-latin-800-normal.woff2";
import montserrat900 from "@fontsource/montserrat/files/montserrat-latin-900-normal.woff2";
import montserrat900i from "@fontsource/montserrat/files/montserrat-latin-900-italic.woff2";
import mono500 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2";
import mono700 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2";

/** Polices embarquées localement (pas besoin de réseau au rendu). loadFont gère delayRender. */
let loaded = false;
export const ensureFonts = () => {
  if (loaded) return;
  loaded = true;
  const fonts: [string, string, string, "normal" | "italic"][] = [
    ["Montserrat", montserrat700, "700", "normal"],
    ["Montserrat", montserrat800, "800", "normal"],
    ["Montserrat", montserrat900, "900", "normal"],
    ["Montserrat", montserrat900i, "900", "italic"],
    ["JetBrains Mono", mono500, "500", "normal"],
    ["JetBrains Mono", mono700, "700", "normal"],
  ];
  for (const [family, url, weight, style] of fonts) {
    loadFont({ family, url, weight, style, format: "woff2" }).catch((e) =>
      console.error("Échec du chargement de police", family, weight, e),
    );
  }
};
