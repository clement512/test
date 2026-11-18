# Smart Short — générateur Remotion

Mini-documentaires TikTok verticaux (1080×1920, 30 i/s) au style **SMART SHORT** : fond sombre, doré, sous-titres mot à mot, logo éclair dans un anneau doré en fin de vidéo.

Ce projet recrée le style des épisodes 1 à 3 (faits sur le PC, voix Cartesia « Vincent ») à partir de l'épisode 4, avec la voix **ElevenLabs Hugo Doré**.

```bash
npm install
npm run voice                     # génère les voix manquantes (cache par hash)
npm run voice -- Ep05Islande      # un seul épisode ; --force pour tout refaire
npm run studio                    # prévisualisation
npm run render:ep4                # out/ep04-gerrymandering.mp4 (idem ep5, ep6)
```

Dans l'environnement cloud, ajouter `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` au rendu.

## Ajouter un épisode

1. `src/episodes/epXX.ts` : les répliques (`text` affiché, `speech` prononcé si différent, avec le même nombre de mots), le chapitre et l'étiquette (ÉTABLI, RAPPORTÉ, DISPUTÉ, MYTHE ?, LECTURE SMART) de chaque scène, et les mots dorés.
2. L'ajouter dans `src/episodes/index.ts`, puis lancer `npm run voice`.
3. `src/scenes/epXX.tsx` : un composant par réplique. `useCue()("mot")` donne l'image où ce mot est prononcé, pour caler les animations sur la voix.
4. L'enregistrer dans `src/Root.tsx`.

## Organisation

- `src/frame.tsx` : fond, logo, en-tête (chapitre, étiquette, progression), sous-titres, transitions, outro.
- `src/ui.tsx` : briques visuelles (Title, Hero, Chip, Stamp, Panel, Flow, Compare, Profile, Question, MapFrame, MapPin, DrawPath, Sfx).
- `scripts/voice.ts` : ElevenLabs text-to-speech avec minutage, une réplique par fichier dans `public/voice/`.
- `public/sfx/` : bruitages repris du projet tactique-tiktok.
- Sans musique : à ajouter dans TikTok.

## Cartes plein écran (depuis l'épisode 7)

`src/geo/GeoMap.tsx` dessine de vraies cartes (d3-geo) en noir et or : régions surlignées lumineuses, fleuves animés, étiquettes (`tag`, `big`, `pin`, `soft`) et caméra animée (`camAt`, clés `{ at, lon, lat, zoom }`).
Un épisode exporte un `Backdrop` (voir `src/scenes/ep07.tsx`) : il est rendu sous les scènes pendant toute la vidéo, et `useGlobalCue()("scene", "mot")` cale la caméra et les surlignages sur la voix. `dim` assombrit la carte quand une scène pose des cartes par-dessus.
