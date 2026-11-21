import React from 'react';
import { Composition, Still, registerRoot } from 'remotion';
import { ExplainerComposition } from './Composition';
import { ExplainerAvatar } from './ExplainerAvatar';
import { ExplainerPoster, type ExplainerPosterProps } from './components/ExplainerPoster';
import { TOPICS } from '../catalog/topics';
import type { ExplainerCompositionProps } from '../schema/types';

const sampleTopic = TOPICS[0];

const defaultPosterProps: ExplainerPosterProps = {
  company: sampleTopic.company,
  companyLogo: sampleTopic.companyLogo,
  topicTitle: sampleTopic.title,
  volNumber: 'VOL. 01',
  category: 'ANIMATED SYSTEM DESIGN',
  scaleMetric: sampleTopic.scaleMetric,
  summaryText: sampleTopic.problemStatement,
};

const defaultProps: ExplainerCompositionProps = {
  script: {
    topicId: sampleTopic.id,
    company: sampleTopic.company,
    companyLogo: sampleTopic.companyLogo,
    videoTitle: `${sampleTopic.title} | Software Architecture`,
    hook: sampleTopic.problemStatement,
    scaleMetric: sampleTopic.scaleMetric,
    nodes: sampleTopic.nodes,
    edges: sampleTopic.edges,
    steps: sampleTopic.steps,
    takeaway: sampleTopic.takeaway,
    fullSpokenText: `${sampleTopic.problemStatement} ${sampleTopic.steps[0].narration} ${sampleTopic.steps[1].narration} ${sampleTopic.steps[2].narration} ${sampleTopic.takeaway}`,
  },
  audioSrc: '',
  subtitles: [
    { text: 'How', start: 0.1, end: 0.4 },
    { text: 'does', start: 0.4, end: 0.7 },
    { text: 'Uber', start: 0.7, end: 1.1 },
    { text: 'match', start: 1.1, end: 1.5 },
    { text: 'drivers', start: 1.5, end: 2.0 },
    { text: 'in', start: 2.0, end: 2.3 },
    { text: '100ms?', start: 2.3, end: 3.0 },
  ],
  durationInFrames: 30 * 60, // 60 seconds default
  fps: 30,
};

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. Full 16:9 Landscape Video for YouTube & Explainer Website */}
      <Composition
        id="ExplainerLandscape"
        component={ExplainerComposition}
        durationInFrames={30 * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* 2. Full 9:16 Portrait Reel for Instagram Reels */}
      <Composition
        id="ExplainerReel"
        component={ExplainerComposition}
        durationInFrames={30 * 60}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />

      {/* 3. High-Resolution Channel & App Avatar */}
      <Still
        id="ExplainerAvatar"
        component={ExplainerAvatar}
        width={1024}
        height={1024}
      />

      {/* 4. Instagram Reel Editorial Cover / Thumbnail (9:16) */}
      <Still
        id="ExplainerPoster"
        component={ExplainerPoster}
        width={1080}
        height={1920}
        defaultProps={defaultPosterProps}
      />
    </>
  );
};

registerRoot(Root);
