import React from 'react';
import { Audio } from 'remotion';
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
  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: '#050608',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 1. Subtle Dark Canvas Glow */}
      <Background />

      {/* 2. Top Header Brand Pill */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 50,
          right: 50,
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
            padding: '8px 20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          <BrandAppBadge name={script.company} size={28} minimal={true} />
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 2,
              fontFamily: 'sans-serif',
            }}
          >
            {script.company.toUpperCase()} ARCHITECTURE
          </span>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(34, 211, 238, 0.12)',
            border: '1.5px solid #22D3EE',
            borderRadius: 999,
            padding: '8px 20px',
            fontSize: 16,
            fontWeight: 800,
            color: '#22D3EE',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        >
          {script.scaleMetric}
        </div>
      </div>

      {/* 3. Master Visual Story Stage (5 Scenes with Real Icons & Animations) */}
      <MasterStoryStage script={script} />

      {/* 4. Synchronized Tech Captions (Clean Dock-Style, No Equalizer Bars) */}
      <KineticCaptions subtitles={subtitles} />

      {/* 5. Voiceover Audio */}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};
