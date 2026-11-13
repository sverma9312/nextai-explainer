// NextAI Explainer — Core Type Definitions

export type NodeType =
  | 'client'
  | 'dns'
  | 'cdn'
  | 'gateway'
  | 'service'
  | 'cache'
  | 'queue'
  | 'db'
  | 'search'
  | 'storage';

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel: string;
  type: NodeType;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  icon: string;
  stepRevealed: number; // 1, 2, or 3
}

export interface ArchitectureEdge {
  id: string;
  from: string; // node id
  to: string; // node id
  protocol: string; // e.g. "gRPC", "HTTP/2", "WebSocket", "Kafka Topic", "Redis Lock"
  label: string;
  stepActive: number; // 1, 2, or 3
}

export interface ArchitectureStep {
  stepNumber: number; // 1, 2, or 3
  stepTitle: string; // e.g. "01 // INGESTION & H3 INDEX"
  narration: string;
  activeNodeIds: string[];
  activeEdgeIds: string[];
  calloutMetric: string; // e.g. "< 5ms In-Memory Spatial Query"
}

export type VisualArchetype =
  | 'spatial_matching'
  | 'cache_cluster'
  | 'event_streaming'
  | 'cdn_edge'
  | 'distributed_db'
  | 'payment_idempotency';

export interface StoryScenes {
  archetype: VisualArchetype;
  actors: {
    primary: 'person' | 'phone' | 'client';
    secondary: 'car' | 'tv' | 'phone' | 'card' | 'database';
    centerHub: string; // e.g. "Uber", "Netflix", "WhatsApp", "Stripe"
    brandColor?: string;
  };
  scene1: {
    badge: string;
    headline: string;
    narration: string;
  };
  scene2: {
    badge: string;
    headline: string;
    badMetric: string;
    whyItFails: string;
    narration: string;
  };
  scene3: {
    badge: string;
    headline: string;
    techLogo: 'redis' | 'kafka' | 'cassandra' | 'postgres' | 'envoy' | 'aws' | 'generic';
    techName: string;
    visualType: 'hex_grid' | 'key_value_table' | 'event_stream' | 'cache_ring' | 'cdn_cache';
    dataRows?: Array<{ key: string; val: string }>;
    narration: string;
  };
  scene4: {
    badge: string;
    headline: string;
    metricBadge: string;
    comparison?: {
      targetA: { label: string; before: string; after: string };
      targetB: { label: string; before: string; after: string };
    };
    narration: string;
  };
  scene5: {
    badge: string;
    headline: string;
    engineeringRule: string;
    narration: string;
  };
}

export interface ExplainerTopic {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  category: 'Distributed Systems' | 'High-Throughput Streaming' | 'FinTech & Payments' | 'Real-Time Messaging' | 'Cloud Storage';
  scaleMetric: string;
  problemStatement: string;
  tags: string[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  steps: ArchitectureStep[];
  takeaway: string;
  storyScenes?: StoryScenes;
}

export interface WordSubtitle {
  text: string;
  start: number; // seconds
  end: number; // seconds
}

export interface ExplainerScript {
  topicId: string;
  company: string;
  companyLogo: string;
  videoTitle: string;
  hook: string;
  scaleMetric: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  steps: ArchitectureStep[];
  takeaway: string;
  fullSpokenText: string;
  storyScenes?: StoryScenes;
}

export interface ExplainerCompositionProps extends Record<string, unknown> {
  script: ExplainerScript;
  audioSrc: string; // base64 data URI or public path
  subtitles: WordSubtitle[];
  durationInFrames: number;
  fps: number;
}

export interface PostedExplainerRecord {
  topicId: string;
  company: string;
  title: string;
  videoTitle: string;
  videoPath: string;
  audioPath: string;
  durationSeconds: number;
  postedAt: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}
