import 'dotenv/config';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { selectTopicForVideo } from './catalog/selector.js';
import { generateExplainerScript } from './script/generator.js';
import { synthesizeVoiceover } from './audio/tts.js';
import { renderVideoToDisk } from './render/renderer.js';
import { recordPostedExplainer } from './catalog/archive.js';
import { publishToAllChannels } from './social/publisher.js';
import type { ExplainerCompositionProps } from './schema/types.js';

export async function runPipeline(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isForce = args.includes('--force');
  const isNoPublish = args.includes('--no-publish');
  const topicIdx = args.indexOf('--topic');
  const targetTopicId = topicIdx !== -1 && args[topicIdx + 1] ? args[topicIdx + 1] : undefined;

  console.log('====================================================');
  console.log('🧠 NextAI Explainer — Autonomous Architecture Studio');
  console.log(`   Mode: ${isDryRun ? 'DRY-RUN (No MP4 Render)' : 'FULL RENDER'}`);
  if (targetTopicId) {
    console.log(`   Target Topic ID: ${targetTopicId}`);
  }
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log('====================================================\n');

  // Step 1: Select topic
  console.log('📚 [1/5] Selecting system design topic from catalog...');
  const topic = await selectTopicForVideo({ force: isForce, topicId: targetTopicId });
  console.log(`   Selected: "${topic.title}" [${topic.company}]`);
  console.log(`   Scale:    ${topic.scaleMetric}\n`);

  // Step 2: Generate technical script via Gemini
  console.log('🤖 [2/5] Synthesizing architectural breakdown via Gemini...');
  const script = await generateExplainerScript(topic);
  console.log(`   Title:   "${script.videoTitle}"`);
  console.log(`   Hook:    "${script.hook}"`);
  console.log(`   Words:   ${script.fullSpokenText.split(/\s+/).length} words\n`);

  // Step 3: Synthesize voiceover & subtitles via Chunked Edge-TTS
  const buildDir = path.resolve(process.cwd(), 'build');
  const outAudioPath = path.resolve(buildDir, `${topic.id}_audio.mp3`);

  console.log('🎙️ [3/5] Generating neural voiceover & word timestamps (Chunked Edge-TTS)...');
  const scriptChunks = [
    script.hook,
    ...script.steps.map((s) => s.narration),
    script.takeaway,
  ].filter(Boolean);

  console.log('--- SCRIPT CHUNKS ---');
  scriptChunks.forEach((c, i) => console.log(`   [Chunk ${i + 1}] (${c.length} chars): "${c}"`));
  console.log('');

  const ttsResult = await synthesizeVoiceover(scriptChunks, outAudioPath);
  console.log(`   Duration: ${ttsResult.durationSeconds}s`);
  console.log(`   Words:    ${ttsResult.subtitles.length} timestamped tokens captured\n`);

  const fps = 30;
  const durationInFrames = Math.ceil(ttsResult.durationSeconds * fps);

  // Encode audio as base64 data URI for headless Chromium bundler
  const audioBuffer = await fsp.readFile(ttsResult.audioPath);
  const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

  const inputProps: ExplainerCompositionProps = {
    script,
    audioSrc: audioDataUri,
    subtitles: ttsResult.subtitles,
    durationInFrames,
    fps,
  };

  if (isDryRun) {
    console.log('✨ [Dry-Run Complete] Script & audio generated without rendering video.');
    return;
  }

  // Step 4: Render MP4 via Remotion
  const outDir = path.resolve(process.cwd(), 'out');
  let outVideoPath = path.resolve(outDir, `${topic.id}.mp4`);

  // Check if target file is locked by a media player or other process
  try {
    const handle = await fsp.open(outVideoPath, 'r+');
    await handle.close();
  } catch (err: any) {
    if (err && (err.code === 'EBUSY' || err.code === 'EPERM')) {
      outVideoPath = path.resolve(outDir, `${topic.id}_latest.mp4`);
      console.warn(`⚠️ Target video file is open in an external application. Rendering to: ${outVideoPath}`);
    }
  }

  console.log('🎬 [4/5] Rendering 1080x1920 30FPS MP4 via Remotion headless engine...');
  let lastPct = 0;
  await renderVideoToDisk({
    inputProps,
    outputPath: outVideoPath,
    onProgress: (pct) => {
      if (pct >= lastPct + 10 || pct === 100) {
        console.log(`   Rendering Progress: ${pct}%`);
        lastPct = pct;
      }
    },
  });

  // Step 5: Multi-Platform Publishing (YouTube Shorts & Instagram Reels)
  if (isNoPublish) {
    console.log('⏩ [5/5] Skipping social distribution (--no-publish passed).');
    console.log('\n====================================================');
    console.log('🎉 Explainer Video Rendered Successfully!');
    console.log(`   MP4 Video: ${outVideoPath}`);
    console.log(`   Title:     ${script.videoTitle}`);
    console.log('====================================================\n');
    return;
  }

  console.log('🚀 [5/5] Multi-platform social publishing...');
  const publishRequest = {
    videoPath: outVideoPath,
    title: script.videoTitle,
    topic: topic.title,
    description: `🧠 System Design: ${topic.title}
🏢 Company: ${topic.company}
⚡ Scale: ${topic.scaleMetric}

${script.hook}

${script.steps.map((s) => `• ${s.stepTitle}: ${s.narration}`).join('\n\n')}

📌 Key Takeaway:
${script.takeaway}

🌐 Interactive Architecture Diagram:
👉 https://explainer.nextai-apps.com/

#SystemDesign #SoftwareArchitecture #${topic.company.replace(/\s+/g, '')} #DistributedSystems #Engineering #TechExplained #Shorts`,
    tags: ['System Design', 'Software Architecture', topic.company, 'Distributed Systems', 'Engineering', 'Coding'],
  };

  const publishResults = await publishToAllChannels(publishRequest);

  // Record published episode in ledger only if published to at least one channel
  if (publishResults.youtube?.publishedUrl || publishResults.instagram?.publishedUrl) {
    await recordPostedExplainer({
      topicId: topic.id,
      company: topic.company,
      title: topic.title,
      videoTitle: script.videoTitle,
      videoPath: outVideoPath,
      audioPath: ttsResult.audioPath,
      durationSeconds: ttsResult.durationSeconds,
      postedAt: new Date().toISOString(),
      youtubeUrl: publishResults.youtube?.publishedUrl,
      instagramUrl: publishResults.instagram?.publishedUrl,
    });
  } else {
    console.log('ℹ️ Social publishing was skipped (ENABLE_*=false). Video rendered to disk without updating archive ledger.');
  }

  console.log('\n====================================================');
  console.log('🎉 Explainer Video Pipeline Completed Successfully!');
  console.log(`   Topic:     ${topic.title}`);
  if (publishResults.youtube?.publishedUrl) {
    console.log(`   YouTube:   ${publishResults.youtube.publishedUrl}`);
  }
  if (publishResults.instagram?.publishedUrl) {
    console.log(`   Instagram: ${publishResults.instagram.publishedUrl}`);
  }
  console.log('====================================================\n');
}

runPipeline().catch((err) => {
  console.error('\n❌ Pipeline execution failed:', err);
  process.exit(1);
});

