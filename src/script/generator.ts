import { GoogleGenAI } from '@google/genai';
import type { ExplainerTopic, ExplainerScript } from '../schema/types.js';

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
Your task is to take a software architecture case study and generate an ultra-crisp, authoritative, 45-to-55-second vertical video script.

Rules:
1. Hook must start with high-stakes scale or technical mystery (e.g. "How does Uber match 1 million drivers in under 100 milliseconds?").
2. Follow the 3 architectural layers:
   - Layer 1: Ingestion / Network Gateway
   - Layer 2: Core Distributed Engine / In-Memory State
   - Layer 3: Persistence / Consensus / Scale Takeaway
3. Pacing: Punchy, zero filler, zero greeting, high technical density (mention protocols, data structures, and algorithms).
4. Total spoken words must be strictly between 110 and 130 words (approx 45-50 seconds speech).

Return ONLY valid JSON with this exact schema:
{
  "videoTitle": "Short YouTube Shorts title ending with #Shorts (max 60 chars)",
  "hook": "Opening 1-sentence hook (approx 12-16 words)",
  "step1Narration": "Layer 1 narration (approx 30-35 words)",
  "step2Narration": "Layer 2 narration (approx 30-35 words)",
  "step3Narration": "Layer 3 narration (approx 30-35 words)",
  "takeaway": "Closing 1-sentence engineering rule (approx 12-18 words)"
}`;

    const userPrompt = `Topic: ${topic.title}
Company: ${topic.company}
Scale: ${topic.scaleMetric}
Problem: ${topic.problemStatement}
Key Tech: ${topic.tags.join(', ')}
Existing Step Details:
Step 1: ${topic.steps[0].stepTitle} - ${topic.steps[0].narration}
Step 2: ${topic.steps[1].stepTitle} - ${topic.steps[1].narration}
Step 3: ${topic.steps[2].stepTitle} - ${topic.steps[2].narration}
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

    return {
      topicId: topic.id,
      company: topic.company,
      companyLogo: topic.companyLogo,
      videoTitle: parsed.videoTitle || `${topic.title} #Shorts`,
      hook,
      scaleMetric: topic.scaleMetric,
      nodes: topic.nodes,
      edges: topic.edges,
      steps,
      takeaway,
      fullSpokenText,
    };
  } catch (err: any) {
    console.warn(`⚠️ Gemini script generation error: ${err.message}. Falling back to curated script.`);
    return buildFallbackScript(topic);
  }
}

function buildFallbackScript(topic: ExplainerTopic): ExplainerScript {
  const hook = topic.problemStatement;
  const fullSpokenText = `${hook} ${topic.steps[0].narration} ${topic.steps[1].narration} ${topic.steps[2].narration} ${topic.takeaway}`;

  return {
    topicId: topic.id,
    company: topic.company,
    companyLogo: topic.companyLogo,
    videoTitle: `${topic.title} #Shorts`,
    hook,
    scaleMetric: topic.scaleMetric,
    nodes: topic.nodes,
    edges: topic.edges,
    steps: topic.steps,
    takeaway: topic.takeaway,
    fullSpokenText,
  };
}
