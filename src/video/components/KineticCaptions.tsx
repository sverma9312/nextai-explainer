import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordSubtitle } from '../../schema/types.js';

interface KineticCaptionsProps {
  subtitles: WordSubtitle[];
}

interface CaptionPhrase {
  words: WordSubtitle[];
  start: number;
  end: number;
}

function groupSubtitlesIntoPhrases(subtitles: WordSubtitle[], maxWords = 3): CaptionPhrase[] {
  if (!subtitles || subtitles.length === 0) return [];
  const phrases: CaptionPhrase[] = [];
  let currentWords: WordSubtitle[] = [];

  for (let i = 0; i < subtitles.length; i++) {
    const w = subtitles[i];
    currentWords.push(w);

    const hasPunctuation = /[.,!?;:]$/.test(w.text.trim());
    const isLast = i === subtitles.length - 1;

    if (currentWords.length >= maxWords || hasPunctuation || isLast) {
      phrases.push({
        words: [...currentWords],
        start: currentWords[0].start,
        end: currentWords[currentWords.length - 1].end + 0.15,
      });
      currentWords = [];
    }
  }

  return phrases;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({ subtitles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;
  const phrases = useMemo(() => groupSubtitlesIntoPhrases(subtitles, 3), [subtitles]);

  // Find the currently active phrase
  const activePhrase = phrases.find(
    (p) => currentTime >= p.start - 0.05 && currentTime <= p.end + 0.2
  );

  if (!activePhrase) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 1560,
        left: 50,
        right: 50,
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(9, 12, 20, 0.82)',
        border: '1.5px solid rgba(34, 211, 238, 0.28)',
        borderRadius: 24,
        padding: '18px 32px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(34, 211, 238, 0.15)',
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {activePhrase.words.map((w, i) => {
          const isCurrent = currentTime >= w.start - 0.04 && currentTime <= w.end + 0.08;

          return (
            <span
              key={`${w.start}-${i}`}
              style={{
                fontSize: isCurrent ? 46 : 38,
                fontWeight: isCurrent ? 900 : 800,
                color: isCurrent ? '#22D3EE' : '#94A3B8',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.04em',
                transform: isCurrent ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 0.08s ease, color 0.08s ease',
                textShadow: isCurrent
                  ? '0 0 25px rgba(34, 211, 238, 0.95), 0 2px 10px rgba(0, 0, 0, 0.9)'
                  : '0 2px 8px rgba(0, 0, 0, 0.8)',
                display: 'inline-block',
                margin: '0 10px',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

