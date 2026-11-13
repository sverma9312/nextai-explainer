import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { ExplainerCompositionProps } from '../schema/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RenderOptions {
  inputProps: ExplainerCompositionProps;
  outputPath: string;
  onProgress?: (progress: number) => void;
}

export async function renderVideoToDisk(options: RenderOptions): Promise<string> {
  const { inputProps, outputPath, onProgress } = options;

  await fsp.mkdir(path.dirname(outputPath), { recursive: true });

  const entryPoint = path.resolve(__dirname, '../video/Root.tsx');

  console.log('📦 Bundling Remotion React composition...');
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

  console.log('🎬 Selecting composition "ExplainerReel"...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerReel',
    inputProps,
  });

  console.log(`🎥 Rendering MP4 (${composition.width}x${composition.height} @ ${composition.fps}fps, ${inputProps.durationInFrames} frames)...`);

  try {
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames: inputProps.durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      onProgress: ({ progress }) => {
        const pct = Math.round(progress * 100);
        if (onProgress) onProgress(pct);
      },
    });
  } catch (err: any) {
    if (err && (err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'EACCES') && err.path) {
      const fallbackPath = outputPath.replace(/\.mp4$/, `_latest.mp4`);
      console.warn(`\n⚠️ Destination file "${outputPath}" is locked by another application (e.g. VLC).`);
      console.log(`   Saving output to: ${fallbackPath}`);
      await fsp.copyFile(err.path, fallbackPath);
      try {
        await fsp.unlink(err.path);
      } catch {}
      console.log(`✅ Explainer MP4 saved successfully: ${fallbackPath}`);
      return fallbackPath;
    }
    throw err;
  }

  console.log(`✅ Explainer MP4 rendered successfully: ${outputPath}`);
  return outputPath;
}

