export interface SocialPublishRequest {
  videoPath: string; // Primary video (16:9 Landscape for YouTube & Web)
  reelVideoPath?: string; // Secondary video (9:16 Portrait for Instagram Reels)
  title: string;
  description: string;
  tags: string[];
  topic: string;
  sourceName?: string;
}

export interface PlatformPublishResult {
  platform: 'youtube' | 'instagram';
  success: boolean;
  publishedUrl?: string;
  id?: string;
  skipped?: boolean;
  error?: string;
}

export interface AggregatePublishResult {
  youtube?: PlatformPublishResult;
  instagram?: PlatformPublishResult;
}
