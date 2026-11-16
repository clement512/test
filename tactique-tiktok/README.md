# Tactique TikTok — générateur Remotion

Ce projet génère des vidéos d'analyse tactique de football au format vertical (1080×1920, 60 fps, 61 s maximum), dans le style « tableau tactique néon ».

```bash
npm install
npm start          # Remotion Studio (prévisualisation) sur http://localhost:3000
npm run render     # rend out/tactique-demo.mp4
npm run still      # image fixe (frame 600) dans out/still.png
npm run typecheck
```

## Créer une nouvelle vidéo

**Seul `src/scriptData.ts` est à modifier.** Ce fichier décrit toute la vidéo :

| Clé | Rôle |
|---|---|
| `meta` | titre affiché dans le HUD, durée, fps, audio optionnel (`/public/xxx.mp3`), instants des flashs de transition |
| `players` | les 22 pions : id, équipe `A` (jaune) ou `B` (rose), numéro, position initiale, instant d'apparition |
| `moves` | déplacements des joueurs (`at`, `duration`, nouvelles positions), interpolés en spring |
| `ball` | succession des porteurs ; chaque changement anime une passe |
| `camera` | keyframes caméra : `focus` (point visé), `zoom`, `tilt` (inclinaison 3D) |
| `highlights` / `tags` | cercles pulsants, étiquettes au-dessus d'un joueur (« AILIER », « TOI »…) |
| `arrows` | flèches et lignes de passe : couleur, pointillés, courbure, sans pointe, croix « passe coupée », label |
| `zones` | polygones reliés à des joueurs (ils suivent leurs mouvements) ou rectangles |
| `callouts` / `icons` / `measures` | textes néon, badges « 2 » / « 3 », cadenas, cotes « 40 MÈTRES » |
| `chapters` / `pills` / `titleCards` / `outro` | habillage à l'écran |
| `subtitles` | voix off ; découpée automatiquement en groupes de 1 à 3 mots |

Repère du terrain, en mètres : `x` va de 0 (touche gauche) à 68 (touche droite), `y` de 0 (but adverse, en haut) à 105 (notre but). Les temps sont en secondes.
Dans les sous-titres et les pilules, les mots entre `*astérisques*` sont mis en couleur.
Une ancre peut être un id de joueur (`"A6"`), un point `{x, y}` ou `{player: "A6", dx, dy}`.

Pour ajouter une deuxième vidéo, on crée un nouvel objet `ScriptData`, puis une `<Composition>` de plus dans `src/Root.tsx`.

## Architecture

```
src/
  scriptData.ts        ← le scénario (données uniquement)
  types.ts             ← schéma typé du scénario
  theme.ts             ← couleurs néon, géométrie du terrain, conversion mètres → px
  fonts.ts             ← Montserrat et JetBrains Mono embarquées (pas de réseau nécessaire)
  lib/timeline.ts      ← moteur : positions interpolées, état du ballon, caméra, fondus
  TacticalVideo.tsx    ← composition générique pilotée par le scénario
  components/
    Pitch.tsx          ← terrain + grille + filtres de lueur
    PlayerNode.tsx     ← pion (hasBall, isHighlighted) + ballon
    TacticalArrow.tsx  ← flèche tracée progressivement (strokeDashoffset)
    TacticalZone.tsx   ← zones et triangles translucides
    Annotations.tsx    ← callouts, badges, étiquettes, cadenas (lucide), cotes
    CameraRig.tsx      ← zoom, travelling, tilt 3D, flottement
    HUD.tsx            ← titre, REC timecode, crochets de viseur, barre de progression
    Typography.tsx     ← ChapterBanner, TopPill, KineticSubtitles, TitleCard
    Outro.tsx          ← tablette tactique, bouton ABONNE-TOI cliqué, flash de transition
```
