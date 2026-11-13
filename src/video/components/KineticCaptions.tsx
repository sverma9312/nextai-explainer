import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordSubtitle } from '../../schema/types.js';

interface KineticCaptionsProps {
  subtitles: WordSubtitle[];
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({ subtitles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  // Find the active word index
  const activeIndex = subtitles.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  // Grab a window of 5 words around active word
  const windowSize = 5;
  const startIdx = Math.max(0, (activeIndex === -1 ? 0 : activeIndex) - 2);
  const visibleWords = subtitles.slice(startIdx, startIdx + windowSize);

  if (visibleWords.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 1520,
        left: 50,
        right: 50,
        minHeight: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(7, 8, 12, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 22,
        padding: '16px 24px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        zIndex: 10,
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
        {visibleWords.map((w, i) => {
          const isCurrent = currentTime >= w.start && currentTime <= w.end;

          return (
            <span
              key={`${w.start}-${i}`}
              style={{
                fontSize: isCurrent ? 36 : 30,
                fontWeight: isCurrent ? 900 : 700,
                color: isCurrent ? '#06B6D4' : '#9CA3AF',
                textShadow: isCurrent ? '0 0 20px rgba(6, 182, 212, 0.7)' : undefined,
                transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.1s ease',
                fontFamily: 'sans-serif',
                letterSpacing: '-0.02em',
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
