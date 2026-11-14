import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PostedExplainerRecord } from '../schema/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARCHIVE_FILE = path.resolve(__dirname, '../../data/explainer_archive.json');

export async function getExplainerArchive(): Promise<PostedExplainerRecord[]> {
  try {
    const raw = await fs.readFile(ARCHIVE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(ARCHIVE_FILE), { recursive: true });
      await fs.writeFile(ARCHIVE_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    throw err;
  }
}

export async function isTopicPosted(topicId: string): Promise<boolean> {
  const archive = await getExplainerArchive();
  return archive.some((record) => record.topicId === topicId);
}

export async function recordPostedExplainer(record: PostedExplainerRecord): Promise<void> {
  const archive = await getExplainerArchive();
  const existingIdx = archive.findIndex((r) => r.topicId === record.topicId);
  if (existingIdx !== -1) {
    archive[existingIdx] = {
      ...archive[existingIdx],
      ...record,
      youtubeUrl: record.youtubeUrl || archive[existingIdx].youtubeUrl,
      instagramUrl: record.instagramUrl || archive[existingIdx].instagramUrl,
    };
  } else {
    archive.unshift(record); // Prepend so newest is always index 0
  }
  await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2), 'utf-8');
}

