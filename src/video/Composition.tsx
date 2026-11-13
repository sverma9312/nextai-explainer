import React from 'react';
import { Audio, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ExplainerCompositionProps } from '../schema/types';
import { Background } from './components/Background';
import { HeaderBanner } from './components/HeaderBanner';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { StepCalloutBar } from './components/StepCalloutBar';
import { KineticCaptions } from './components/KineticCaptions';
import { Waveform } from './components/Waveform';
import { OutroCard } from './components/OutroCard';

export const ExplainerComposition: React.FC<ExplainerCompositionProps> = ({
  script,
  audioSrc,
  subtitles,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalDurationSeconds = durationInFrames / fps;
  const currentTime = frame / fps;

  // Calculate current active step based on progress
  // Step 1: 0% to 33%
  // Step 2: 33% to 66%
  // Step 3: 66% to 100%
  const stepFraction = currentTime / totalDurationSeconds;
  let currentStep = 1;
  if (stepFraction >= 0.33 && stepFraction < 0.66) {
    currentStep = 2;
  } else if (stepFraction >= 0.66) {
    currentStep = 3;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: '#07080C',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 1. Background Grid & Radial Cyberpunk Glow */}
      <Background />

      {/* 2. Top Header Title & Scale Badge */}
      <HeaderBanner
        company={script.company}
        companyLogo={script.companyLogo}
        title={script.videoTitle.replace(/#Shorts/gi, '').trim()}
        scaleMetric={script.scaleMetric}
      />

      {/* 3. Main Architecture Canvas (Nodes, Edges, Packets) */}
      <ArchitectureCanvas
        nodes={script.nodes}
        edges={script.edges}
        currentStep={currentStep}
      />

      {/* 4. Layer Step Callout Bar */}
      <StepCalloutBar steps={script.steps} currentStep={currentStep} />

      {/* 5. Synchronized Kinetic Captions */}
      <KineticCaptions subtitles={subtitles} />

      {/* 6. Audio Waveform */}
      <Waveform />

      {/* 7. Outro Card */}
      <OutroCard />

      {/* 8. Voiceover Audio */}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

