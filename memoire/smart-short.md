# Mémoire — projet vidéos « SMART SHORT »

Source : session Claude Code « Smart short video style » (session_01Vwoxj9XFkhvqbu8iFZpq6U), 15/11/2026.
Elle tournait sur l'ordinateur Windows de l'utilisateur via Remote Control.

## Préférences et règles
- Langue : français.
- Dossier de sortie : `%USERPROFILE%\Desktop\Claude Video Test\Smart short\` (projet Remotion dans `...\Claude Video Test\`).
- Style : documentaire TikTok vertical, sombre et doré, marque originale **SMART SHORT** (logo éclair dans un anneau doré). Pas de branding PRISMA (simple référence de style), pas de filigrane TikTok.
- Durée visée : idéalement **1 min 30 à 2 min**, jamais moins de **1 min 01**.
- Voix off : **uniquement Cartesia**, voix « Vincent » `80e11491-2d8a-4361-ac61-c4f3e0a4f7e7`, modèle sonic-3, langue fr. Toutes les vidéos en Vincent.
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

## À faire : épisodes 4, 5 et 6 (scripts reçus le 17/11/2026)
Scripts complets : `memoire/scripts-episodes-4-5-6.txt` (avec sources, hashtags et légendes TikTok).

| Épisode | Script | Voix off (hors crochets) | Crédits Cartesia estimés |
|---|---|---|---|
| 04 | Le mot qui a déformé la démocratie (gerrymandering, 1812) | 227 mots, 1 346 car. | ~1 350 |
| 05 | Le jour où l'Islande s'est arrêtée (24 octobre 1975) | 207 mots, 1 193 car. | ~1 200 |
| 06 | L'empereur qui n'était pas petit (Napoléon, 1,68 m) | 218 mots, 1 398 car. | ~1 400 |

- Total estimé : environ **3 950 crédits** (1 crédit ≈ 1 caractère, d'après le refus de la vidéo 3). Il en reste ~170 : **recharger Cartesia avant de commencer**.
- Durée attendue : environ 70–75 s à la vitesse 0.8, et environ 1 min 30 à 0.6 avec des pauses. Les trois tiennent au-dessus de 1 min 01.
- Numérotation : « épisode 04 », « épisode 05 », « épisode 06 », même style que les vidéos 1 à 3.
- Bloqué le 17/11 : la session cloud n'avait pas accès au PC Windows (aucun dossier partagé par Remote Control).
