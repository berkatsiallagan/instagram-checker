import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = join(__dirname, "store-assets");
mkdirSync(outDir, { recursive: true });

// 1. Promo Tile (440x280) - Microsoft Edge requirement
const promoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 280" width="440" height="280">
  <defs>
    <radialGradient id="igBg" cx="18%" cy="102%" r="125%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="15%" stop-color="#FF543E"/>
      <stop offset="55%" stop-color="#C837AB"/>
      <stop offset="100%" stop-color="#4B58D8"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" fill="#0d1424"/>
  <rect x="0" y="276" width="440" height="4" fill="url(#igBg)"/>

  <!-- Logo (84x84) centered at x=220, y=86 -->
  <g transform="translate(178, 44)">
    <rect width="84" height="84" rx="20" fill="url(#igBg)"/>
    <rect x="15" y="15" width="54" height="54" rx="14" fill="none" stroke="#FFFFFF" stroke-width="5.5"/>
    <circle cx="58" cy="27" r="4" fill="#FFFFFF"/>
    <circle cx="42" cy="42" r="15" fill="none" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M35 42 L40 47 L49 37" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Title & Subtitle -->
  <text x="220" y="166" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">Instagram Checker</text>
  <text x="220" y="196" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="400" fill="#94A3B8" text-anchor="middle">Who does not follow you back on Instagram</text>

  <!-- Feature tags -->
  <rect x="95" y="222" width="115" height="24" fill="#1E293B"/>
  <text x="152" y="238" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" text-anchor="middle">100% Client-Side</text>

  <rect x="230" y="222" width="115" height="24" fill="#1E293B"/>
  <text x="287" y="238" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="600" fill="#34D399" text-anchor="middle">Zero Password</text>
</svg>
`.trim();

// 2. Screenshot (1280x800) - Edge & Firefox requirement
const screenshotSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  <defs>
    <radialGradient id="igLogoGrad" cx="18%" cy="102%" r="125%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="15%" stop-color="#FF543E"/>
      <stop offset="55%" stop-color="#C837AB"/>
      <stop offset="100%" stop-color="#4B58D8"/>
    </radialGradient>
  </defs>

  <!-- Desktop Canvas Background -->
  <rect width="1280" height="800" fill="#090D16"/>

  <!-- Browser Window Mockup -->
  <g transform="translate(140, 40)">
    <!-- Window Frame -->
    <rect width="1000" height="720" fill="#FFFFFF" stroke="#334155" stroke-width="1"/>
    
    <!-- Window Header -->
    <rect width="1000" height="42" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
    <circle cx="20" cy="21" r="5" fill="#EF4444"/>
    <circle cx="36" cy="21" r="5" fill="#F59E0B"/>
    <circle cx="52" cy="21" r="5" fill="#10B981"/>

    <!-- Tab -->
    <rect x="76" y="8" width="220" height="34" fill="#FFFFFF"/>
    <text x="96" y="28" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#0F172A">Instagram Checker</text>

    <!-- Address Bar -->
    <rect x="310" y="8" width="540" height="26" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
    <text x="326" y="25" font-family="system-ui, sans-serif" font-size="11" fill="#64748B">chrome-extension://instagram-checker/popup.html</text>

    <!-- Content Area -->
    <g transform="translate(180, 70)">
      <!-- App Header -->
      <g transform="translate(0, 0)">
        <rect width="36" height="36" rx="8" fill="url(#igLogoGrad)"/>
        <text x="46" y="26" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#0F172A">Instagram Checker</text>
        <text x="0" y="56" font-family="system-ui, sans-serif" font-size="13" fill="#64748B">A free tool to see who does not follow you back. 100% private in your browser.</text>
      </g>

      <!-- Stats Cards -->
      <g transform="translate(0, 78)">
        <!-- Card 1 -->
        <rect x="0" y="0" width="98" height="64" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="49" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#0F172A" text-anchor="middle">542</text>
        <text x="49" y="50" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="middle">Following</text>

        <!-- Card 2 -->
        <rect x="108" y="0" width="98" height="64" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="157" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#0F172A" text-anchor="middle">480</text>
        <text x="157" y="50" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="middle">Followers</text>

        <!-- Card 3 (Not Follback - Active) -->
        <rect x="216" y="0" width="98" height="64" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.5"/>
        <text x="265" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#DC2626" text-anchor="middle">114</text>
        <text x="265" y="50" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#DC2626" text-anchor="middle">Not follback</text>

        <!-- Card 4 -->
        <rect x="324" y="0" width="98" height="64" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="373" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#0F172A" text-anchor="middle">52</text>
        <text x="373" y="50" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="middle">Fans</text>

        <!-- Card 5 -->
        <rect x="432" y="0" width="98" height="64" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="481" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#0F172A" text-anchor="middle">428</text>
        <text x="481" y="50" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="middle">Mutual</text>

        <!-- Card 6 -->
        <rect x="540" y="0" width="100" height="64" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1"/>
        <text x="590" y="30" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#1D4ED8" text-anchor="middle">79%</text>
        <text x="590" y="50" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#1D4ED8" text-anchor="middle">Follback Rate</text>
      </g>

      <!-- Tabs -->
      <g transform="translate(0, 160)">
        <rect x="0" y="0" width="150" height="34" fill="#1E293B"/>
        <text x="75" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Not following back (114)</text>

        <rect x="156" y="0" width="100" height="34" fill="#F1F5F9"/>
        <text x="206" y="22" font-family="system-ui, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">Fans (52)</text>

        <rect x="262" y="0" width="110" height="34" fill="#F1F5F9"/>
        <text x="317" y="22" font-family="system-ui, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">Mutual (428)</text>
      </g>

      <!-- List of Accounts -->
      <g transform="translate(0, 206)">
        <!-- Item 1 -->
        <rect x="0" y="0" width="640" height="52" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
        <text x="16" y="31" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#0F172A">travel_photographer_99</text>
        <rect x="490" y="11" width="66" height="30" fill="#F1F5F9"/>
        <text x="523" y="30" font-family="system-ui, sans-serif" font-size="11" fill="#0F172A" text-anchor="middle">Profile</text>
        <rect x="564" y="11" width="66" height="30" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/>
        <text x="597" y="30" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#DC2626" text-anchor="middle">Unfollow</text>

        <!-- Item 2 -->
        <rect x="0" y="58" width="640" height="52" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
        <text x="16" y="89" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#0F172A">tech_innovations_daily</text>
        <rect x="490" y="69" width="66" height="30" fill="#F1F5F9"/>
        <text x="523" y="88" font-family="system-ui, sans-serif" font-size="11" fill="#0F172A" text-anchor="middle">Profile</text>
        <rect x="564" y="69" width="66" height="30" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/>
        <text x="597" y="88" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#DC2626" text-anchor="middle">Unfollow</text>

        <!-- Item 3 (Unfollowed status) -->
        <rect x="0" y="116" width="640" height="52" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
        <text x="16" y="147" font-family="system-ui, sans-serif" font-size="14" fill="#94A3B8" text-decoration="line-through">fitness_coach_alex</text>
        <rect x="530" y="127" width="100" height="30" fill="#E2E8F0"/>
        <text x="580" y="146" font-family="system-ui, sans-serif" font-size="11" fill="#64748B" text-anchor="middle">Unfollowed</text>
      </g>

      <!-- Security Callout -->
      <g transform="translate(0, 396)">
        <rect x="0" y="0" width="640" height="42" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1"/>
        <text x="16" y="26" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#166534">100% Private: All calculations run locally in your browser. Files never leave your device.</text>
      </g>
    </g>
  </g>
</svg>
`.trim();

async function run() {
  console.log("Generating promotional assets...");

  // 1. Promo tile 440x280
  await sharp(Buffer.from(promoSvg))
    .png()
    .toFile(join(outDir, "promo-440x280.png"));
  console.log("Created promo-440x280.png");

  // 2. Screenshot 1280x800
  await sharp(Buffer.from(screenshotSvg))
    .png()
    .toFile(join(outDir, "screenshot-1280x800.png"));
  console.log("Created screenshot-1280x800.png");

  // 3. Store icon 128x128
  await sharp(join(__dirname, "icons", "icon-128.png"))
    .toFile(join(outDir, "icon-128.png"));
  console.log("Created icon-128.png");

  console.log("All store assets generated in apps/extension/store-assets/");
}

run().catch(console.error);
