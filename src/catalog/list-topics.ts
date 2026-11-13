import { TOPICS } from './topics.js';
import { getExplainerArchive } from './archive.js';

async function main() {
  const archive = await getExplainerArchive();
  const postedSet = new Set(archive.map((r) => r.topicId));

  console.log('====================================================');
  console.log('📚 NextAI Explainer — System Design Topics Catalog');
  console.log(`   Total Topics:   ${TOPICS.length}`);
  console.log(`   Published:      ${archive.length}`);
  console.log('====================================================\n');

  TOPICS.forEach((t, idx) => {
    const isPosted = postedSet.has(t.id);
    const status = isPosted ? '✅ [PUBLISHED]' : '⏳ [QUEUED]';
    console.log(`${idx + 1}. ${status} ${t.company} — ${t.title}`);
    console.log(`   ID:     ${t.id}`);
    console.log(`   Scale:  ${t.scaleMetric}`);
    console.log(`   Nodes:  ${t.nodes.length} nodes, ${t.edges.length} edges\n`);
  });
}

main().catch(console.error);

