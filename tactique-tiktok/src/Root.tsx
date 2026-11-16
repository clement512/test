import React from "react";
import { Composition } from "remotion";
import { TacticalVideo } from "./TacticalVideo";
import { demo433vs442 } from "./scriptData";
import { ensureFonts } from "./fonts";

ensureFonts();

/**
 * Pour créer une nouvelle vidéo : dupliquer `demo433vs442` dans scriptData.ts (ou un nouveau
 * fichier), puis ajouter une <Composition> ci-dessous pointant sur ce nouvel objet.
 */
export const RemotionRoot: React.FC = () => {
  const s = demo433vs442;
  return (
    <>
      <Composition
        id="TactiqueDemo"
        component={TacticalVideo}
        durationInFrames={Math.round(s.meta.durationInSeconds * s.meta.fps)}
        fps={s.meta.fps}
        width={s.meta.width}
        height={s.meta.height}
        defaultProps={{ script: s }}
      />
    </>
  );
};
