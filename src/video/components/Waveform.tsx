import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const Waveform: React.FC = () => {
  const frame = useCurrentFrame();

  const barCount = 36;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Generate dynamic wave pattern based on frame and index
    const wave = Math.sin(frame * 0.18 + i * 0.35) * Math.cos(frame * 0.12 - i * 0.2);
    const height = interpolate(wave, [-1, 1], [8, 48]);
    return height;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 1670,
        left: 50,
        right: 50,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        zIndex: 10,
      }}
    >
      {bars.map((height, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height,
            borderRadius: 4,
            background: 'linear-gradient(to top, #A855F7 0%, #06B6D4 100%)',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)',
            transition: 'height 0.05s ease',
          }}
        />
      ))}
    </div>
  );
};

