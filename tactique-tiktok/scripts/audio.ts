/**
 * Génère tout l'audio ElevenLabs des vidéos déclarées dans src/videos.ts :
 *   1. la voix off (une réplique par sous-titre, avec minutage mot à mot) ;
 *   2. les effets sonores utilisés dans `sfx` (bibliothèque audioLibrary.ts) ;
 *   3. la musique de fond, à la durée exacte de la vidéo recalée sur la voix.
 *
 *   npm run audio            → génère ce qui manque ou a changé (cache par hash)
 *   npm run audio -- --force → régénère tout
 *
 * Clé API : variable ELEVENLABS_API_KEY, ou injectée par le proxy réseau de l'environnement.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VIDEOS } from "../src/videos";
import { resolveSounds } from "../src/audioLibrary";
import { buildTimeMap } from "../src/lib/retime";
import { displayWords, normWord, plainText, spaceTokens } from "../src/lib/words";
import type { GeneratedAudio, ScriptData, SubtitleDef, VoiceLine } from "../src/types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = join(ROOT, "src/generated/audio.json");
const FORCE = process.argv.includes("--force");
const API_KEY = process.env.ELEVENLABS_API_KEY || "proxy-injected";
const API = "https://api.elevenlabs.io/v1";

const hashOf = (x: unknown) => createHash("sha1").update(JSON.stringify(x)).digest("hex").slice(0, 12);
const publicPath = (f: string) => join(ROOT, "public", f);

const post = async (path: string, body: unknown): Promise<Response> => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return res;
    const msg = await res.text();
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${path} → ${res.status} : ${msg.slice(0, 400)}`);
  }
};

// ---------------------------------------------------------------------------
// Voix
// ---------------------------------------------------------------------------

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

const stripTags = (t: string) => t.replace(/\[[^\]]*\]\s*/g, "").trim();

/** Retire les balises [excited]... de l'alignement, pour retrouver le texte prononcé. */
const cleanAlignment = (al: Alignment) => {
  const chars: string[] = [];
  const starts: number[] = [];
  const ends: number[] = [];
  let inTag = false;
  let skipSpace = false;
  al.characters.forEach((c, i) => {
    if (c === "[") inTag = true;
    if (inTag) {
      if (c === "]") {
        inTag = false;
        skipSpace = true;
      }
      return;
    }
    if (skipSpace && /\s/.test(c)) return;
    skipSpace = false;
    if (!chars.length && /\s/.test(c)) return;
    chars.push(c);
    starts.push(al.character_start_times_seconds[i]);
    ends.push(al.character_end_times_seconds[i]);
  });
  while (chars.length && /\s/.test(chars[chars.length - 1])) {
    chars.pop();
    starts.pop();
    ends.pop();
  }
  return { text: chars.join(""), starts, ends };
};

const computeWordStarts = (sub: SubtitleDef, spoken: string, starts: number[]): number[] | null => {
  const plain = plainText(sub.text);
  const words = displayWords(sub.text);
  if (spoken === plain) return words.map((w) => starts[w.offset]);
  const pTok = spaceTokens(plain);
  const sTok = spaceTokens(spoken);
  if (pTok.length !== sTok.length) return null;
  return words.map((w) => {
    let idx = pTok.findIndex((t) => w.offset >= t.offset && w.offset < t.offset + t.text.length);
    if (idx < 0) idx = 0;
    return starts[sTok[idx].offset];
  });
};

const genVoice = async (s: ScriptData, prev?: GeneratedAudio["voice"]) => {
  const v = s.meta.voice!;
  const modelId = v.modelId ?? "eleven_v4";
  const dir = `voiceover/${s.meta.id}`;
  mkdirSync(publicPath(dir), { recursive: true });
  const cache = new Map((prev?.lines ?? []).map((l) => [l.index, l]));
  const subs = s.subtitles;
  const lines: VoiceLine[] = [];
  let chars = 0;

  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i];
    const speech = sub.speech ?? plainText(sub.text);
    const hash = hashOf([speech, sub.text, v, modelId]);
    const cached = cache.get(i);
    if (!FORCE && cached?.hash === hash && existsSync(publicPath(cached.file))) {
      lines.push(cached);
      console.log(`  voix [${i}] (cache) ${speech}`);
      continue;
    }
    const ctx = (j: number) => (subs[j] ? stripTags(subs[j].speech ?? plainText(subs[j].text)) : undefined);
    const res = await post(`/text-to-speech/${v.voiceId}/with-timestamps?output_format=mp3_44100_128`, {
      text: speech,
      model_id: modelId,
      previous_text: ctx(i - 1),
      next_text: ctx(i + 1),
      voice_settings: {
        stability: v.stability ?? 0.3,
        similarity_boost: v.similarityBoost ?? 0.8,
        style: v.style ?? 0.6,
        use_speaker_boost: true,
        speed: v.speed ?? 1.1,
      },
    });
    const j = (await res.json()) as { audio_base64: string; alignment: Alignment };
    chars += speech.length;
    const file = `${dir}/${String(i).padStart(2, "0")}-${hash}.mp3`;
    writeFileSync(publicPath(file), Buffer.from(j.audio_base64, "base64"));
    const clean = cleanAlignment(j.alignment);
    const spoken = stripTags(speech);
    const wordStarts = clean.text === spoken ? computeWordStarts(sub, spoken, clean.starts) : null;
    const line: VoiceLine = {
      index: i,
      hash,
      file,
      speechStart: +(clean.starts[0] ?? 0).toFixed(3),
      duration: +(clean.ends[clean.ends.length - 1] ?? 0).toFixed(3),
      wordStarts: wordStarts?.map((x) => +(x ?? 0).toFixed(3)) ?? null,
    };
    lines.push(line);
    console.log(
      `  voix [${i}] ${(line.duration - line.speechStart).toFixed(2)} s${wordStarts ? "" : " · calage proportionnel"}  ${speech}`,
    );
  }
  const keep = new Set(lines.map((l) => l.file.split("/").pop()));
  for (const f of readdirSync(publicPath(dir))) if (!keep.has(f)) unlinkSync(publicPath(`${dir}/${f}`));
  return { voice: { voiceId: v.voiceId, modelId, lines }, chars };
};

// ---------------------------------------------------------------------------
// Voix — mode speech-to-speech (reprise d'un enregistrement de référence)
// ---------------------------------------------------------------------------

const postForm = async (path: string, form: FormData): Promise<Response> => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}${path}`, { method: "POST", headers: { "xi-api-key": API_KEY }, body: form });
    if (res.ok) return res;
    const msg = await res.text();
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${path} → ${res.status} : ${msg.slice(0, 400)}`);
  }
};

const fileBlob = (p: string) => new Blob([readFileSync(p)], { type: "audio/mpeg" });

type SttWord = { text: string; start: number; end: number; type: string };

const genVoiceSTS = async (s: ScriptData, prev?: GeneratedAudio["voice"]) => {
  const v = s.meta.voice!;
  if (!v.referenceAudio) throw new Error("mode speech-to-speech : meta.voice.referenceAudio manquant");
  const refPath = join(ROOT, v.referenceAudio);
  if (!existsSync(refPath)) throw new Error(`Enregistrement de référence introuvable : ${refPath}`);
  const modelId = v.modelId ?? "eleven_multilingual_sts_v2";
  const cacheDir = join(ROOT, ".cache/audio", s.meta.id);
  mkdirSync(cacheDir, { recursive: true });
  const refHash = createHash("sha1").update(readFileSync(refPath)).digest("hex").slice(0, 12);
  const convHash = hashOf([refHash, v.voiceId, modelId, v.stability, v.similarityBoost, v.style]);

  // 1. Isolation de la voix (retire musique et bruitages de la référence)
  const isoPath = join(cacheDir, `iso-${refHash}.mp3`);
  if (FORCE || !existsSync(isoPath)) {
    const f = new FormData();
    f.append("audio", fileBlob(refPath), "reference.mp3");
    writeFileSync(isoPath, Buffer.from(await (await postForm("/audio-isolation", f)).arrayBuffer()));
    console.log("  voix isolée ✔");
  }
  // 2. Conversion dans la voix cible (intonations et minutage conservés)
  const convPath = join(cacheDir, `conv-${convHash}.mp3`);
  if (FORCE || !existsSync(convPath)) {
    const f = new FormData();
    f.append("audio", fileBlob(isoPath), "voice.mp3");
    f.append("model_id", modelId);
    f.append(
      "voice_settings",
      JSON.stringify({ stability: v.stability ?? 0.5, similarity_boost: v.similarityBoost ?? 0.85, style: v.style ?? 0.2, use_speaker_boost: true }),
    );
    writeFileSync(convPath, Buffer.from(await (await postForm(`/speech-to-speech/${v.voiceId}?output_format=mp3_44100_128`, f)).arrayBuffer()));
    console.log("  voix convertie ✔");
  }
  // 3. Transcription mot à mot (minutage exact)
  const sttPath = join(cacheDir, `stt-${convHash}.json`);
  if (FORCE || !existsSync(sttPath)) {
    const f = new FormData();
    f.append("file", fileBlob(convPath), "voice.mp3");
    f.append("model_id", "scribe_v1");
    f.append("language_code", "fra");
    f.append("timestamps_granularity", "word");
    writeFileSync(sttPath, JSON.stringify(await (await postForm("/speech-to-text", f)).json()));
    console.log("  transcription ✔");
  }
  const stt = JSON.parse(readFileSync(sttPath, "utf8")) as { words: SttWord[] };
  const sttWords = stt.words.filter((w) => w.type === "word" && normWord(w.text) !== "");

  // 4. Alignement sous-titres ↔ mots transcrits, par "unités" (traits d'union découpés, chiffres
  //    écrits en lettres) pour supporter "4-3-3" ↔ "quatre trois trois", "90" ↔ "quatre-vingt-dix"...
  const NUM: Record<string, string> = {
    "0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "7": "sept",
    "8": "huit", "9": "neuf", "10": "dix", "11": "onze", "20": "vingt", "30": "trente", "40": "quarante",
    "50": "cinquante", "60": "soixante", "90": "quatre-vingt-dix", "100": "cent",
  };
  const units = (word: string) =>
    normWord(word)
      .split("-")
      .flatMap((p) => (NUM[p] ?? p).split("-"))
      .filter((p) => p !== "");
  const sttUnits = sttWords.flatMap((w) => units(w.text).map((u) => ({ u, start: w.start, end: w.end })));
  const subs = s.subtitles;
  let k = 0;
  const spans = subs.map((sub, i) => {
    const words = displayWords(sub.text);
    const starts: number[] = new Array(words.length).fill(-1);
    let first = -1;
    let last = 0;
    words.forEach((w, j) => {
      const us = units(w.text);
      if (!us.length) return;
      const seg = sttUnits.slice(k, k + us.length);
      if (seg.length < us.length) throw new Error(`Réplique ${i} : plus assez de mots transcrits ("${sub.text}")`);
      if (seg[0].u[0] !== us[0][0]) console.warn(`  ⚠ réplique ${i} : "${w.text}" aligné sur "${seg[0].u}"`);
      starts[j] = seg[0].start;
      if (first < 0) first = seg[0].start;
      last = seg[seg.length - 1].end;
      k += us.length;
    });
    for (let j = 0; j < words.length; j++) if (starts[j] < 0) starts[j] = j > 0 ? starts[j - 1] : first;
    return { first, last, starts };
  });
  if (k !== sttUnits.length) console.warn(`  ⚠ ${sttUnits.length - k} mot(s) transcrit(s) non utilisé(s) en fin de piste`);

  const trackLen = parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", convPath]).toString(),
  );
  const cuts = spans.map((sp, i) => (i === 0 ? Math.max(0, sp.first - 0.05) : (spans[i - 1].last + sp.first) / 2));
  const dir = `voiceover/${s.meta.id}`;
  mkdirSync(publicPath(dir), { recursive: true });
  const cache = new Map((prev?.lines ?? []).map((l) => [l.index, l]));
  const lines: VoiceLine[] = spans.map((sp, i) => {
    const cut = cuts[i];
    const end = cuts[i + 1] ?? trackLen;
    const hash = hashOf([convHash, subs[i].text, cut.toFixed(3), end.toFixed(3)]);
    const file = `${dir}/${String(i).padStart(2, "0")}-${hash}.mp3`;
    if (FORCE || cache.get(i)?.hash !== hash || !existsSync(publicPath(file))) {
      execFileSync("ffmpeg", ["-v", "error", "-y", "-i", convPath, "-ss", cut.toFixed(3), "-to", end.toFixed(3), "-c:a", "libmp3lame", "-b:a", "160k", publicPath(file)]);
    }
    return {
      index: i,
      hash,
      file,
      fixedStart: +cut.toFixed(3),
      speechStart: +(sp.first - cut).toFixed(3),
      duration: +(sp.last - cut).toFixed(3),
      wordStarts: sp.starts.map((t) => +(t - cut).toFixed(3)),
    };
  });
  lines.forEach((l, i) => console.log(`  voix [${i}] ${(l.fixedStart ?? 0).toFixed(2)} s  ${plainText(subs[i].text)}`));
  const keep = new Set(lines.map((l) => l.file.split("/").pop()));
  for (const f of readdirSync(publicPath(dir))) if (!keep.has(f)) unlinkSync(publicPath(`${dir}/${f}`));
  return { voice: { voiceId: v.voiceId, modelId, lines }, chars: 0 };
};

// ---------------------------------------------------------------------------
// Effets sonores
// ---------------------------------------------------------------------------

const genSounds = async (s: ScriptData, prev?: GeneratedAudio["sounds"]) => {
  const lib = resolveSounds(s.meta.sounds);
  const used = [
    ...new Set([
      ...(s.sfx ?? []).map((x) => x.sound),
      ...(s.stamps ?? []).filter((x) => x.sound !== false).map((x) => (x.sound || "stamp") as string),
    ]),
  ];
  const out: NonNullable<GeneratedAudio["sounds"]> = {};
  mkdirSync(publicPath("sfx"), { recursive: true });
  for (const name of used) {
    const def = lib[name];
    if (!def) throw new Error(`Son inconnu dans sfx : "${name}" (voir src/audioLibrary.ts)`);
    const hash = hashOf([def.prompt, def.duration]);
    const file = `sfx/${name}-${hash}.mp3`;
    if (!FORCE && prev?.[name]?.hash === hash && existsSync(publicPath(file))) {
      out[name] = prev[name];
      console.log(`  sfx ${name} (cache)`);
      continue;
    }
    const res = await post("/sound-generation", {
      text: def.prompt,
      duration_seconds: Math.max(0.5, def.duration),
      prompt_influence: 0.6,
    });
    writeFileSync(publicPath(file), Buffer.from(await res.arrayBuffer()));
    out[name] = { file, hash };
    console.log(`  sfx ${name} ✔`);
  }
  return out;
};

// ---------------------------------------------------------------------------
// Musique
// ---------------------------------------------------------------------------

const genMusic = async (s: ScriptData, seconds: number, prev?: GeneratedAudio["music"]) => {
  const m = s.meta.music!;
  const len = Math.ceil(seconds + 1);
  const hash = hashOf([m.prompt, len]);
  const file = `music/${s.meta.id}-${hash}.mp3`;
  if (!FORCE && prev?.hash === hash && existsSync(publicPath(file))) {
    console.log(`  musique (cache) ${len} s`);
    return prev;
  }
  mkdirSync(publicPath("music"), { recursive: true });
  const res = await post("/music?output_format=mp3_44100_128", {
    prompt: m.prompt,
    music_length_ms: len * 1000,
  });
  writeFileSync(publicPath(file), Buffer.from(await res.arrayBuffer()));
  if (prev?.file && prev.file !== file && existsSync(publicPath(prev.file))) unlinkSync(publicPath(prev.file));
  console.log(`  musique ✔ ${len} s`);
  return { file, hash, seconds: len };
};

// ---------------------------------------------------------------------------

const run = async () => {
  const existing: Record<string, GeneratedAudio> = existsSync(OUT_JSON)
    ? JSON.parse(readFileSync(OUT_JSON, "utf8"))
    : {};
  const result: Record<string, GeneratedAudio> = { ...existing };
  let chars = 0;

  for (const s of VIDEOS) {
    console.log(`\n▶ ${s.meta.id}`);
    const prev = existing[s.meta.id] ?? {};
    const audio: GeneratedAudio = {};
    if (s.meta.voice) {
      const r = s.meta.voice.mode === "speech-to-speech" ? await genVoiceSTS(s, prev.voice) : await genVoice(s, prev.voice);
      audio.voice = r.voice;
      chars += r.chars;
    }
    if (s.sfx?.length || s.stamps?.length) audio.sounds = await genSounds(s, prev.sounds);
    const { duration } = buildTimeMap(s, audio);
    console.log(`  durée finale de la vidéo : ${duration.toFixed(2)} s`);
    if (duration > 61) console.warn("  ⚠ plus de 61 s : raccourcis le texte ou retire des répliques.");
    if (s.meta.music) audio.music = await genMusic(s, duration, prev.music);
    else if (prev.music?.file && existsSync(publicPath(prev.music.file))) {
      unlinkSync(publicPath(prev.music.file));
      console.log("  musique retirée (meta.music absent)");
    }
    result[s.meta.id] = audio;
  }

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(result, null, 2) + "\n");
  console.log(`\n✔ ${OUT_JSON} mis à jour — ${chars} caractères de voix consommés.`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
