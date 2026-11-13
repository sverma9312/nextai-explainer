import path from 'node:path';
import fsp from 'node:fs/promises';
import { GoogleGenAI } from '@google/genai';
import type { VisualEntity } from '../schema/types.js';

const CACHE_DIR = path.resolve(process.cwd(), 'cache/icons');

function sanitizeFilename(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
}

function svgToDataUri(svg: string): string {
  // Ensure the SVG has xml namespace
  let cleanSvg = svg.trim();
  if (!cleanSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

/**
 * High-priority icon sets for official developer tools & systems architecture.
 */
const BRAND_COLLECTIONS = new Set([
  'logos',
  'devicon',
  'devicon-plain',
  'skill-icons',
  'simple-icons',
  'cib',
]);

const GENERAL_COLLECTIONS = [
  'solar',
  'tabler',
  'carbon',
  'lucide',
  'material-symbols',
  'mdi',
  'mingcute',
];

/**
 * Searches Iconify API and retrieves the highest-fidelity SVG.
 */
async function fetchFromIconify(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=12`;
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;

    const data = (await res.json()) as { icons?: string[] };
    if (!data.icons || data.icons.length === 0) return null;

    // Prioritize official brand logos first, then general UI icon sets
    let chosenIcon = data.icons.find((iconName) => {
      const prefix = iconName.split(':')[0];
      return BRAND_COLLECTIONS.has(prefix);
    });

    if (!chosenIcon) {
      chosenIcon = data.icons.find((iconName) => {
        const prefix = iconName.split(':')[0];
        return GENERAL_COLLECTIONS.includes(prefix);
      }) || data.icons[0];
    }

    const [prefix, name] = chosenIcon.split(':');
    if (!prefix || !name) return null;

    const iconSvgUrl = `https://api.iconify.design/${prefix}/${name}.svg`;
    const svgRes = await fetch(iconSvgUrl, { signal: AbortSignal.timeout(4000) });
    if (!svgRes.ok) return null;

    const svgText = await svgRes.text();
    if (svgText.trim().startsWith('<svg')) {
      return svgText.trim();
    }
  } catch (err: any) {
    console.warn(`   [DynamicIconResolver] Iconify lookup for "${query}" skipped: ${err.message}`);
  }

  return null;
}

/**
 * Generates an SVG vector icon on-the-fly via Gemini when no official icon exists.
 */
async function generateSvgWithGemini(query: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an elite vector icon designer. Create a clean, modern, flat vector SVG icon representing: "${query}".
Rules:
- Return ONLY the raw SVG markup (<svg ...</svg>).
- No markdown formatting, no code blocks (\`\`\`), no html tags.
- Use viewBox="0 0 100 100", width="100%", height="100%".
- Use vibrant modern colors (e.g. cyan #22D3EE, emerald #10B981, violet #A855F7, amber #F59E0B, white #FFFFFF).
- Simple geometric shapes with clean curves.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text?.trim() || '';
    const match = text.match(/<svg[\s\S]*?<\/svg>/i);
    if (match) {
      return match[0].trim();
    }
  } catch (err: any) {
    console.warn(`   [DynamicIconResolver] Gemini SVG synthesis for "${query}" skipped: ${err.message}`);
  }

  return null;
}

/**
 * Deterministic fallback SVG for complete offline resilience.
 */
function createFallbackSvg(query: string): string {
  const label = query.slice(0, 3).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect x="10" y="10" width="80" height="80" rx="20" fill="#0E121E" stroke="#22D3EE" stroke-width="4" />
  <circle cx="50" cy="50" r="28" fill="rgba(34, 211, 238, 0.15)" />
  <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#22D3EE" text-anchor="middle">${label}</text>
</svg>`;
}

/**
 * Resolves an icon query into an SVG data URI with persistent disk caching.
 */
export async function resolveIconSvg(query: string): Promise<string> {
  const cleanName = sanitizeFilename(query);
  await fsp.mkdir(CACHE_DIR, { recursive: true });
  const cacheFile = path.resolve(CACHE_DIR, `${cleanName}.svg`);

  // 1. Check local persistent disk cache
  try {
    const cachedSvg = await fsp.readFile(cacheFile, 'utf-8');
    if (cachedSvg.trim().startsWith('<svg')) {
      return svgToDataUri(cachedSvg);
    }
  } catch {
    // Cache miss, proceed to dynamic resolution
  }

  console.log(`🔍 [DynamicIconResolver] Resolving icon for "${query}"...`);

  // 2. Query Iconify catalog (thousands of open-source brand & UI icons)
  let svg = await fetchFromIconify(query);

  // 3. Fallback to Gemini AI vector synthesis if no catalog match
  if (!svg) {
    console.log(`🤖 [DynamicIconResolver] No Iconify match for "${query}". Synthesizing SVG with Gemini...`);
    svg = await generateSvgWithGemini(query);
  }

  // 4. Final safety fallback
  if (!svg) {
    svg = createFallbackSvg(query);
  }

  // 5. Persist to cache
  try {
    await fsp.writeFile(cacheFile, svg, 'utf-8');
    console.log(`💾 [DynamicIconResolver] Cached "${query}" to ${cacheFile}`);
  } catch (err: any) {
    console.warn(`   Failed to write cache for "${query}": ${err.message}`);
  }

  return svgToDataUri(svg);
}

/**
 * Concurrently resolves all visual entities for a video script.
 */
export async function resolveEntitiesIcons(entities: VisualEntity[]): Promise<VisualEntity[]> {
  if (!entities || entities.length === 0) return [];

  return Promise.all(
    entities.map(async (ent) => {
      const query = ent.iconQuery || ent.label || ent.id;
      const svgDataUri = await resolveIconSvg(query);
      return {
        ...ent,
        svgDataUri,
      };
    })
  );
}

