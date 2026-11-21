import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { ExplainerPosterProps } from '../src/video/components/ExplainerPoster.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CoverTarget {
  id: string;
  num: string;
  filename: string;
  company: string;
  companyLogo: string;
  topicTitle: string;
  volNumber: string;
  category: string;
  scaleMetric: string;
  summaryText: string;
}

const TARGETS: CoverTarget[] = [
  {
    id: 'uber-h3-matching',
    num: '01',
    filename: '01_uber_cover.jpg',
    company: 'Uber',
    companyLogo: '🚗',
    topicTitle: 'How Uber Matches 1M Drivers in 100ms',
    volNumber: 'VOL. 01',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: '1M+ Drivers // Under 100ms P99',
    summaryText: 'How does Uber pinpoint the closest driver to your location in under 100 milliseconds among 1 million moving vehicles?',
  },
  {
    id: 'netflix-openconnect-cdn',
    num: '02',
    filename: '02_netflix_cover.jpg',
    company: 'Netflix',
    companyLogo: '🍿',
    topicTitle: 'How Netflix Streams 4K to 250M Users',
    volNumber: 'VOL. 02',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: '250M Users // 15% Global Web Traffic',
    summaryText: 'How does Netflix stream crystal-clear 4K video globally without buffering or paying billions to commercial CDNs?',
  },
  {
    id: 'stripe-idempotency-engine',
    num: '03',
    filename: '03_stripe_cover.jpg',
    company: 'Stripe',
    companyLogo: '💳',
    topicTitle: 'How Stripe Never Double-Charges You',
    volNumber: 'VOL. 03',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: '99.999% Consistency // Millions TPS',
    summaryText: 'When internet drops right after clicking Pay, how does Stripe guarantee zero duplicate charges with idempotency keys?',
  },
  {
    id: 'whatsapp-erlang-concurrency',
    num: '04',
    filename: '04_whatsapp_cover.jpg',
    company: 'WhatsApp',
    companyLogo: '💬',
    topicTitle: 'How WhatsApp Handles 100B Messages Daily',
    volNumber: 'VOL. 04',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: '100B Msgs/Day // 50 Engineers',
    summaryText: 'How does a lean team of 50 engineers handle 100 billion daily messages with microsecond Erlang concurrency?',
  },
  {
    id: 'upi-instant-payments',
    num: '05',
    filename: '05_upi_cover.jpg',
    company: 'UPI',
    companyLogo: '⚡',
    topicTitle: 'How UPI Handles 50,000 TPS with 0 Downtime',
    volNumber: 'VOL. 05',
    category: 'ANIMATED SYSTEM DESIGN',
    scaleMetric: '14B Monthly Txns // 50k TPS Peak',
    summaryText: 'How does India’s UPI process 14 billion monthly transactions across hundreds of banks with zero downtime?',
  },
];

async function main() {
  const brainDir = 'C:/Users/sverm/.gemini/antigravity/brain/4eb41a64-5907-4bf9-b259-2904c9fbe2dc';
  const outCoversDir = path.resolve(process.cwd(), 'out/covers');
  await fsp.mkdir(outCoversDir, { recursive: true });

  const entryPoint = path.resolve(__dirname, '../src/video/Root.tsx');
  console.log('📦 Bundling Remotion composition once for all covers...');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js', '.jsx'],
          '.mjs': ['.mts', '.mjs'],
          '.cjs': ['.cts', '.cjs'],
        },
      },
    }),
  });

  console.log(`\n🎨 Starting batch render for ${TARGETS.length} Instagram Reel covers...\n`);

  for (const target of TARGETS) {
    const inputProps: ExplainerPosterProps = {
      company: target.company,
      companyLogo: target.companyLogo,
      topicTitle: target.topicTitle,
      volNumber: target.volNumber,
      category: target.category,
      scaleMetric: target.scaleMetric,
      summaryText: target.summaryText,
    };

    const localPath = path.resolve(outCoversDir, target.filename);
    const artifactPath = path.join(brainDir, target.filename);
    const standardOutPath = path.resolve(process.cwd(), 'out', `${target.id}_cover.jpg`);

    console.log(`🖼️ [${target.num}/05] Rendering cover for ${target.company} (${target.id})...`);
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'ExplainerPoster',
      inputProps,
    });

    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: localPath,
      inputProps,
      imageFormat: 'jpeg',
      jpegQuality: 92,
    });

    // Copy to brain artifact directory and out/[topicId]_cover.jpg
    await fsp.copyFile(localPath, artifactPath);
    await fsp.copyFile(localPath, standardOutPath);

    console.log(`   ✅ Rendered: ${localPath}`);
  }

  console.log('\n🎉 All 5 Explainer Instagram Reel covers rendered successfully!');
}

main().catch((err) => {
  console.error('❌ Batch render failed:', err);
  process.exit(1);
});
