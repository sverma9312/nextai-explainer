import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';
import type { ExplainerTopic, ArchitectureNode, ArchitectureEdge, ArchitectureStep } from '../schema/types.js';

/**
 * Dynamically synthesizes a complete ExplainerTopic from a freeform user/community prompt.
 * Enables the owner to take any idea from the website wishlist and generate a full architecture breakdown.
 */
export async function synthesizeDynamicTopic(promptOrTitle: string): Promise<ExplainerTopic> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required to synthesize dynamic architecture topics.');
  }

  console.log(`🤖 [Gemini Synthesis] Researching & synthesizing architecture breakdown for: "${promptOrTitle}"...`);

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `You are a Principal Distributed Systems Architect and viral visual technical explainer.
Given a software architecture or system design topic/prompt, generate a rich, accurate, production-grade ExplainerTopic definition in JSON.

The system MUST contain:
1. "id": A clean kebab-case slug (e.g. "linkedin-kafka-7t-messages", "zoom-webrtc-sfu")
2. "company": Company name (e.g. "LinkedIn", "Zoom", "Amazon")
3. "companyLogo": A single relevant emoji (e.g. "⚡", "📹", "🛒")
4. "title": Crisp headline starting with "How [Company]..." or "Why [Company]..." (e.g. "How LinkedIn Streams 7 Trillion Messages Daily")
5. "category": Must be one of: "Distributed Systems", "High-Throughput Streaming", "FinTech & Payments", "Real-Time Messaging", "Cloud Storage"
6. "scaleMetric": Production scale metric (e.g. "7 Trillion Msgs/Day // 5ms P99", "1,000+ Video Streams // <150ms")
7. "problemStatement": The core engineering bottleneck before this architecture was built (1-2 sentences)
8. "tags": 3-4 hashtags (e.g. ["#Kafka", "#DistributedLog", "#LinkedIn"])
9. "nodes": Array of 5 to 7 architecture nodes positioned on a 100x100 grid (x: 10 to 90, y: 15 to 85)
   - node types: "client" | "dns" | "cdn" | "gateway" | "service" | "cache" | "queue" | "db" | "storage"
   - stepRevealed: 1, 2, or 3
10. "edges": Array of 4 to 6 directional connections between node IDs with protocols (e.g. "gRPC", "Kafka Topic", "WebSocket")
11. "steps": Exactly 3 chronological architectural steps:
    - stepNumber: 1, 2, 3
    - stepTitle: e.g. "01 // DISTRIBUTED COMMIT LOG"
    - narration: 2 sentences explaining the technical solution
    - activeNodeIds: IDs of active nodes
    - activeEdgeIds: IDs of active edges
    - calloutMetric: e.g. "< 5ms Sequential Disk Write"
12. "takeaway": One punchy sentence summarizing the fundamental computer science / system design lesson.

Return ONLY valid JSON without code fences or extra text.`;

  const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  let response: any = null;
  let lastError: any = null;

  for (let attempt = 0; attempt < 3 && !response; attempt++) {
    for (const model of candidateModels) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [{ text: `Topic / Request: ${promptOrTitle}` }],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });
        if (res.text) {
          response = res;
          console.log(`   [Gemini Synthesis] Successfully generated with ${model} (attempt ${attempt + 1})`);
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }
    if (!response && attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  if (!response) {
    throw lastError || new Error('Empty Gemini response during dynamic topic synthesis');
  }

  const rawJson = response.text || '{}';
  const parsed = JSON.parse(rawJson) as ExplainerTopic;

  // Sanitize and ensure proper defaults
  if (!parsed.id) {
    parsed.id = promptOrTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Save to custom topics directory so it's persisted
  try {
    const customDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(customDir)) {
      fs.mkdirSync(customDir, { recursive: true });
    }
    const customFilePath = path.resolve(customDir, 'custom_topics.json');
    let existingList: ExplainerTopic[] = [];
    if (fs.existsSync(customFilePath)) {
      existingList = JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
    }
    const filtered = existingList.filter((t) => t.id !== parsed.id);
    filtered.push(parsed);
    fs.writeFileSync(customFilePath, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`💾 Saved synthesized architecture topic "${parsed.title}" to data/custom_topics.json`);
  } catch (err) {
    console.warn('Could not write custom_topics.json:', err);
  }

  return parsed;
}
