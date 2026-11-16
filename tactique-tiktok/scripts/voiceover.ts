/**
 * Génère la voix off ElevenLabs de chaque vidéo déclarée dans src/videos.ts.
 *
 *   npm run voiceover            → génère ce qui manque / a changé (cache par hash)
 *   npm run voiceover -- --force → régénère tout
 *
 * Pour chaque sous-titre : appel "text-to-speech/with-timestamps", sauvegarde du MP3 dans
 * public/voiceover/<id>/, calage mot à mot, et accélération automatique (jusqu'à 1.2x) si la
 * réplique dépasse sa fenêtre [from, to]. Résultat écrit dans src/generated/voiceovers.json.
 *
 * Clé API : variable ELEVENLABS_API_KEY, ou injectée par le proxy réseau de l'environnement.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VIDEOS } from "../src/videos";
import { displayWords, plainText, spaceTokens } from "../src/lib/words";
import type { ScriptData, SubtitleDef, VoiceLine, Voiceover } from "../src/types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = join(ROOT, "src/generated/voiceovers.json");
const FORCE = process.argv.includes("--force");
const API_KEY = process.env.ELEVENLABS_API_KEY || "proxy-injected";
const LEAD = 0.05; // petit décalage après le début de la fenêtre
const TAIL = 0.08; // marge avant la réplique suivante
const MAX_SPEED = 1.2;

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

const tts = async (
  s: ScriptData,
  text: string,
  speed: number,
  prev: string | undefined,
  next: string | undefined,
): Promise<{ audio: Buffer; alignment: Alignment }> => {
  const v = s.meta.voice!;
  const body = {
    text,
    model_id: v.modelId ?? "eleven_multilingual_v2",
    previous_text: prev,
    next_text: next,
    voice_settings: {
      stability: v.stability ?? 0.4,
      similarity_boost: v.similarityBoost ?? 0.8,
      style: v.style ?? 0.35,
      use_speaker_boost: true,
      speed,
    },
  };
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${v.voiceId}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (res.ok) {
      const j = (await res.json()) as { audio_base64: string; alignment: Alignment };
      return { audio: Buffer.from(j.audio_base64, "base64"), alignment: j.alignment };
    }
    const msg = await res.text();
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${res.status} : ${msg.slice(0, 400)}`);
  }
};

/** Début (relatif au clip) de chaque mot affiché, à partir de l'alignement caractère par caractère. */
const computeWordStarts = (sub: SubtitleDef, speech: string, al: Alignment): number[] | null => {
  const plain = plainText(sub.text);
  const words = displayWords(sub.text);
  const charStart = (i: number) => al.character_start_times_seconds[Math.min(i, al.characters.length - 1)];
  if (speech === plain && al.characters.join("") === speech) {
    return words.map((w) => charStart(w.offset));
  }
  // Texte prononcé différent : correspondance mot à mot si même nombre de mots
  const pTok = spaceTokens(plain);
  const sTok = spaceTokens(speech);
  if (pTok.length !== sTok.length || al.characters.join("") !== speech) return null;
  return words.map((w) => {
    let idx = pTok.findIndex((t) => w.offset >= t.offset && w.offset < t.offset + t.text.length);
    if (idx < 0) idx = 0;
    return charStart(sTok[idx].offset);
  });
};

const run = async () => {
  const existing: Record<string, Voiceover> = existsSync(OUT_JSON)
    ? JSON.parse(readFileSync(OUT_JSON, "utf8"))
    : {};
  const result: Record<string, Voiceover> = { ...existing };
  let chars = 0;

  for (const s of VIDEOS) {
    const v = s.meta.voice;
    if (!v) continue;
    const dir = join(ROOT, "public/voiceover", s.meta.id);
    mkdirSync(dir, { recursive: true });
    const prevLines = new Map((existing[s.meta.id]?.lines ?? []).map((l) => [l.index, l]));
    const lines: VoiceLine[] = [];
    const subs = s.subtitles;
    console.log(`\n▶ ${s.meta.id} — voix ${v.voiceId}, ${subs.length} répliques`);

    for (let i = 0; i < subs.length; i++) {
      const sub = subs[i];
      const speech = sub.speech ?? plainText(sub.text);
      const nextFrom = subs[i + 1]?.from ?? s.meta.durationInSeconds;
      const start = sub.from + LEAD;
      const windowLen = Math.max(0.3, Math.min(sub.to, nextFrom) - start - TAIL);
      const baseSpeed = v.speed ?? 1.05;
      const hash = createHash("sha1")
        .update(JSON.stringify([speech, sub.text, v, windowLen.toFixed(2)]))
        .digest("hex")
        .slice(0, 12);
      const file = `voiceover/${s.meta.id}/${String(i).padStart(2, "0")}-${hash}.mp3`;
      const cached = prevLines.get(i);
      if (!FORCE && cached?.hash === hash && existsSync(join(ROOT, "public", cached.file))) {
        lines.push({ ...cached, start });
        console.log(`  [${i}] (cache) ${speech}`);
        continue;
      }

      const prevText = subs[i - 1] ? subs[i - 1].speech ?? plainText(subs[i - 1].text) : undefined;
      const nextText = subs[i + 1] ? subs[i + 1].speech ?? plainText(subs[i + 1].text) : undefined;
      let speed = baseSpeed;
      let out = await tts(s, speech, speed, prevText, nextText);
      chars += speech.length;
      let dur = out.alignment.character_end_times_seconds.at(-1) ?? 0;
      if (dur > windowLen && speed < MAX_SPEED) {
        speed = Math.min(MAX_SPEED, +(speed * (dur / windowLen) * 1.03).toFixed(2));
        out = await tts(s, speech, speed, prevText, nextText);
        chars += speech.length;
        dur = out.alignment.character_end_times_seconds.at(-1) ?? 0;
      }
      writeFileSync(join(ROOT, "public", file), out.audio);
      const wordStarts = computeWordStarts(sub, speech, out.alignment);
      lines.push({ index: i, hash, file, start, duration: +dur.toFixed(3), speed, wordStarts });
      const over = dur > windowLen ? `  ⚠ DÉBORDE de ${(dur - windowLen).toFixed(2)} s` : "";
      console.log(
        `  [${i}] ${dur.toFixed(2)} s / ${windowLen.toFixed(2)} s · x${speed}${wordStarts ? "" : " · calage proportionnel"}${over}  ${speech}`,
      );
    }
    result[s.meta.id] = { voiceId: v.voiceId, lines };
    // Nettoyage des anciens clips qui ne sont plus référencés
    const keep = new Set(lines.map((l) => l.file.split("/").pop()));
    for (const f of readdirSync(dir)) if (f.endsWith(".mp3") && !keep.has(f)) unlinkSync(join(dir, f));
  }

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(result, null, 2) + "\n");
  console.log(`\n✔ ${OUT_JSON} mis à jour — ${chars} caractères consommés.`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
