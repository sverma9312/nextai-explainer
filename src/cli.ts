import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { selectTopicForVideo } from './catalog/selector.js';
import { generateExplainerScript } from './script/generator.js';
import { synthesizeVoiceover } from './audio/tts.js';
import { renderVideoToDisk, renderDualAspectVideos } from './render/renderer.js';
import { getExplainerArchive, recordPostedExplainer } from './catalog/archive.js';
import { publishToAllChannels } from './social/publisher.js';
import type { ExplainerCompositionProps } from './schema/types.js';

export async function runPipeline(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || process.env.DRY_RUN === 'true';
  const isForce = args.includes('--force') || process.env.FORCE_RUN === 'true';
  const isNoPublish = args.includes('--no-publish');
  const isRetryLast = args.includes('--retry-last') || process.env.RETRY_LAST === 'true';
  const topicIdx = args.indexOf('--topic');
  let targetTopicId = topicIdx !== -1 && args[topicIdx + 1] ? args[topicIdx + 1] : undefined;
  if (!targetTopicId && process.env.TOPIC_ID) {
    targetTopicId = process.env.TOPIC_ID.trim();
  }

  console.log('====================================================');
  console.log('🧠 NextAI Explainer — Autonomous Architecture Studio');
  console.log(`   Mode: ${isRetryLast ? 'RETRY LAST EXPLAINER' : isDryRun ? 'DRY-RUN (No MP4 Render)' : 'FULL RENDER'}`);
  if (targetTopicId) {
    console.log(`   Target Topic ID: ${targetTopicId}`);
  }
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log('====================================================\n');

  // --- RETRY LAST EXPLAINER MODE ---
  if (isRetryLast) {
    console.log('🔄 [Retry Mode] Checking explainer archive ledger...');
    const archive = await getExplainerArchive();

    let targetRecord = targetTopicId
      ? archive.find((r) => r.topicId === targetTopicId)
      : archive[0];

    // If not found in archive, check if topic exists in TOPICS catalog!
    if (!targetRecord && targetTopicId) {
      const { TOPICS } = await import('./catalog/topics.js');
      const catTopic = TOPICS.find((t) => t.id === targetTopicId);
      if (catTopic) {
        targetRecord = {
          topicId: catTopic.id,
          company: catTopic.company,
          title: catTopic.title,
          videoTitle: `${catTopic.title} #Shorts`,
          videoPath: path.resolve(process.cwd(), 'out', `${catTopic.id}.mp4`),
          audioPath: path.resolve(process.cwd(), 'build', `${catTopic.id}_audio.mp3`),
          durationSeconds: 0,
          postedAt: new Date().toISOString(),
        };
      }
    }

    if (!targetRecord) {
      if (archive.length === 0) {
        const { TOPICS } = await import('./catalog/topics.js');
        const firstTopic = TOPICS[0];
        targetRecord = {
          topicId: firstTopic.id,
          company: firstTopic.company,
          title: firstTopic.title,
          videoTitle: `${firstTopic.title} #Shorts`,
          videoPath: path.resolve(process.cwd(), 'out', `${firstTopic.id}.mp4`),
          audioPath: path.resolve(process.cwd(), 'build', `${firstTopic.id}_audio.mp3`),
          durationSeconds: 0,
          postedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(`Target topic ID "${targetTopicId}" not found in explainer archive ledger.`);
      }
    }

    console.log(`   Target Topic: "${targetRecord.title}" [${targetRecord.company}] (ID: ${targetRecord.topicId})`);
    console.log(`   YouTube URL:   ${targetRecord.youtubeUrl || 'NOT PUBLISHED'}`);
    console.log(`   Instagram URL: ${targetRecord.instagramUrl || 'NOT PUBLISHED'}\n`);

    const isPublishYouTube = process.env.ENABLE_YOUTUBE_PUBLISH === 'true' && !isNoPublish;
    const isPublishInstagram = process.env.ENABLE_INSTAGRAM_PUBLISH === 'true' && !isNoPublish;

    const needYouTube = isPublishYouTube && (!targetRecord.youtubeUrl || isForce);
    const needInstagram = isPublishInstagram && (!targetRecord.instagramUrl || isForce);

    if (isPublishYouTube && targetRecord.youtubeUrl && !isForce) {
      console.log(`ℹ️ [YouTube] Already published at ${targetRecord.youtubeUrl}. Skipping (pass force=true to override).`);
    }
    if (isPublishInstagram && targetRecord.instagramUrl && !isForce) {
      console.log(`ℹ️ [Instagram] Already published at ${targetRecord.instagramUrl}. Skipping (pass force=true to override).`);
    }

    if (!needYouTube && !needInstagram) {
      console.log('\n✨ [Retry Complete] All requested platforms are already published for this topic.');
      console.log('   Nothing to retry. Exiting safely without re-rendering.');
      return;
    }

    // Check if MP4 already exists on disk
    let videoPathToPublish: string | null = null;
    const defaultOutPath = path.resolve(process.cwd(), 'out', `${targetRecord.topicId}.mp4`);
    const webOutPath = path.resolve(process.cwd(), 'web/videos', `${targetRecord.topicId}.mp4`);
    if (fs.existsSync(defaultOutPath)) {
      videoPathToPublish = defaultOutPath;
    } else if (fs.existsSync(webOutPath)) {
      videoPathToPublish = webOutPath;
    } else if (targetRecord.videoPath && fs.existsSync(targetRecord.videoPath)) {
      videoPathToPublish = targetRecord.videoPath;
    }

    const topic = await selectTopicForVideo({ force: true, topicId: targetRecord.topicId });
    const script = await generateExplainerScript(topic);

    if (videoPathToPublish) {
      console.log(`🎬 Found existing rendered video on disk: ${videoPathToPublish}`);
      console.log('   Skipping Remotion video rendering (instant dispatch)!\n');
    } else {
      console.log(`⚠️ Video file not found at out/${targetRecord.topicId}.mp4. Re-rendering video...`);
      const buildDir = path.resolve(process.cwd(), 'build');
      const outAudioPath = path.resolve(buildDir, `${topic.id}_audio.mp3`);
      const scriptChunks = [
        script.hook,
        ...script.steps.map((s) => s.narration),
        script.takeaway,
      ].filter(Boolean);

      const ttsResult = await synthesizeVoiceover(scriptChunks, outAudioPath);
      const fps = 30;
      const durationInFrames = Math.ceil(ttsResult.durationSeconds * fps);
      const audioBuffer = await fsp.readFile(ttsResult.audioPath);
      const audioDataUri = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

      const inputProps: ExplainerCompositionProps = {
        script,
        audioSrc: audioDataUri,
        subtitles: ttsResult.subtitles,
        durationInFrames,
        fps,
      };

      const outDir = path.resolve(process.cwd(), 'out');
      await fsp.mkdir(outDir, { recursive: true });
      videoPathToPublish = path.resolve(outDir, `${topic.id}.mp4`);
      await renderVideoToDisk({
        inputProps,
        outputPath: videoPathToPublish,
      });
    }

    console.log('🚀 Distributing missing platform(s)...');
    const publishRequest = {
      videoPath: videoPathToPublish,
      title: targetRecord.videoTitle || script.videoTitle,
      topic: topic.title,
      description: `🏗️ Architecture Deep Dive: ${topic.title}
⚡ Production Scale: ${topic.scaleMetric}
🏢 Core Engine & Stack: ${topic.company}

⚙️ The Engineering Challenge:
${script.hook}

📐 Architectural Blueprint:
${script.steps.map((s, idx) => `0${idx + 1}. ${s.stepTitle}\n${s.narration}`).join('\n\n')}

💡 Key Architectural Takeaway:
${script.takeaway}

🌐 Interactive Architecture Diagrams & Case Studies:
👉 https://explainer.nextai-apps.com/

#SystemDesign #SoftwareArchitecture #${topic.company.replace(/\s+/g, '')} #DistributedSystems #HighConcurrency #BackendEngineering #DevCommunity #Shorts`,
      tags: ['System Design', 'Software Architecture', topic.company, 'Distributed Systems', 'High Concurrency', 'Backend Engineering'],
    };

    const publishResults = await publishToAllChannels(
      publishRequest,
      undefined,
      {
        skipYouTube: !needYouTube,
        skipInstagram: !needInstagram,
      }
    );

    const finalYt = publishResults.youtube?.publishedUrl || targetRecord.youtubeUrl;
    const finalIg =
      publishResults.instagram?.publishedUrl ||
      (publishResults.instagram?.id ? `https://instagram.com/reel/${publishResults.instagram.id}` : undefined) ||
      targetRecord.instagramUrl;

    await recordPostedExplainer({
      ...targetRecord,
      videoPath: videoPathToPublish,
      youtubeUrl: finalYt,
      instagramUrl: finalIg,
      postedAt: new Date().toISOString(),
    });

    console.log('\n====================================================');
    console.log('🎉 Retry Social Distribution Completed!');
    console.log(`   Topic:     "${targetRecord.title}"`);
    console.log(`   Video:     ${videoPathToPublish}`);
    if (publishResults.youtube?.publishedUrl) {
      console.log(`   YouTube:   PUBLISHED -> ${publishResults.youtube.publishedUrl}`);
    } else if (publishResults.youtube?.skipped) {
      console.log(`   YouTube:   SKIPPED (${publishResults.youtube.error || 'Already published or paused'})`);
    } else if (publishResults.youtube?.error) {
      console.log(`   YouTube:   FAILED (${publishResults.youtube.error})`);
    }

    if (publishResults.instagram?.publishedUrl) {
      console.log(`   Instagram: PUBLISHED -> ${publishResults.instagram.publishedUrl}`);
    } else if (publishResults.instagram?.id) {
      console.log(`   Instagram: PUBLISHED -> Reel ID ${publishResults.instagram.id}`);
    } else if (publishResults.instagram?.skipped) {
      console.log(`   Instagram: SKIPPED (${publishResults.instagram.error || 'Already published or paused'})`);
    } else if (publishResults.instagram?.error) {
      console.log(`   Instagram: FAILED (${publishResults.instagram.error})`);
    }
    console.log('====================================================\n');
    return;
  }

  // --- STANDARD NEW TOPIC PIPELINE ---

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

  console.log('🎬 [4/5] Rendering Dual Aspect MP4s (16:9 Landscape for YouTube/Web & 9:16 Reel for Instagram)...');
  let lastPct = 0;
  const dualResult = await renderDualAspectVideos({
    inputProps,
    topicId: topic.id,
    outDir,
    onProgress: (platform, pct) => {
      if (pct >= lastPct + 25 || pct === 100) {
        console.log(`   [${platform.toUpperCase()}] Progress: ${pct}%`);
        lastPct = pct;
      }
    },
  });

  outVideoPath = dualResult.landscapePath;

  // Mirror 16:9 Landscape video to web/videos so website serves full widescreen video
  try {
    const webVideoDir = path.resolve(process.cwd(), 'web/videos');
    await fsp.mkdir(webVideoDir, { recursive: true });
    await fsp.copyFile(dualResult.landscapePath, path.resolve(webVideoDir, `${topic.id}.mp4`));
  } catch (webErr) {
    console.warn('Could not mirror landscape video to web/videos:', webErr);
  }

  // Step 5: Multi-Platform Publishing (YouTube Landscape & Instagram Reels)
  if (isNoPublish) {
    console.log('⏩ [5/5] Skipping social distribution (--no-publish passed).');
    console.log('\n====================================================');
    console.log('🎉 Dual Aspect Explainer Videos Rendered Successfully!');
    console.log(`   🖥️ 16:9 Landscape (YouTube/Web): ${dualResult.landscapePath}`);
    console.log(`   📱 9:16 Reel (Instagram):         ${dualResult.reelPath}`);
    console.log(`   Title: ${script.videoTitle}`);
    console.log('====================================================\n');
    return;
  }

  console.log('🚀 [5/5] Multi-platform social publishing...');
  const publishRequest = {
    videoPath: dualResult.landscapePath, // 16:9 Landscape for standard YouTube video
    reelVideoPath: dualResult.reelPath,  // 9:16 Portrait for Instagram Reels
    title: script.videoTitle.replace(/#Shorts/gi, '').trim(),
    topic: topic.title,
    description: `🏗️ Architecture Deep Dive: ${topic.title}
⚡ Production Scale: ${topic.scaleMetric}
🏢 Core Engine & Stack: ${topic.company}

⚙️ The Engineering Challenge:
${script.hook}

📐 Architectural Blueprint:
${script.steps.map((s, idx) => `0${idx + 1}. ${s.stepTitle}\n${s.narration}`).join('\n\n')}

💡 Key Architectural Takeaway:
${script.takeaway}

🌐 Interactive Architecture Diagrams & Case Studies:
👉 https://explainer.nextai-apps.com/

#SystemDesign #SoftwareArchitecture #${topic.company.replace(/\s+/g, '')} #DistributedSystems #HighConcurrency #BackendEngineering #DevCommunity`,
    tags: ['System Design', 'Software Architecture', topic.company, 'Distributed Systems', 'High Concurrency', 'Backend Engineering'],
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

