import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const pulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.15, 0.28]);
  const drift = (frame * 0.4) % 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#07080C',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Radial Violet & Cyan Energy Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: 900,
          height: 900,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(168, 85, 247, ${pulse}) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Cyberpunk Grid Lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: `0px ${drift}px`,
          opacity: 0.6,
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />
    </div>
  );
};

