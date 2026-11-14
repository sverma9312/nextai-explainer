import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOPICS } from '../catalog/topics.js';
import type { ExplainerCompositionProps } from '../schema/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const uberTopic = TOPICS[0];
  const outPath = 'C:/Users/sverm/.gemini/antigravity/brain/4eb41a64-5907-4bf9-b259-2904c9fbe2dc/option_b_uber_studio.jpg';

  // Option B: Studio Pipeline Archetype
  const inputProps: ExplainerCompositionProps = {
    script: {
      topicId: 'uber-h3-matching',
      company: 'Uber',
      companyLogo: '🚗',
      videoTitle: 'How Uber Matches 1M Drivers in 100ms #Shorts',
      hook: 'How does Uber pinpoint the closest driver in under 100 milliseconds among 1 million moving vehicles?',
      scaleMetric: '1M+ Drivers // <100ms P99',
      stageArchetype: 'pipeline', // forces studio layout!
      nodes: uberTopic.nodes,
      edges: uberTopic.edges,
      steps: uberTopic.steps,
      takeaway: uberTopic.takeaway,
      fullSpokenText: 'How does Uber match 1 million drivers in under 100 milliseconds?',
      visualEntities: [
        { id: 'rider', label: 'Rider App', iconQuery: 'mobile person user', role: 'actor' },
        { id: 'gateway', label: 'Envoy Gateway', iconQuery: 'api gateway proxy envoy', role: 'gateway' },
        { id: 'redis_h3', label: 'Redis H3 Cluster', iconQuery: 'redis database cache', role: 'cache' },
        { id: 'driver_fleet', label: 'Driver Fleet', iconQuery: 'car vehicle', role: 'actor' },
        { id: 'docstore', label: 'DocStore DB', iconQuery: 'database storage', role: 'database' },
      ],
    },
    audioSrc: '',
    subtitles: [
      { text: 'HOW', start: 0.1, end: 0.4 },
      { text: 'DOES', start: 0.4, end: 0.7 },
      { text: 'UBER', start: 0.7, end: 1.1 },
      { text: 'MATCH', start: 1.1, end: 1.5 },
      { text: 'DRIVERS', start: 1.5, end: 2.0 },
      { text: 'INSTANTLY', start: 2.0, end: 2.5 },
    ],
    durationInFrames: 30 * 45,
    fps: 30,
  };

  const entryPoint = path.resolve(__dirname, '../video/Root.tsx');
  console.log('Bundling Remotion...');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js', '.jsx'],
          '.mjs': ['.mts', '.mjs'],
          '.cjs': ['.cts', '.cjs'],
        },
      },
    }),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerReel',
    inputProps,
  });

  console.log('Rendering Option B still frame at frame 150...');
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: outPath,
    inputProps,
    frame: 150,
    imageFormat: 'jpeg',
    jpegQuality: 90,
  });

  console.log('Done! Rendered to', outPath);
}

main().catch(console.error);

