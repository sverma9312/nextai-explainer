import fs from 'node:fs';
import path from 'node:path';
import { TOPICS } from './topics.js';
import { getExplainerArchive } from './archive.js';
import { synthesizeDynamicTopic } from './dynamic.js';
import type { ExplainerTopic } from '../schema/types.js';

export interface TopicSelectionOptions {
  force?: boolean;
  topicId?: string;
}

function getCustomTopics(): ExplainerTopic[] {
  try {
    const customFilePath = path.resolve(process.cwd(), 'data/custom_topics.json');
    if (fs.existsSync(customFilePath)) {
      return JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not read custom_topics.json:', err);
  }
  return [];
}

export async function selectTopicForVideo(options: TopicSelectionOptions = {}): Promise<ExplainerTopic> {
  const allKnownTopics = [...TOPICS, ...getCustomTopics()];

  // If specific topic requested:
  if (options.topicId) {
    const cleanId = options.topicId.trim();
    const match = allKnownTopics.find(
      (t) => t.id === cleanId || t.title.toLowerCase().includes(cleanId.toLowerCase())
    );
    if (match) {
      console.log(`📌 Selected existing topic from catalog: "${match.title}" (ID: ${match.id})`);
      return match;
    }

    // If not found in static or existing custom topics, synthesize dynamic topic using Gemini AI!
    console.log(`💡 Topic "${options.topicId}" not in catalog. Synthesizing new architecture breakdown via Gemini...`);
    try {
      const dynamicTopic = await synthesizeDynamicTopic(options.topicId);
      return dynamicTopic;
    } catch (err: any) {
      console.warn(`⚠️ Dynamic topic synthesis failed: ${err.message}. Falling back to unposted topic.`);
    }
  }

  const archive = await getExplainerArchive();
  const postedIds = new Set(archive.map((r) => r.topicId));

  // Find unposted topics from static catalog first
  let candidates = TOPICS.filter((t) => !postedIds.has(t.id));

  if (candidates.length === 0) {
    // Check if any custom topics are unposted
    const customUnposted = getCustomTopics().filter((t) => !postedIds.has(t.id));
    if (customUnposted.length > 0) {
      return customUnposted[0];
    }

    if (options.force) {
      console.warn('⚠️ All topics have been posted. Force-cycling to first topic.');
      candidates = [TOPICS[0]];
    } else {
      throw new Error(`All ${TOPICS.length} topics have already been posted! Pass --force to cycle again or add new topics in src/catalog/topics.ts.`);
    }
  }

  return candidates[0];
}
