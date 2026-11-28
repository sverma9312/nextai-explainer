import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ExplainerScript, ArchitectureStep } from '../../../schema/types';
import { Scene1_ContextStage } from './Scene1_ContextStage';
import { Scene2_BottleneckStage } from './Scene2_BottleneckStage';
import { HexagonGridStage } from './HexagonGridStage';
import { GenericTopicStage } from './GenericTopicStage';
import { Scene5_TakeawayStage } from './Scene5_TakeawayStage';

interface MasterStoryStageProps {
  script: ExplainerScript;
}

export const MasterStoryStage: React.FC<MasterStoryStageProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const isLandscape = width > 1200;

  const totalDuration = durationInFrames / fps;
  const currentTime = frame / fps;
  const progress = currentTime / totalDuration; // 0 to 1

  const isStudio = script.stageArchetype === 'pipeline';
  const isSpatialMatching =
    !isStudio &&
    (script.topicId === 'uber-h3-matching' ||
      script.topicId.toLowerCase().includes('uber') ||
      script.company.toLowerCase().includes('uber') ||
      script.steps.some((s: ArchitectureStep) => s.narration.toLowerCase().includes('hexagon')));

  let sceneIndex = 1;
  let sceneHeader = '';
  let headerColor = '#FFFFFF';

  if (progress < 0.2) {
    sceneIndex = 1;
    sceneHeader = isSpatialMatching
      ? `HOW DOES ${script.company.toUpperCase()} FIND YOU A DRIVER IN SECONDS?`
      : `HOW DOES ${script.company.toUpperCase()} HANDLE ${script.scaleMetric.split('//')[0]?.trim().toUpperCase()}?`;
    headerColor = '#FFFFFF';
  } else if (progress < 0.4) {
    sceneIndex = 2;
    sceneHeader = isSpatialMatching
      ? 'OBVIOUS APPROACH'
      : script.steps[0]?.stepTitle || 'THE OBVIOUS APPROACH FAILS';
    headerColor = '#F43F5E';
  } else if (progress < 0.68) {
    sceneIndex = 3;
    sceneHeader = isSpatialMatching
      ? 'HEXAGONAL CELLS < 1 KM²'
      : script.steps[1]?.stepTitle || 'ARCHITECTURAL BREAKTHROUGH';
    headerColor = '#22D3EE';
  } else if (progress < 0.88) {
    sceneIndex = 4;
    sceneHeader = isSpatialMatching
      ? '1-RING NEIGHBOR DISPATCH'
      : script.steps[2]?.stepTitle || 'OPTIMAL LOW-LATENCY SERVING';
    headerColor = '#10B981';
  } else {
    sceneIndex = 5;
    sceneHeader = 'THE ENGINEERING RULE';
    headerColor = '#FBBF24';
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: isLandscape ? 100 : 130,
        left: isLandscape ? 60 : 50,
        width: isLandscape ? 1800 : 980,
        height: isLandscape ? 820 : 1280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {/* 1. Large Chalk / Technical Header matching style */}
      <div
        style={{
          height: isLandscape ? 70 : 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <span
          style={{
            fontSize: isLandscape
              ? (sceneIndex === 1 ? (isStudio ? 30 : 34) : (isStudio ? 34 : 38))
              : (sceneIndex === 1 ? (isStudio ? 36 : 40) : (isStudio ? 42 : 48)),
            fontFamily: isStudio
              ? '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              : '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
            fontWeight: 800,
            color: headerColor,
            letterSpacing: isStudio ? '0.02em' : 2,
            lineHeight: 1.25,
            textShadow: `0 0 25px ${headerColor}66`,
            textTransform: 'uppercase',
          }}
        >
          {sceneHeader}
        </span>
      </div>

      {/* 2. Interactive Stage Visuals (Fills remaining height) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Scene 1 (0% - 20%): Viral Context Stage */}
        {sceneIndex === 1 && (
          <Scene1_ContextStage
            company={script.company}
            companySvgDataUri={script.companySvgDataUri}
            visualEntities={script.visualEntities}
            scaleMetric={script.scaleMetric}
          />
        )}

        {/* Scenes 2-4: Spatial Breakdown (Uber) or Free-floating Architecture Diagram (Stripe, etc.) */}
        {sceneIndex >= 2 && sceneIndex <= 4 && (
          isSpatialMatching ? (
            <>
              {sceneIndex === 2 && (
                <Scene2_BottleneckStage
                  visualEntities={script.visualEntities}
                />
              )}
              {sceneIndex === 3 && (
                <HexagonGridStage
                  sceneStep={3}
                  visualEntities={script.visualEntities}
                />
              )}
              {sceneIndex === 4 && (
                <HexagonGridStage
                  sceneStep={4}
                  visualEntities={script.visualEntities}
                />
              )}
            </>
          ) : (
            <GenericTopicStage
              script={script}
              sceneIndex={sceneIndex}
            />
          )
        )}

        {/* Scene 5 (88% - 100%): Golden Engineering Rule */}
        {sceneIndex === 5 && (
          <Scene5_TakeawayStage
            rule={script.takeaway}
            company={script.company}
            topicId={script.topicId}
          />
        )}
      </div>
    </div>
  );
};
