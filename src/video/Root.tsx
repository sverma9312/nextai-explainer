import React from 'react';
import { Composition, Still, registerRoot } from 'remotion';
import { ExplainerComposition } from './Composition';
import { ExplainerAvatar } from './ExplainerAvatar';
import { TOPICS } from '../catalog/topics';
import type { ExplainerCompositionProps } from '../schema/types';

const sampleTopic = TOPICS[0];

const defaultProps: ExplainerCompositionProps = {
  script: {
    topicId: sampleTopic.id,
    company: sampleTopic.company,
    companyLogo: sampleTopic.companyLogo,
    videoTitle: `${sampleTopic.title} #Shorts`,
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
      <Composition
        id="ExplainerReel"
        component={ExplainerComposition}
        durationInFrames={30 * 60}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
      <Still
        id="ExplainerAvatar"
        component={ExplainerAvatar}
        width={1024}
        height={1024}
      />
    </>
  );
};

registerRoot(Root);


