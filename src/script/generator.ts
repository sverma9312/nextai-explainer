import { GoogleGenAI } from '@google/genai';
import type { ExplainerTopic, ExplainerScript, VisualEntity } from '../schema/types.js';
import { resolveEntitiesIcons, resolveIconSvg } from '../icons/resolver.js';

function getDefaultVisualEntities(topic: ExplainerTopic): VisualEntity[] {
  const isUber = topic.id.includes('uber') || topic.company.toLowerCase().includes('uber');
  if (isUber) {
    return [
      { id: 'client', label: 'Rider App', iconQuery: 'person user mobile', role: 'actor' },
      { id: 'gateway', label: 'Edge Gateway', iconQuery: 'network gateway shield proxy', role: 'gateway' },
      { id: 'redis', label: 'Redis Spatial Cache', iconQuery: 'redis', role: 'cache' },
      { id: 'driver', label: 'Driver Vehicle', iconQuery: 'car vehicle', role: 'actor' },
      { id: 'db', label: 'Cassandra DocStore', iconQuery: 'database cassandra storage', role: 'database' },
    ];
  }

  // Derive entities from topic nodes if available
  if (topic.nodes && topic.nodes.length > 0) {
    return topic.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      iconQuery: `${n.label} ${n.type}`.toLowerCase(),
      role: (n.type === 'client' ? 'actor' : n.type === 'cache' ? 'cache' : n.type === 'db' ? 'database' : 'service') as any,
    }));
  }

  return [
    { id: 'client', label: 'Client', iconQuery: 'user person', role: 'actor' },
    { id: 'service', label: 'Backend Service', iconQuery: 'server cloud', role: 'service' },
    { id: 'cache', label: 'Cache Cluster', iconQuery: 'redis cache', role: 'cache' },
    { id: 'db', label: 'Database', iconQuery: 'database storage', role: 'database' },
  ];
}

export async function generateExplainerScript(topic: ExplainerTopic): Promise<ExplainerScript> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini key, synthesize high-density fallback directly from curated topic
  if (!apiKey) {
    console.warn('⚠️ No GEMINI_API_KEY detected. Using curated production script.');
    return buildFallbackScript(topic);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a Principal Distributed Systems Architect and viral technical video creator for NextAI Explainer.
Your task is to take a software architecture case study and generate an ultra-crisp, authoritative, 55-to-60-second vertical video script.

Follow this 5-scene narrative arc:
1. Hook & Setup: State the high-stakes scale and problem (e.g. How does Uber match 1 million active drivers in under 100 milliseconds?).
2. The Naive Bottleneck: Explain why the obvious approach (calculating distance to every single vehicle) crashes CPU and lags.
3. The Breakthrough: The spatial/in-memory data structure (e.g. Earth divided into H3 hexagonal cells stored in Redis in-memory clusters).
4. Smart Search & Resolution: How candidate lookups query only immediate neighbor cells to lock the best ETA in microseconds.
5. Golden Engineering Rule: 1 punchy architectural takeaway principle.

Visual Entities:
Identify 3 to 5 core architectural actors/components mentioned in this system (e.g. redis, car, client, gateway, database, kafka).
For each, provide a search query keyword to fetch its official vector icon.

Stage Archetype:
Choose the best visual stage layout:
- "spatial" for geolocation/grid/neighbor lookups (Uber, Lyft, DoorDash).
- "pipeline" for streaming/event architectures (Kafka, Flink, EventBridge).
- "ring" for consistent hashing / peer-to-peer rings (Dynamo, Cassandra, Ringpop).
- "edge" for CDN, gateway, and multi-region routing (Cloudflare, Envoy).

Rules:
- Pacing: Clean, energetic, high technical clarity, zero fluff, zero introductory greetings.
- Total spoken words must be strictly between 125 and 140 words (approx 54-58 seconds of natural speech).

Return ONLY valid JSON with this exact schema:
{
  "videoTitle": "Short YouTube Shorts title ending with #Shorts (max 60 chars)",
  "hook": "Opening hook introducing problem and scale (approx 24-28 words)",
  "step1Narration": "The obvious approach and why it fails under scale (approx 24-28 words)",
  "step2Narration": "The spatial indexing and Redis in-memory storage breakthrough (approx 30-35 words)",
  "step3Narration": "Neighbor cell lookup, ETA evaluation, and atomic state match (approx 24-28 words)",
  "takeaway": "Closing engineering rule (approx 16-20 words)",
  "stageArchetype": "spatial",
  "visualEntities": [
    { "id": "client", "label": "Rider", "iconQuery": "mobile person user", "role": "actor" },
    { "id": "gateway", "label": "Edge Gateway", "iconQuery": "api gateway proxy envoy", "role": "gateway" },
    { "id": "redis", "label": "Redis Spatial Cache", "iconQuery": "redis", "role": "cache" },
    { "id": "driver", "label": "Driver Vehicle", "iconQuery": "car vehicle", "role": "actor" },
    { "id": "db", "label": "Cassandra DB", "iconQuery": "database storage cassandra", "role": "database" }
  ]
}`;

    const userPrompt = `Topic: ${topic.title}
Company: ${topic.company}
Scale: ${topic.scaleMetric}
Problem: ${topic.problemStatement}
Key Tech: ${topic.tags.join(', ')}
Takeaway: ${topic.takeaway}`;

    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    let response: any = null;
    let lastError: any = null;

    for (let attempt = 0; attempt < 3 && !response; attempt++) {
      for (const model of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [
              { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });
          if (response && response.text) {
            console.log(`   [Gemini] Successfully generated with ${model} (attempt ${attempt + 1})`);
            break;
          }
        } catch (err: any) {
          lastError = err;
        }
      }
      if (!response && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Empty Gemini response');
    }

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    const steps = topic.steps.map((st, i) => {
      let narration = st.narration;
      if (i === 0 && parsed.step1Narration) narration = parsed.step1Narration;
      if (i === 1 && parsed.step2Narration) narration = parsed.step2Narration;
      if (i === 2 && parsed.step3Narration) narration = parsed.step3Narration;
      return {
        ...st,
        narration,
      };
    });

    const hook = parsed.hook || topic.problemStatement;
    const takeaway = parsed.takeaway || topic.takeaway;
    const fullSpokenText = `${hook} ${steps[0].narration} ${steps[1].narration} ${steps[2].narration} ${takeaway}`;

    const rawEntities: VisualEntity[] =
      parsed.visualEntities && Array.isArray(parsed.visualEntities) && parsed.visualEntities.length > 0
        ? parsed.visualEntities
        : getDefaultVisualEntities(topic);

    console.log(`🎨 [DynamicIconResolver] Resolving ${rawEntities.length} visual entities for "${topic.title}"...`);
    const [visualEntities, companySvgDataUri] = await Promise.all([
      resolveEntitiesIcons(rawEntities),
      resolveIconSvg(topic.company).catch(() => undefined),
    ]);

    const stageArchetype = parsed.stageArchetype || 'spatial';

    return {
      topicId: topic.id,
      company: topic.company,
      companyLogo: topic.companyLogo,
      companySvgDataUri,
      videoTitle: parsed.videoTitle || `${topic.title} #Shorts`,
      hook,
      scaleMetric: topic.scaleMetric,
      nodes: topic.nodes,
      edges: topic.edges,
      steps,
      takeaway,
      fullSpokenText,
      stageArchetype,
      visualEntities,
    };
  } catch (err: any) {
    console.warn(`⚠️ Gemini script generation error: ${err.message}. Falling back to curated script.`);
    return buildFallbackScript(topic);
  }
}

async function buildFallbackScript(topic: ExplainerTopic): Promise<ExplainerScript> {
  const hook = topic.problemStatement;
  const fullSpokenText = `${hook} ${topic.steps[0].narration} ${topic.steps[1].narration} ${topic.steps[2].narration} ${topic.takeaway}`;

  const rawEntities = getDefaultVisualEntities(topic);
  const [visualEntities, companySvgDataUri] = await Promise.all([
    resolveEntitiesIcons(rawEntities),
    resolveIconSvg(topic.company).catch(() => undefined),
  ]);

  return {
    topicId: topic.id,
    company: topic.company,
    companyLogo: topic.companyLogo,
    companySvgDataUri,
    videoTitle: `${topic.title} #Shorts`,
    hook,
    scaleMetric: topic.scaleMetric,
    nodes: topic.nodes,
    edges: topic.edges,
    steps: topic.steps,
    takeaway: topic.takeaway,
    fullSpokenText,
    stageArchetype: 'spatial',
    visualEntities,
  };
}
