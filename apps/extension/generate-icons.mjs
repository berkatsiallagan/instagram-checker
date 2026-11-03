import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Master SVG (512x512) dengan gradien khas Instagram + siluet kamera + lensa checkmark
const masterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="igBg" cx="18%" cy="102%" r="125%" fx="15%" fy="105%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="12%" stop-color="#FF543E"/>
      <stop offset="50%" stop-color="#C837AB"/>
      <stop offset="100%" stop-color="#4B58D8"/>
    </radialGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
    </linearGradient>
  </defs>

  <!-- Background squircle -->
  <rect width="512" height="512" rx="118" fill="url(#igBg)"/>
  <rect width="512" height="512" rx="118" fill="url(#shine)"/>

  <!-- Outer Camera Contour -->
  <rect x="96" y="96" width="320" height="320" rx="84" fill="none" stroke="#FFFFFF" stroke-width="32"/>

  <!-- Flash dot -->
  <circle cx="348" cy="164" r="22" fill="#FFFFFF"/>

  <!-- Camera Lens Ring -->
  <circle cx="256" cy="260" r="90" fill="none" stroke="#FFFFFF" stroke-width="30"/>

  <!-- Follow Back Checkmark inside lens -->
  <path d="M216 260 L245 289 L298 232" fill="none" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`.trim();

// 2. High-legibility SVG untuk 16x16 (proporsi stroke lebih tebal agar tetap tajam di toolbar Chrome)
const icon16Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
  <defs>
    <radialGradient id="igBg16" cx="18%" cy="102%" r="125%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="15%" stop-color="#FF543E"/>
      <stop offset="55%" stop-color="#C837AB"/>
      <stop offset="100%" stop-color="#4B58D8"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#igBg16)"/>
  <rect x="80" y="80" width="352" height="352" rx="90" fill="none" stroke="#FFFFFF" stroke-width="48"/>
  <circle cx="355" cy="155" r="30" fill="#FFFFFF"/>
  <circle cx="256" cy="262" r="98" fill="none" stroke="#FFFFFF" stroke-width="44"/>
  <path d="M210 262 L246 298 L304 228" fill="none" stroke="#FFFFFF" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`.trim();

async function run() {
  const masterBuf = Buffer.from(masterSvg);
  const icon16Buf = Buffer.from(icon16Svg);

  // Generate apps/extension/icons
  await sharp(masterBuf).resize(128, 128).png({ quality: 100 }).toFile(join(__dirname, "icons/icon-128.png"));
  await sharp(masterBuf).resize(48, 48).png({ quality: 100 }).toFile(join(__dirname, "icons/icon-48.png"));
  await sharp(icon16Buf).resize(16, 16).png({ quality: 100 }).toFile(join(__dirname, "icons/icon-16.png"));

  // Update website icons as well
  await sharp(masterBuf).resize(512, 512).png({ quality: 100 }).toFile(join(__dirname, "../web/public/icon.png"));
  await sharp(masterBuf).resize(180, 180).png({ quality: 100 }).toFile(join(__dirname, "../web/app/apple-icon.png"));

  console.log("Successfully generated all extension and web icons!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
