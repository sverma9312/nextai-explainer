import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import type { WordSubtitle } from '../schema/types.js';

export interface TTSResult {
  audioPath: string;
  subtitlesPath: string;
  durationSeconds: number;
  subtitles: WordSubtitle[];
}

/**
 * Sanitizes speech text to remove XML-breaking entities, curly quotes, and expand technical acronyms.
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
 * Robust single-voice speech synthesis engine.
 * Connects via single persistent audio stream to MsEdgeTTS, avoiding websocket burst resets,
 * while accurately capturing word subtitle timestamps.
 */
export async function synthesizeVoiceover(
  spokenInput: string | string[],
  outAudioPath: string,
  voiceName?: string
): Promise<TTSResult> {
  const selectedVoice = voiceName || process.env.VIDEO_VOICE_NAME || 'en-US-AndrewMultilingualNeural';
  const voiceRate = process.env.VIDEO_VOICE_RATE || '+0%';

  const dir = path.dirname(outAudioPath);
  await fsp.mkdir(dir, { recursive: true });

  const rawText = Array.isArray(spokenInput) ? spokenInput.join(' ') : spokenInput;
  const sanitizedText = sanitizeSpeechText(rawText);

  if (!sanitizedText) {
    throw new Error('No spoken text provided for voiceover synthesis.');
  }

  let lastError: Error | null = null;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const tts = new MsEdgeTTS();
    try {
      await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
        wordBoundaryEnabled: true,
      });

      const writeStream = fs.createWriteStream(outAudioPath);
      const stream = tts.toStream(sanitizedText, { rate: voiceRate });
      const allWords: WordSubtitle[] = [];
      let maxEndSec = 0;

      if (stream.metadataStream) {
        stream.metadataStream.on('data', (chunk: Buffer) => {
          try {
            const meta = JSON.parse(chunk.toString('utf-8'));
            if (Array.isArray(meta?.Metadata)) {
              for (const item of meta.Metadata) {
                if (item.Type === 'WordBoundary' && item.Data?.text?.Text) {
                  const offsetTicks = item.Data.Offset || 0;
                  const durationTicks = item.Data.Duration || 0;
                  const startSec = offsetTicks / 10000000;
                  const endSec = (offsetTicks + durationTicks) / 10000000;
                  allWords.push({
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
          } catch {}
        });
      }

      stream.audioStream.pipe(writeStream);

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => setTimeout(resolve, 80));
        writeStream.on('error', reject);
        stream.audioStream.on('error', reject);
      });

      try {
        tts.close();
      } catch {}

      const subtitlesPath = outAudioPath.replace(/\.mp3$/i, '_subtitles.json');
      await fsp.writeFile(subtitlesPath, JSON.stringify(allWords, null, 2), 'utf-8');

      // Stat file for byte length (96kbps mono MP3 = 12,000 bytes/sec)
      const stat = await fsp.stat(outAudioPath);
      const exactAudioDuration = stat.size / 12000;

      // Outro cushion (1.5s): allows the final word to finish speaking completely
      // with full acoustic decay and holds the final "Engineering Rule" takeaway card for 1.5s.
      const OUTRO_PAD_SECONDS = 1.5;
      const finalDurationSeconds = Number((Math.max(exactAudioDuration, maxEndSec) + OUTRO_PAD_SECONDS).toFixed(2));

      console.log(`🎙️ [TTS] Voiceover complete (voice: ${selectedVoice}): Audio=${exactAudioDuration.toFixed(2)}s, Composition Duration=${finalDurationSeconds}s (+${OUTRO_PAD_SECONDS}s outro hold)`);

      return {
        audioPath: outAudioPath,
        subtitlesPath,
        durationSeconds: finalDurationSeconds,
        subtitles: allWords,
      };
    } catch (err: any) {
      try {
        tts.close();
      } catch {}
      console.warn(`[TTS] Attempt ${attempt}/${maxAttempts} failed: ${err.message}. Retrying...`);
      lastError = err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  throw new Error(`TTS synthesis failed after ${maxAttempts} attempts: ${lastError?.message}`);
}
