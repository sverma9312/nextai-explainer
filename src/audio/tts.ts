import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fsp from 'node:fs/promises';
import path from 'node:path';
import type { WordSubtitle } from '../schema/types.js';

export interface TTSResult {
  audioPath: string;
  subtitlesPath: string;
  durationSeconds: number;
  subtitles: WordSubtitle[];
}

interface ChunkSynthesisResult {
  buffer: Buffer;
  words: WordSubtitle[];
  duration: number;
}

/**
 * Sanitizes speech text to remove XML-breaking entities, curly quotes, and expand technical acronyms.
 * Edge-TTS WebSocket drops connections if raw unescaped `<` or `&` or mismatched quotes are sent.
 */
export function sanitizeSpeechText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/&/g, ' and ')
    .replace(/</g, ' under ')
    .replace(/>/g, ' over ')
    .replace(/(\d+)\s*ms\b/gi, '$1 milliseconds')
    .replace(/(\d+)\s*s\b/gi, '$1 seconds')
    .replace(/(\d+)\s*min\b/gi, '$1 minutes')
    .replace(/(\d+)\s*km²\b/gi, '$1 square kilometers')
    .replace(/O\(N\)/gi, 'O of N')
    .replace(/O\(1\)/gi, 'O of 1')
    .replace(/[#*~`_\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes a single short chunk (10-25 words) using MsEdgeTTS file generator with isolated retries and hard timeouts.
 * Short payloads and fresh WebSocket instances with clean attempt directories prevent drops.
 */
async function synthesizeSingleChunk(
  text: string,
  voiceName: string,
  voiceRate: string,
  chunkIndex: number,
  totalChunks: number,
  tempRootDir: string
): Promise<ChunkSynthesisResult> {
  let lastError: Error | null = null;
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const chunkDir = path.join(tempRootDir, `c_${chunkIndex}_a_${attempt}_${Date.now()}`);
    await fsp.mkdir(chunkDir, { recursive: true });

    // Consistently maintain the exact same chosen voice across all chunks and retries
    const selectedVoice = voiceName;

    const tts = new MsEdgeTTS();
    try {
      await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
        wordBoundaryEnabled: true,
      });

      // 45-second timeout to accommodate longer chunks without premature cancellation
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Edge-TTS synthesis timed out after 45s'));
        }, 45000);
      });

      const res = await Promise.race([
        tts.toFile(chunkDir, text, { rate: voiceRate }),
        timeoutPromise,
      ]).finally(() => {
        clearTimeout(timer);
      });

      try {
        tts.close();
      } catch {}

      const audioBuffer = await fsp.readFile(res.audioFilePath);
      const words: WordSubtitle[] = [];
      let maxEndSec = 0;

      if (res.metadataFilePath) {
        try {
          const metaRaw = await fsp.readFile(res.metadataFilePath, 'utf-8');
          const meta = JSON.parse(metaRaw);
          if (Array.isArray(meta?.Metadata)) {
            for (const item of meta.Metadata) {
              if (item.Type === 'WordBoundary' && item.Data?.text?.Text) {
                const offsetTicks = item.Data.Offset || 0;
                const durationTicks = item.Data.Duration || 0;
                const startSec = offsetTicks / 10000000;
                const endSec = (offsetTicks + durationTicks) / 10000000;
                words.push({
                  text: item.Data.text.Text.trim(),
                  start: Number(startSec.toFixed(3)),
                  end: Number(endSec.toFixed(3)),
                });
                if (endSec > maxEndSec) {
                  maxEndSec = endSec;
                }
              }
            }
          }
        } catch {
          // ignore metadata parse error
        }
      }

      // Calculate sample-accurate duration
      const duration = words.length > 0 && maxEndSec > 0
        ? maxEndSec + 0.15
        : audioBuffer.length / 12000;

      // Clean up chunk temporary directory
      try {
        await fsp.rm(chunkDir, { recursive: true, force: true });
      } catch {}

      return {
        buffer: audioBuffer,
        words,
        duration,
      };
    } catch (err: any) {
      try {
        tts.close();
      } catch {}
      try {
        await fsp.rm(chunkDir, { recursive: true, force: true });
      } catch {}

      lastError = err;
      if (attempt < maxAttempts) {
        console.warn(`   [TTS] Chunk ${chunkIndex + 1}/${totalChunks} attempt ${attempt} failed: ${err.message}. Retrying in ${(attempt * 1.5).toFixed(1)}s...`);
        await new Promise((r) => setTimeout(r, attempt * 1500));
      }
    }
  }

  throw new Error(`Failed to synthesize chunk ${chunkIndex + 1}/${totalChunks} after ${maxAttempts} attempts: ${lastError?.message}`);
}

/**
 * Robust multi-chunk speech synthesis engine.
 * Breaks monolithic voiceovers into small, bulletproof sections, synthesizes them with isolated retries,
 * and concatenates audio buffers while accurately offsetting word subtitle timestamps.
 */
export async function synthesizeVoiceover(
  spokenInput: string | string[],
  outAudioPath: string,
  voiceName?: string
): Promise<TTSResult> {
  const selectedVoice = voiceName || process.env.VIDEO_VOICE_NAME || 'en-US-AndrewNeural';
  const voiceRate = process.env.VIDEO_VOICE_RATE || '+0%';

  const dir = path.dirname(outAudioPath);
  await fsp.mkdir(dir, { recursive: true });

  const tempChunksDir = path.join(dir, `tts_chunks_${Date.now()}`);
  await fsp.mkdir(tempChunksDir, { recursive: true });

  // Determine section chunks and sanitize each one
  let chunks: string[] = [];
  if (Array.isArray(spokenInput)) {
    chunks = spokenInput
      .map((s) => sanitizeSpeechText(s))
      .filter((s) => s.length > 0);
  } else {
    const sanitized = sanitizeSpeechText(spokenInput);
    chunks = sanitized
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  if (chunks.length === 0) {
    throw new Error('No spoken text provided for voiceover synthesis.');
  }

  const allWords: WordSubtitle[] = [];
  const allBuffers: Buffer[] = [];
  let currentTimeOffset = 0;

  console.log(`🎙️ [TTS] Synthesizing ${chunks.length} distinct audio chunks to prevent socket drops...`);

  try {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkResult = await synthesizeSingleChunk(
        chunk,
        selectedVoice,
        voiceRate,
        i,
        chunks.length,
        tempChunksDir
      );

      // Offset and collect word-level subtitles
      for (const w of chunkResult.words) {
        allWords.push({
          text: w.text,
          start: Number((w.start + currentTimeOffset).toFixed(3)),
          end: Number((w.end + currentTimeOffset).toFixed(3)),
        });
      }

      allBuffers.push(chunkResult.buffer);
      currentTimeOffset += chunkResult.duration;
    }

    const mergedBuffer = Buffer.concat(allBuffers);
    await fsp.writeFile(outAudioPath, mergedBuffer);

    const subtitlesPath = outAudioPath.replace(/\.mp3$/i, '_subtitles.json');
    await fsp.writeFile(subtitlesPath, JSON.stringify(allWords, null, 2), 'utf-8');

    return {
      audioPath: outAudioPath,
      subtitlesPath,
      durationSeconds: Number(currentTimeOffset.toFixed(2)),
      subtitles: allWords,
    };
  } finally {
    // Clean up temp parent directory
    try {
      await fsp.rm(tempChunksDir, { recursive: true, force: true });
    } catch {}
  }
}
