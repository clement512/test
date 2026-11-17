# Mémoire — projet vidéos « SMART SHORT »

Source : session Claude Code « Smart short video style » (session_01Vwoxj9XFkhvqbu8iFZpq6U), 15/11/2026.
Elle tournait sur l'ordinateur Windows de l'utilisateur via Remote Control.

## Préférences et règles
- Langue : français.
- Dossier de sortie : `%USERPROFILE%\Desktop\Claude Video Test\Smart short\` (projet Remotion dans `...\Claude Video Test\`).
- Style : documentaire TikTok vertical, sombre et doré, marque originale **SMART SHORT** (logo éclair dans un anneau doré). Pas de branding PRISMA (simple référence de style), pas de filigrane TikTok.
- Durée visée : idéalement **1 min 30 à 2 min**, jamais moins de **1 min 01**.
- Voix off épisodes 1–3 : Cartesia « Vincent » `80e11491-2d8a-4361-ac61-c4f3e0a4f7e7` (sonic-3, fr).
- **À partir de l'épisode 4 (17/11/2026) : ElevenLabs, voix « Hugo Doré » `6DEjyaHWnTHsvXM5Byys`, modèle eleven_v4, fr.** Clé ElevenLabs enregistrée dans l'environnement cloud (injectée par le proxy, jamais affichée). Forfait Creator.
- Clé `CARTESIA_API_KEY` dans `.env` : ne jamais lire ni afficher `.env`, l'utiliser seulement via `node --env-file=.env`.
- Crédits Cartesia : il en restait **~170** à la fin (insuffisant pour une nouvelle vidéo). Recharger avant la prochaine.
- Les scripts fournis contiennent des indications visuelles entre crochets ([CARTE …], [DATE EN GRAND …], [ÉTIQUETTE : RAPPORTÉ/ÉTABLI/MYTHE ?], etc.), à traduire en scènes ; elles ne sont pas lues par la voix.

## Vidéos réalisées
| # | Sujet | Fichier | Durée |
|---|---|---|---|
| 1 | Canal de Suez / Ever Given | `suez-ever-given.mp4` (46,7 Mo) | 1 min 43 |
| 2 | Diners Club, « The First Supper » (1950) | `diners-club-first-supper.mp4` (53,8 Mo) + `-mobile.mp4` (23 Mo) | 1 min 33 |
| 3 | « Quatre chiffres pour Caroline » (distributeur d'Enfield, 1967) | `quatre-chiffres-caroline.mp4` (25 Mo) + `-mobile.mp4` (14,5 Mo) | 1 min 02,5 |

- Bonus : `smart-short-photo-profil.png` (1080x1080, logo de fin centré pour un recadrage en cercle).
- Vidéo 3 : script raccourci à 140 mots faute de crédits (Reg Varney et d'autres détails coupés) ; voix ralentie (TTS_SPEED=0.6) et pauses ajoutées par ffmpeg (`scripts/pace-voiceover.mjs`) pour dépasser 1 min. Épisode « 03 · juin 1967 ».

## Technique (projet Remotion)
- Remotion 4.0.541, React 19, TypeScript, 1080x1920, 30 fps. Polices Anton, Barlow, Inter, Hand.
- Une vidéo = un dossier `src/<nom>/` : `theme.ts`, `timeline.ts`, carte (`CityMap`/`LondonMap`), `art.tsx`, `ui.tsx`, `scenes.tsx`, composition ; enregistrée dans `Root.tsx` (+ `SmartShortAvatar`).
- Voix : `VO_SCRIPT=<fichier> VO_OUT_DIR=<dir> TTS_SPEED=<v> node --env-file=.env scripts/cartesia-voiceover.mjs` → `public/<dir>/voixoff.mp3` + `timestamps.json` (sous-titres mot à mot).
- Contrôle : `npx remotion bundle`, puis `npx remotion still … --scale=0.4` et planche contact ffmpeg xstack (scale dans filter_complex).
- Rendu : `npx remotion render <Comp> "Smart short/<nom>.mp4" --log=error` en arrière-plan (25–35 min pour ~3 000 images).
- Envoi au téléphone limité à 30 Mo : faire une copie mobile
  `ffmpeg -c:v libx264 -preset slow -b:v 2000k -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart`.

## Épisodes 4, 5 et 6 (17/11/2026) — projet `smart-short/` dans ce dépôt
Scripts : `memoire/scripts-episodes-4-5-6.txt`. Le code Smart Short d'origine étant sur le PC, le style a été recréé dans `smart-short/` (Remotion 4.0.544), voix Hugo Doré.

| Épisode | Composition | Fichier | Durée |
|---|---|---|---|
| 04 | Ep04Gerrymandering — Le mot qui a déformé la démocratie | `out/ep04-gerrymandering.mp4` | ~1 min 31 |
| 05 | Ep05Islande — Le jour où l'Islande s'est arrêtée | `out/ep05-islande.mp4` | ~1 min 29 |
| 06 | Ep06Napoleon — L'empereur qui n'était pas petit | `out/ep06-napoleon.mp4` | ~1 min 36 |

- Les nombres sont écrits en toutes lettres dans `speech` ; « Gerry » est prononcé « Guerry » (g dur d'origine).
- Prononciation vérifiée par transcription ElevenLabs (scribe_v1).
- Environ 4 300 caractères ElevenLabs consommés.
