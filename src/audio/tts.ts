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

export async function synthesizeVoiceover(
  spokenText: string,
  outAudioPath: string,
  voiceName?: string
): Promise<TTSResult> {
  const selectedVoice = voiceName || process.env.VIDEO_VOICE_NAME || 'en-US-AndrewMultilingualNeural';
  const voiceRate = process.env.VIDEO_VOICE_RATE || '+4%';

  const dir = path.dirname(outAudioPath);
  await fsp.mkdir(dir, { recursive: true });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
        wordBoundaryEnabled: true,
      });

      const words: WordSubtitle[] = [];
      const writeStream = fs.createWriteStream(outAudioPath);
      const stream = tts.toStream(spokenText, { rate: voiceRate });

      if (stream.metadataStream) {
        stream.metadataStream.on('data', (chunk: Buffer) => {
          try {
            const parsed = JSON.parse(chunk.toString('utf-8'));
            if (parsed?.Metadata) {
              for (const item of parsed.Metadata) {
                if (item.Type === 'WordBoundary' && item.Data?.text?.Text) {
                  const offsetTicks = item.Data.Offset || 0;
                  const durationTicks = item.Data.Duration || 0;
                  words.push({
                    text: item.Data.text.Text.trim(),
                    start: Number((offsetTicks / 10000000).toFixed(3)),
                    end: Number(((offsetTicks + durationTicks) / 10000000).toFixed(3)),
                  });
                }
              }
            }
          } catch {
            // ignore partial json
          }
        });
      }

      stream.audioStream.pipe(writeStream);

      await new Promise<void>((resolve, reject) => {
        let isDone = false;
        const timeout = setTimeout(() => {
          if (!isDone) {
            isDone = true;
            reject(new Error('Edge-TTS synthesis timed out after 25s'));
          }
        }, 25000);

        writeStream.on('finish', () => {
          if (!isDone) {
            isDone = true;
            clearTimeout(timeout);
            setTimeout(resolve, 80);
          }
        });

        writeStream.on('error', (err) => {
          if (!isDone) {
            isDone = true;
            clearTimeout(timeout);
            reject(err);
          }
        });

        stream.audioStream.on('error', (err: any) => {
          if (!isDone) {
            // Gracefully accept if substantial words & audio were captured before abrupt socket drop
            if (err?.message?.includes('no turn.end received') && words.length >= 20) {
              isDone = true;
              clearTimeout(timeout);
              writeStream.end();
              setTimeout(resolve, 80);
            } else {
              isDone = true;
              clearTimeout(timeout);
              reject(err);
            }
          }
        });
      });

      try {
        tts.close();
      } catch {}

      const stats = await fsp.stat(outAudioPath);
      let durationSeconds = 30;
      if (words.length > 0) {
        const lastWord = words[words.length - 1];
        durationSeconds = Math.max(1, lastWord.end + 1.0);
      } else if (stats.size > 0) {
        durationSeconds = stats.size / 12000;
      }

      const subtitlesPath = outAudioPath.replace(/\.mp3$/i, '_subtitles.json');
      await fsp.writeFile(subtitlesPath, JSON.stringify(words, null, 2), 'utf-8');

      return {
        audioPath: outAudioPath,
        subtitlesPath,
        durationSeconds: Number(durationSeconds.toFixed(2)),
        subtitles: words,
      };
    } catch (err: any) {
      console.warn(`[TTS] Attempt ${attempt}/5 failed: ${err.message}. Retrying in ${attempt * 1.5}s...`);
      lastError = err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }

  throw new Error(`TTS synthesis failed after 5 attempts: ${lastError?.message}`);
}
