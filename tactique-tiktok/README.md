# Tactique TikTok — générateur Remotion

Ce projet génère des vidéos d'analyse tactique de football au format vertical (1080×1920, 60 fps, 61 s maximum), avec voix off, effets sonores et musique ElevenLabs, dans le style « tableau tactique néon ».

```bash
npm install
npm start          # Remotion Studio (prévisualisation) sur http://localhost:3000
npm run render     # rend le remake : out/remake-433-vs-442.mp4
npm run render:demo # rend la démo : out/tactique-demo.mp4
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
| `subtitles` | voix off (`text` affiché, `speech` prononcé) ; découpée automatiquement en groupes de 1 à 3 mots |
| `stamps` | mots-tampons : gros mots inclinés qui claquent au centre de l'écran, calés sur le mot prononcé (`cue: { line, word }`) |
| `agenda` | sommaire des chapitres (pilules empilées) |
| `sfx` | bruitages, placés à un instant (`at`) ou calés sur un mot de la voix (`cue`) |

Repère du terrain, en mètres : `x` va de 0 (touche gauche) à 68 (touche droite), `y` de 0 (but adverse, en haut) à 105 (notre but). Les temps sont en secondes.
Dans les sous-titres et les pilules, trois marqueurs mettent un mot en couleur : `*jaune*` pour l'emphase, `^cyan^` pour notre équipe ou un point positif, `~rose~` pour l'adversaire ou un point négatif. Dans les sous-titres, le mot est en plus souligné.
Une ancre peut être un id de joueur (`"A6"`), un point `{x, y}` ou `{player: "A6", dx, dy}`.

Pour ajouter une deuxième vidéo, on crée un nouvel objet `ScriptData` avec un `meta.id` unique, puis on l'ajoute à `VIDEOS` dans `src/videos.ts`.

## Audio ElevenLabs : voix, effets sonores, musique

```bash
npm run audio            # génère ce qui manque ou a changé (avec cache)
npm run audio -- --force # régénère tout
npm run build            # audio puis rendu MP4
```

**C'est la voix qui donne le rythme.** Le scénario est écrit en « temps scénario ». Une fois la voix générée, `lib/retime.ts` enchaîne les répliques sans blanc et recale tous les instants du scénario sur la durée réelle de chaque réplique : déplacements, flèches, caméra, bannières, effets sonores. La vidéo dure donc exactement le temps de la narration, ici environ 60,5 s. Le script affiche la durée finale et prévient si elle dépasse 61 s.

- **Voix** (`meta.voice`) : `eleven_v4` avec Corentin (`IHngRooVccHyPqB4uQkG`). Le ton se règle réplique par réplique avec des balises dans `speech` : `[confident]`, `[serious]`, `[excited]`… La démo garde un ton d'analyste posé et affirmé. On peut aussi y écrire les chiffres en toutes lettres (« 4-3-3 » devient « quatre-trois-trois »), en gardant le même nombre de mots que `text`.
- **Sous-titres** : chaque groupe de mots apparaît au moment exact où il est prononcé, d'après le minutage renvoyé par ElevenLabs. Chaque mot `*surligné*` déclenche en plus un « punch » de caméra (petit zoom et secousse) ; `meta.wordPunches: false` le désactive.
- **Rythme** (`meta.pacing`) : `gap` est le blanc entre deux répliques, `endHold` la tenue finale. `pauseAfter` sur une réplique ajoute une respiration.
- **Effets sonores** (`sfx`) : bibliothèque dans `src/audioLibrary.ts` (whoosh, impact, stamp, tick, glitch, click, pop, swipe, riser, scan). Chaque son est généré une seule fois par ElevenLabs, dans `public/sfx/`.
- **Musique** (`meta.music`, optionnelle et désactivée dans la démo) : si tu l'ajoutes, elle est générée par ElevenLabs Music à la durée exacte de la vidéo, et son volume baisse automatiquement quand la voix parle (ducking).
- **Clé API** : lue dans `ELEVENLABS_API_KEY`. Dans l'environnement cloud Claude Code, c'est le proxy réseau qui l'injecte. Le script npm utilise la syntaxe `VAR=… cmd` ; sous Windows, lance `tsx scripts/audio.ts` directement.

## Remake d'une vidéo existante (mode speech-to-speech)

`src/scripts/remake433.ts` refait à l'identique la vidéo « 4-3-3 vs 4-4-2 » d'origine, signée @clemitch.

- **L'enregistrement d'origine** se place dans `reference/` (dossier non versionné), puis on le déclare dans `meta.voice.referenceAudio` avec `mode: "speech-to-speech"`.
- **`npm run audio`** enchaîne quatre étapes :
  1. isolation de la voix, pour retirer la musique et les bruitages ;
  2. conversion dans la voix choisie par ElevenLabs, qui conserve exactement les intonations, les pauses et le minutage ;
  3. transcription mot à mot ;
  4. découpe en une réplique par sous-titre, chacune placée à son instant d'origine.
- **Pas de recalage :** les instants du scénario sont directement ceux de la vidéo d'origine.
- **Prérequis :** cette étape utilise `ffmpeg` et `ffprobe`, qui doivent être installés sur la machine.
- **Pseudo en filigrane :** `meta.handle` (ici `@clemitch`) s'affiche en bas à droite et dans l'outro.

## Architecture

```
src/
  scriptData.ts        ← le scénario de la démo (données uniquement)
  scripts/remake433.ts ← le remake de la vidéo d'origine
  videos.ts            ← registre des vidéos (une composition par entrée)
  audioLibrary.ts      ← bibliothèque d'effets sonores
  generated/audio.json ← produit par `npm run audio`
  lib/retime.ts        ← recalage de la timeline sur la voix
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
