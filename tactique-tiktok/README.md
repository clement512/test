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

Pour ajouter une deuxième vidéo, on crée un nouvel objet `ScriptData` avec un `meta.id` unique, puis on l'ajoute à `VIDEOS` dans `src/videos.ts`.

## Voix off ElevenLabs

```bash
npm run voiceover            # génère les répliques manquantes ou modifiées (avec cache)
npm run voiceover -- --force # régénère tout
npm run build                # voix off puis rendu MP4
```

- La voix se règle dans `meta.voice` de `scriptData.ts` : `voiceId`, `modelId`, `speed`, `stability`, `similarityBoost`, `style`, `volume`. Par défaut, c'est Corentin (`IHngRooVccHyPqB4uQkG`).
- Chaque entrée de `subtitles` devient un clip MP3 dans `public/voiceover/<id>/`. Il est placé à `from` dans la vidéo.
- Le minutage de chaque mot renvoyé par ElevenLabs sert à faire apparaître chaque groupe de mots des sous-titres au moment exact où il est prononcé.
- Si une réplique est trop longue pour sa fenêtre `[from, to]`, sa vitesse est augmentée automatiquement, jusqu'à 1.2x. Le script affiche `⚠ DÉBORDE` si cela ne suffit pas : raccourcis alors le texte ou élargis la fenêtre.
- `speech` permet de faire prononcer un texte différent de celui affiché, par exemple `"4-3-3"` → `"quatre-trois-trois"`. Garde le même nombre de mots pour que le calage reste exact.
- La clé API est lue dans `ELEVENLABS_API_KEY`. Dans l'environnement cloud Claude Code, c'est le proxy réseau qui l'injecte.
- Le script npm utilise la syntaxe `VAR=… cmd` : sous Windows, lance `tsx scripts/voiceover.ts` directement.

## Architecture

```
src/
  scriptData.ts        ← le scénario (données uniquement)
  videos.ts            ← registre des vidéos (une composition par entrée)
  generated/voiceovers.json ← produit par `npm run voiceover`
  lib/words.ts         ← découpage en mots partagé (sous-titres et voix off)
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
