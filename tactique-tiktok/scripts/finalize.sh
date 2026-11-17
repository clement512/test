#!/usr/bin/env bash
# Normalise le son d'une vidéo rendue au standard TikTok/Shorts (-14 LUFS, pic -1,5 dBTP),
# en deux passes et sans réencoder l'image. Usage : npm run finalize -- out/ma-video.mp4
set -euo pipefail
in="${1:?Usage: npm run finalize -- out/video.mp4}"
out="${in%.mp4}-final.mp4"
json=$(ffmpeg -hide_banner -i "$in" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
get() { echo "$json" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -v error -y -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):linear=true" \
  -ar 48000 -c:a aac -b:a 192k "$out"
echo "✔ $out"
