import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const outroDuration = 3 * fps; // Last 3 seconds
  const startFrame = durationInFrames - outroDuration;

  if (frame < startFrame) {
    return null;
  }

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(7, 8, 12, 0.94)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        zIndex: 50,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Brand Badge */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.6)',
        }}
      >
        🧠
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            fontFamily: 'sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          NextAI Explainer
        </h2>
        <p
          style={{
            fontSize: 22,
            color: '#9CA3AF',
            marginTop: 8,
            fontFamily: 'sans-serif',
          }}
        >
          Daily Animated System Design Breakdowns
        </p>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 999,
          padding: '12px 28px',
          fontSize: 20,
          fontWeight: 800,
          color: '#22D3EE',
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
        }}
      >
        ▶ Subscribe for Next Episode
      </div>
    </div>
  );
};
