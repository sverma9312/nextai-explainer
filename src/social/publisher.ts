import { uploadToYouTubeShorts } from './youtube.js';
import { uploadToInstagramReels } from './instagram.js';
import type { SocialPublishRequest, AggregatePublishResult, PlatformPublishResult } from './types.js';

export interface PublishChannelOptions {
  skipYouTube?: boolean;
  skipInstagram?: boolean;
}

export async function publishToAllChannels(
  request: SocialPublishRequest,
  publicHostedVideoUrl?: string,
  options?: PublishChannelOptions
): Promise<AggregatePublishResult> {
  console.log('\n📣 [Social Publisher] Starting distribution across platforms...');

  // YouTube receives the 16:9 Landscape Video (standard YouTube video format)
  const ytPromise: Promise<PlatformPublishResult> = options?.skipYouTube
    ? Promise.resolve({
        platform: 'youtube' as const,
        success: true,
        skipped: true,
        error: 'Skipped (already published or not requested).',
      })
    : uploadToYouTubeShorts(request);

  // Instagram receives the 9:16 Portrait Reel Video
  const igRequest = request.reelVideoPath
    ? { ...request, videoPath: request.reelVideoPath }
    : request;

  const igPromise: Promise<PlatformPublishResult> = options?.skipInstagram
    ? Promise.resolve({
        platform: 'instagram' as const,
        success: true,
        skipped: true,
        error: 'Skipped (already published or not requested).',
      })
    : uploadToInstagramReels(igRequest, publicHostedVideoUrl);

  const [ytResult, igResult] = await Promise.all([ytPromise, igPromise]);

  return {
    youtube: ytResult,
    instagram: igResult,
  };
}
