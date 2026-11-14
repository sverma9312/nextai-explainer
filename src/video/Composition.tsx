import React from 'react';
import { Audio, useVideoConfig } from 'remotion';
import type { ExplainerCompositionProps } from '../schema/types';
import { Background } from './components/Background';
import { MasterStoryStage } from './components/story/MasterStoryStage';
import { KineticCaptions } from './components/KineticCaptions';
import { BrandAppBadge } from './components/icons/TechLogos';

export const ExplainerComposition: React.FC<ExplainerCompositionProps> = ({
  script,
  audioSrc,
  subtitles,
}) => {
  const { width, height } = useVideoConfig();
  const isLandscape = width > height;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#050608',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 1. Subtle Dark Canvas Glow */}
      <Background />

      {/* 2. Top Header Brand Bar */}
      <div
        style={{
          position: 'absolute',
          top: isLandscape ? 30 : 50,
          left: isLandscape ? 60 : 50,
          right: isLandscape ? 60 : 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#0E1019',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 999,
            padding: isLandscape ? '8px 24px' : '8px 20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          <BrandAppBadge name={script.company} size={isLandscape ? 30 : 28} minimal={true} />
          <span
            style={{
              fontSize: isLandscape ? 17 : 16,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 2,
              fontFamily: 'sans-serif',
            }}
          >
            {script.company.toUpperCase()} ARCHITECTURE
          </span>
        </div>

        {/* Center Badge in Landscape Mode */}
        {isLandscape && (
          <div
            style={{
              backgroundColor: 'rgba(0, 245, 160, 0.1)',
              border: '1.5px solid rgba(0, 245, 160, 0.35)',
              borderRadius: 999,
              padding: '6px 20px',
              fontSize: 14,
              fontWeight: 800,
              color: '#00F5A0',
              letterSpacing: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 20px rgba(0, 245, 160, 0.2)',
            }}
          >
            <span>⚡</span> SOFTWARE ARCHITECTURE IN 60s
          </div>
        )}

        <div
          style={{
            backgroundColor: 'rgba(34, 211, 238, 0.12)',
            border: '1.5px solid #22D3EE',
            borderRadius: 999,
            padding: isLandscape ? '8px 24px' : '8px 20px',
            fontSize: isLandscape ? 17 : 16,
            fontWeight: 800,
            color: '#22D3EE',
            fontFamily: 'monospace',
            letterSpacing: 1,
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.25)',
          }}
        >
          {script.scaleMetric}
        </div>
      </div>

      {/* 3. Master Visual Story Stage (Responsive for 16:9 Landscape & 9:16 Portrait) */}
      <MasterStoryStage script={script} />

      {/* 4. Synchronized Tech Captions (Clean Dock-Style) */}
      <KineticCaptions subtitles={subtitles} />

      {/* 5. Voiceover Audio */}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};
