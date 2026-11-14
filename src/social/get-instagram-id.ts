import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const token = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!token) {
  console.error('❌ INSTAGRAM_ACCESS_TOKEN is missing in .env');
  process.exit(1);
}

async function checkInstagramPages() {
  console.log('🔍 Checking connected Facebook Pages and Instagram Accounts...\n');

  const res = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=name,id,instagram_business_account{id,username,name}&access_token=${token}`
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('❌ Meta API Error:', err);
    return;
  }

  const data = (await res.json()) as any;
  const pages = data.data || [];

  if (pages.length === 0) {
    console.log('ℹ️ No Facebook Pages found for this token.');
    return;
  }

  console.log(`Found ${pages.length} Facebook Page(s):\n`);

  let explainerId: string | null = null;

  for (const page of pages) {
    console.log(`📄 Page: "${page.name}" (ID: ${page.id})`);
    if (page.instagram_business_account) {
      const ig = page.instagram_business_account;
      console.log(`   └─ 📸 Linked Instagram: @${ig.username} (${ig.name})`);
      console.log(`      INSTAGRAM_ACCOUNT_ID: ${ig.id}`);

      if (
        ig.username?.toLowerCase().includes('explainer') ||
        page.name.toLowerCase().includes('architecture')
      ) {
        explainerId = ig.id;
        console.log(`\n🎉 Found Explainer Instagram Account ID: ${explainerId}`);
      }
    } else {
      console.log('   └─ ⚠️ No Instagram Business Account linked to this page yet.');
    }
    console.log('');
  }

  if (explainerId) {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('INSTAGRAM_ACCOUNT_ID=')) {
      envContent = envContent.replace(
        /INSTAGRAM_ACCOUNT_ID=.*/,
        `INSTAGRAM_ACCOUNT_ID=${explainerId}`
      );
    } else {
      envContent += `\nINSTAGRAM_ACCOUNT_ID=${explainerId}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`💾 Automatically saved new INSTAGRAM_ACCOUNT_ID (${explainerId}) to ${envPath}`);
  }
}

checkInstagramPages().catch(console.error);
