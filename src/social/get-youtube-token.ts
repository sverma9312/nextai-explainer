import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const clientId = process.env.YOUTUBE_CLIENT_ID;
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

if (!clientId || !clientSecret) {
  console.error('\n❌ ERROR: YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be set in your .env file first!');
  process.exit(1);
}

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
].join(' ');

// Using prompt=consent select_account forces Google to show both the Google account AND the Brand Account / Channel picker
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
  clientId
)}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=code&scope=${encodeURIComponent(
  SCOPES
)}&access_type=offline&prompt=consent%20select_account`;

console.log('\n========================================================');
console.log('🔐 YouTube Channel Authorization: Software Architecture in 60s');
console.log('========================================================\n');
console.log('👉 Click or open this authorization link in your browser:');
console.log(`\n🔗 ${authUrl}\n`);
console.log('⚠️ CRITICAL STEP - BRAND ACCOUNT SELECTION:');
console.log('1. Click nextaiapps.team@gmail.com.');
console.log('2. When Google shows "Choose an account to continue to NextAI Video Studio", click:');
console.log('   👉 "Software Architecture in 60s" (@explainerapp)');
console.log('3. If Google says "Google hasn\'t verified this app", click "Advanced" -> "Go to NextAI Video Studio (unsafe)".');
console.log('4. Click "Continue" / "Allow".\n');
console.log(`⏳ Waiting for authorization callback on http://localhost:${PORT}/oauth2callback...\n`);

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '', `http://localhost:${PORT}`);
    if (!reqUrl.pathname.startsWith('/oauth2callback')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const code = reqUrl.searchParams.get('code');
    const error = reqUrl.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`<h2>Authorization Cancelled or Failed: ${error}</h2><p><a href="${authUrl}">Click here to retry</a></p>`);
      console.error(`❌ Authorization failed: ${error}`);
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h2>Missing authorization code</h2>');
      return;
    }

    console.log('🔄 Authorization code received! Exchanging for tokens...');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h2>Token Exchange Failed</h2><pre>${errText}</pre><p><a href="${authUrl}">Retry</a></p>`);
      console.error('❌ Token exchange failed:', errText);
      return;
    }

    const data = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    if (!data.refresh_token) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h2>Warning: No Refresh Token Returned</h2>
        <p>Google didn't return a refresh token. Please <a href="${authUrl}">click here to re-authorize</a>.</p>
      `);
      console.warn('⚠️ No refresh_token returned. Retry with prompt=consent.');
      return;
    }

    // Verify channel identity
    console.log('🔍 Verifying authorized YouTube channel identity...');
    let channelInfo = { id: 'Unknown', title: 'Unknown', customUrl: '' };
    try {
      const channelRes = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );
      if (channelRes.ok) {
        const chData = (await channelRes.json()) as any;
        const item = chData.items?.[0];
        if (item) {
          channelInfo = {
            id: item.id,
            title: item.snippet?.title || 'Unknown',
            customUrl: item.snippet?.customUrl || '',
          };
        }
      }
    } catch (chErr) {
      console.warn('Could not verify channel name:', chErr);
    }

    const isExplainerChannel =
      channelInfo.id === 'UCYxRhDJ7VIyq6R6kAAER5Og' ||
      channelInfo.title.toLowerCase().includes('architecture') ||
      channelInfo.customUrl.toLowerCase().includes('explainerapp');

    if (!isExplainerChannel) {
      console.warn(`\n⚠️ WRONG CHANNEL SELECTED: "${channelInfo.title}" (${channelInfo.customUrl || channelInfo.id})`);
      console.warn(`👉 We need "Software Architecture in 60s" (@explainerapp / UCYxRhDJ7VIyq6R6kAAER5Og)!`);
      console.warn(`Please click the authorization link again and select the Brand Account "Software Architecture in 60s".\n`);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; background: #0B0F17; color: #F8FAFC; text-align: center;">
            <div style="background: #1E1B4B; border: 1px solid #6366F1; border-radius: 16px; padding: 40px; max-width: 540px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
              <h1 style="color: #FBBF24; font-size: 22px; margin: 0 0 12px;">Wrong Channel Selected</h1>
              <p style="font-size: 15px; color: #CBD5E1; margin: 0 0 16px;">
                You authorized: <strong style="color: #EF4444;">${channelInfo.title} (${channelInfo.customUrl || channelInfo.id})</strong>.
              </p>
              <p style="font-size: 15px; color: #CBD5E1; margin: 0 0 24px;">
                We need: <strong style="color: #00F5A0;">Software Architecture in 60s (@explainerapp)</strong>.
              </p>
              <div style="margin-bottom: 24px;">
                <a href="${authUrl}" style="background: #00F5A0; color: #020617; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; display: inline-block;">
                  👉 Click Here to Select Software Architecture in 60s
                </a>
              </div>
              <p style="font-size: 13px; color: #94A3B8;">On the Google screen, be sure to click <strong>"Software Architecture in 60s"</strong> under your brand accounts list.</p>
            </div>
          </body>
        </html>
      `);
      return;
    }

    console.log('\n========================================================');
    console.log('🎉 PERFECT MATCH! YouTube Channel Successfully Linked!');
    console.log(`Channel Name: ${channelInfo.title}`);
    console.log(`Handle/URL:   ${channelInfo.customUrl}`);
    console.log(`Channel ID:   ${channelInfo.id}`);
    console.log('========================================================');
    console.log(`\n🔑 NEW YOUTUBE_REFRESH_TOKEN:\n${data.refresh_token}\n`);

    // Update .env file automatically
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('YOUTUBE_REFRESH_TOKEN=')) {
      envContent = envContent.replace(
        /YOUTUBE_REFRESH_TOKEN=.*/,
        `YOUTUBE_REFRESH_TOKEN=${data.refresh_token}`
      );
    } else {
      envContent += `\nYOUTUBE_REFRESH_TOKEN=${data.refresh_token}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`💾 Saved updated YOUTUBE_REFRESH_TOKEN to ${envPath}`);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; background: #0B0F17; color: #F8FAFC; text-align: center;">
          <div style="background: #111827; border: 1px solid #1E293B; border-radius: 16px; padding: 40px; max-width: 520px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h1 style="color: #38BDF8; font-size: 24px; margin: 0 0 8px;">Software Architecture in 60s Linked!</h1>
            <p style="font-size: 16px; color: #94A3B8; margin: 0 0 24px;">Channel: <strong style="color: #00F5A0;">${channelInfo.title} (${channelInfo.customUrl || channelInfo.id})</strong></p>
            <div style="background: rgba(0, 245, 160, 0.1); border: 1px solid rgba(0, 245, 160, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 20px;">
              <p style="margin: 0; color: #00F5A0; font-size: 14px;">The refresh token has been automatically saved to your .env file.</p>
            </div>
            <p style="font-size: 13px; color: #64748B;">You can close this tab and return to the terminal.</p>
          </div>
        </body>
      </html>
    `);

    setTimeout(() => {
      console.log('✅ Setup complete! You are ready to publish architecture shorts to YouTube.');
      process.exit(0);
    }, 2000);
  } catch (err) {
    console.error('❌ Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 OAuth listener running on http://localhost:${PORT}`);
});
