import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { ExplainerCompositionProps } from '../schema/types.js';
import type { ExplainerPosterProps } from '../video/components/ExplainerPoster.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RenderOptions {
  inputProps: ExplainerCompositionProps;
  outputPath: string;
  compositionId?: 'ExplainerLandscape' | 'ExplainerReel';
  onProgress?: (progress: number) => void;
}

export interface RenderPosterOptions {
  inputProps: ExplainerPosterProps;
  outputPath: string;
  bundleLocation?: string;
}

export interface DualRenderResult {
  landscapePath: string;
  reelPath: string;
  coverPath?: string;
}

export async function renderPosterToDisk(options: RenderPosterOptions): Promise<string> {
  const { inputProps, outputPath } = options;
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });

  const entryPoint = path.resolve(__dirname, '../video/Root.tsx');
  const bundleLocation =
    options.bundleLocation ||
    (await bundle({
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
    }));

  console.log('🎨 Selecting composition "ExplainerPoster" for editorial cover...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerPoster',
    inputProps,
  });

  console.log(`🖼️ Rendering 1080x1920 Instagram Reel Cover to: ${outputPath}`);
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: outputPath,
    imageFormat: 'jpeg',
    jpegQuality: 92,
    inputProps,
  });

  console.log(`✅ Reel Cover Poster rendered successfully: ${outputPath}`);
  return outputPath;
}

export async function renderVideoToDisk(options: RenderOptions): Promise<string> {
  const { inputProps, outputPath, compositionId = 'ExplainerLandscape', onProgress } = options;

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

  console.log(`🎬 Selecting composition "${compositionId}"...`);
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
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
      return fallbackPath;
    }
    throw err;
  }

  return outputPath;
}

export async function renderDualAspectVideos(options: {
  inputProps: ExplainerCompositionProps;
  topicId: string;
  outDir?: string;
  coverOutputPath?: string;
  posterProps?: ExplainerPosterProps;
  onProgress?: (platform: string, progress: number) => void;
}): Promise<DualRenderResult> {
  const { inputProps, topicId, outDir = path.resolve(process.cwd(), 'out'), coverOutputPath, posterProps, onProgress } = options;
  await fsp.mkdir(outDir, { recursive: true });

  const entryPoint = path.resolve(__dirname, '../video/Root.tsx');
  console.log('📦 Bundling Remotion React composition (shared bundle for 16:9 Landscape & 9:16 Reel)...');

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

  const landscapePath = path.resolve(outDir, `${topicId}_landscape.mp4`);
  const defaultPath = path.resolve(outDir, `${topicId}.mp4`);
  const reelPath = path.resolve(outDir, `${topicId}_reel.mp4`);

  // 1. Render 16:9 Landscape (YouTube & Explainer Website)
  console.log('\n🎬 [1/2] Rendering 16:9 Landscape Video for YouTube & Website (1920x1080)...');
  const landscapeComp = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerLandscape',
    inputProps,
  });

  await renderMedia({
    composition: {
      ...landscapeComp,
      durationInFrames: inputProps.durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: landscapePath,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (onProgress) onProgress('landscape', pct);
    },
  });

  // Mirror landscapePath to defaultPath
  try {
    await fsp.copyFile(landscapePath, defaultPath);
  } catch (e) {}

  // 2. Render 9:16 Portrait Reel (Instagram Reels)
  console.log('\n🎬 [2/2] Rendering 9:16 Portrait Reel for Instagram (1080x1920)...');
  const reelComp = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ExplainerReel',
    inputProps,
  });

  await renderMedia({
    composition: {
      ...reelComp,
      durationInFrames: inputProps.durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: reelPath,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (onProgress) onProgress('reel', pct);
    },
  });

  // 3. Render 9:16 Editorial Cover Thumbnail (Instagram Reels)
  let coverPath: string | undefined;
  if (coverOutputPath && posterProps) {
    console.log('\n🎨 [3/3] Rendering 1080x1920 Instagram Reel Cover Poster...');
    try {
      const posterComp = await selectComposition({
        serveUrl: bundleLocation,
        id: 'ExplainerPoster',
        inputProps: posterProps,
      });

      await renderStill({
        composition: posterComp,
        serveUrl: bundleLocation,
        output: coverOutputPath,
        imageFormat: 'jpeg',
        jpegQuality: 92,
        inputProps: posterProps,
      });
      coverPath = coverOutputPath;
      console.log(`   📸 Reel Cover Poster: ${coverPath}\n`);
    } catch (coverErr: any) {
      console.warn(`⚠️ Cover thumbnail rendering failed: ${coverErr.message}`);
    }
  }

  console.log('\n✨ Dual Aspect Renders Complete:');
  console.log(`   🖥️ 16:9 Landscape: ${landscapePath}`);
  console.log(`   📱 9:16 Reel:      ${reelPath}`);
  if (coverPath) {
    console.log(`   🖼️ Cover Poster:   ${coverPath}`);
  }
  console.log('');

  return { landscapePath, reelPath, coverPath };
}
