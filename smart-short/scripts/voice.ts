/**
 * Génère la voix off ElevenLabs d'un ou plusieurs épisodes, réplique par réplique,
 * avec le minutage mot à mot (endpoint with-timestamps).
 *
 *   npx tsx scripts/voice.ts                 → tous les épisodes (cache par hash)
 *   npx tsx scripts/voice.ts Ep05Islande     → un seul épisode
 *   npx tsx scripts/voice.ts --force         → régénère tout
 *
 * Clé API : ELEVENLABS_API_KEY, ou injectée par le proxy réseau de l'environnement cloud.
 * Écrit public/voice/<épisode>/<réplique>.mp3 et src/generated/<épisode>.json.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EPISODES } from "../src/episodes";
import { normalizeText, tokensOf } from "../src/lib/words";
import type { Episode, VoiceSegment, VoiceTrack, VoiceWord } from "../src/episodes/types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API_KEY = process.env.ELEVENLABS_API_KEY || "proxy-injected";
const VOICE_ID = process.env.VOICE_ID || "6DEjyaHWnTHsvXM5Byys"; // Hugo Doré
const MODEL = process.env.VOICE_MODEL || "eleven_v4";
const SPEED = Number(process.env.VOICE_SPEED || "1");
const FORCE = process.argv.includes("--force");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const START = 0.5; // silence avant la première réplique
const GAP = 0.45; // respiration entre deux répliques
const OUTRO = 4.2; // durée de l'outro après la voix

const hashOf = (x: unknown) => createHash("sha1").update(JSON.stringify(x)).digest("hex").slice(0, 12);

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

const tts = async (text: string): Promise<{ audio: Buffer; alignment: Alignment }> => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          language_code: "fr",
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed: SPEED },
        }),
      },
    );
    if (res.ok) {
      const d = (await res.json()) as { audio_base64: string; alignment: Alignment };
      return { audio: Buffer.from(d.audio_base64, "base64"), alignment: d.alignment };
    }
    const msg = await res.text();
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs → ${res.status} : ${msg.slice(0, 400)}`);
  }
};

/** Découpe l'alignement caractère par caractère en mots séparés par des espaces. */
const wordsFromAlignment = (al: Alignment) => {
  const out: { s: number; e: number }[] = [];
  let cur: { s: number; e: number } | null = null;
  al.characters.forEach((c, i) => {
    if (c === " " || c === "\n") {
      if (cur) out.push(cur);
      cur = null;
      return;
    }
    const s = al.character_start_times_seconds[i];
    const e = al.character_end_times_seconds[i];
    if (!cur) cur = { s, e };
    else cur.e = e;
  });
  if (cur) out.push(cur);
  return out;
};

const probe = (file: string) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

const buildEpisode = async (ep: Episode) => {
  const outJson = join(ROOT, "src/generated", `${ep.id}.json`);
  const prev: VoiceTrack | null = existsSync(outJson) ? JSON.parse(readFileSync(outJson, "utf8")) : null;
  const dir = join(ROOT, "public/voice", ep.id);
  mkdirSync(dir, { recursive: true });
  const segments: VoiceSegment[] = [];
  let t = START;
  let chars = 0;
  for (const seg of ep.segments) {
    const display = tokensOf(seg.text);
    const speech = normalizeText(seg.speech ?? seg.text);
    if (tokensOf(speech).length !== display.length)
      throw new Error(`${ep.id}/${seg.id} : speech a ${tokensOf(speech).length} mots, text en a ${display.length}`);
    const hash = hashOf([speech, VOICE_ID, MODEL, SPEED]);
    const file = `voice/${ep.id}/${seg.id}-${hash}.mp3`;
    const cachePath = join(ROOT, "public", file.replace(/\.mp3$/, ".json"));
    let timing: { s: number; e: number }[];
    if (!FORCE && existsSync(join(ROOT, "public", file)) && existsSync(cachePath)) {
      timing = JSON.parse(readFileSync(cachePath, "utf8"));
    } else {
      process.stdout.write(`  ${ep.id}/${seg.id} (${speech.length} car.)… `);
      const { audio, alignment } = await tts(speech);
      chars += speech.length;
      writeFileSync(join(ROOT, "public", file), audio);
      timing = wordsFromAlignment(alignment);
      writeFileSync(cachePath, JSON.stringify(timing));
      console.log("ok");
    }
    if (timing.length !== display.length)
      throw new Error(`${ep.id}/${seg.id} : alignement ${timing.length} mots ≠ ${display.length}`);
    const words: VoiceWord[] = display.map((w, i) => ({ w, s: +timing[i].s.toFixed(3), e: +timing[i].e.toFixed(3) }));
    const spoken = words[words.length - 1].e;
    const audioLen = probe(join(ROOT, "public", file));
    segments.push({ id: seg.id, file, start: +t.toFixed(3), duration: +audioLen.toFixed(3), words });
    t += spoken + GAP + (seg.pauseAfter ?? 0);
  }
  const voiceEnd = t - GAP;
  const track: VoiceTrack = {
    voiceId: VOICE_ID,
    model: MODEL,
    segments,
    voiceEnd: +voiceEnd.toFixed(3),
    total: +(voiceEnd + 0.5 + OUTRO).toFixed(3),
  };
  writeFileSync(outJson, JSON.stringify(track, null, 1));
  console.log(`${ep.id} : voix ${voiceEnd.toFixed(1)} s, vidéo ${track.total.toFixed(1)} s, ${chars} caractères facturés`);
  void prev;
};

const main = async () => {
  for (const ep of EPISODES) {
    if (only.length && !only.includes(ep.id)) continue;
    await buildEpisode(ep);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
