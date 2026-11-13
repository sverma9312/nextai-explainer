import { TOPICS } from './topics.js';
import { getExplainerArchive } from './archive.js';
import type { ExplainerTopic } from '../schema/types.js';

export interface TopicSelectionOptions {
  force?: boolean;
  topicId?: string;
}

export async function selectTopicForVideo(options: TopicSelectionOptions = {}): Promise<ExplainerTopic> {
  // If specific topic requested, return it directly
  if (options.topicId) {
    const match = TOPICS.find((t) => t.id === options.topicId);
    if (match) {
      return match;
    }
    console.warn(`⚠️ Requested topic ID "${options.topicId}" not found. Falling back to sequential unposted topic.`);
  }

  const archive = await getExplainerArchive();
  const postedIds = new Set(archive.map((r) => r.topicId));

  // Find unposted topics
  let candidates = TOPICS.filter((t) => !postedIds.has(t.id));

  if (candidates.length === 0) {
    if (options.force) {
      console.warn('⚠️ All topics have been posted. Force-cycling to first topic.');
      candidates = [TOPICS[0]];
    } else {
      throw new Error(`All ${TOPICS.length} topics have already been posted! Pass --force to cycle again or add new topics in src/catalog/topics.ts.`);
    }
  }

  return candidates[0];
}

