import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { TOPICS } from '../src/catalog/topics.js';
import type { ExplainerPosterProps } from '../src/video/components/ExplainerPoster.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sampleTopic = TOPICS[0]; // Uber H3 Matching
  const artifactPath = 'C:/Users/sverm/.gemini/antigravity/brain/4eb41a64-5907-4bf9-b259-2904c9fbe2dc/explainer_sample_thumbnail.jpg';
  const localOutDir = path.resolve(process.cwd(), 'out');
  await fsp.mkdir(localOutDir, { recursive: true });
  const localPath = path.resolve(localOutDir, `${sampleTopic.id}_cover.jpg`);

  const inputProps: ExplainerPosterProps = {
    company: sampleTopic.company,
    companyLogo: sampleTopic.companyLogo,
    topicTitle: sampleTopic.title,
    volNumber: 'VOL. 01',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: sampleTopic.scaleMetric,
    summaryText: 'Deconstructing hexagonal spatial indexing and real-time candidate search in sixty seconds.',
  };

  const entryPoint = path.resolve(__dirname, '../src/video/Root.tsx');
  console.log('📦 Bundling Remotion composition...');
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

  console.log('🎨 Selecting composition "ExplainerPoster"...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerPoster',
    inputProps,
  });

  console.log(`🖼️ Rendering 1080x1920 Instagram Reel Cover to:\n   -> ${localPath}\n   -> ${artifactPath}`);
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: localPath,
    inputProps,
    imageFormat: 'jpeg',
    jpegQuality: 92,
  });

  await fsp.copyFile(localPath, artifactPath);
  console.log('✅ Explainer cover thumbnail rendered successfully!');
}

main().catch((err) => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});
