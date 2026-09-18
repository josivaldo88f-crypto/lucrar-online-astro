import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createBanner() {
  const width = 1200;
  const height = 630;

  const stadiumPath = path.resolve('C:/Users/josiv/.gemini/antigravity/brain/1e9fa964-31bb-4dbc-86e8-51b2a49c0e6e/stadium_match_banner_1789768980400.jpg');
  const gremioBadgePath = path.resolve('public/images/escudo-gremio.webp');
  const palmeirasBadgePath = path.resolve('public/images/escudo-palmeiras.webp');

  // 1. Prepare base background from stadium photo (resize and crop to 1200x630)
  const baseStadium = await sharp(stadiumPath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  // 2. Prepare badges
  const gremioBadge = await sharp(gremioBadgePath)
    .resize(170, 170, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const palmeirasBadge = await sharp(palmeirasBadgePath)
    .resize(170, 170, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const gremioBase64 = 'data:image/png;base64,' + gremioBadge.toString('base64');
  const palmeirasBase64 = 'data:image/png;base64,' + palmeirasBadge.toString('base64');

  // 3. SVG Overlay with gradients, badges, typography and broadcast aesthetics
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Dark gradient overlay for bottom and sides for readability -->
      <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#050811" stop-opacity="0.65" />
        <stop offset="35%" stop-color="#0a0f1d" stop-opacity="0.3" />
        <stop offset="65%" stop-color="#060913" stop-opacity="0.75" />
        <stop offset="100%" stop-color="#020408" stop-opacity="0.95" />
      </linearGradient>

      <!-- Grêmio Glow (Tricolor Blue) -->
      <radialGradient id="gremioGlow" cx="270" cy="245" r="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0d6efd" stop-opacity="0.55" />
        <stop offset="50%" stop-color="#002b66" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#002b66" stop-opacity="0" />
      </radialGradient>

      <!-- Palmeiras Glow (Verdão Green) -->
      <radialGradient id="palmeirasGlow" cx="930" cy="245" r="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.55" />
        <stop offset="50%" stop-color="#047857" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#047857" stop-opacity="0" />
      </radialGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.7" />
      </filter>
    </defs>

    <!-- Shading overlays -->
    <rect width="${width}" height="${height}" fill="url(#vignette)" />
    <circle cx="270" cy="245" r="260" fill="url(#gremioGlow)" />
    <circle cx="930" cy="245" r="260" fill="url(#palmeirasGlow)" />

    <!-- Top Badge Pill -->
    <g transform="translate(425, 40)">
      <rect x="0" y="0" width="350" height="42" rx="21" fill="#0f172a" fill-opacity="0.85" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadow)" />
      <text x="175" y="26" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="2" text-anchor="middle">BRASILEIRÃO 2026 · 28ª RODADA</text>
    </g>

    <!-- Left Badge (Grêmio) -->
    <g filter="url(#shadow)">
      <circle cx="270" cy="240" r="105" fill="#0b1329" fill-opacity="0.9" stroke="#0ea5e9" stroke-width="4" />
      <image href="${gremioBase64}" x="185" y="155" width="170" height="170" />
      <text x="270" y="380" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="2">GRÊMIO</text>
    </g>

    <!-- VS Badge -->
    <g transform="translate(565, 210)">
      <circle cx="35" cy="35" r="35" fill="#0f172a" fill-opacity="0.95" stroke="#f59e0b" stroke-width="3" filter="url(#shadow)" />
      <text x="35" y="44" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" text-anchor="middle">VS</text>
    </g>

    <!-- Right Badge (Palmeiras) -->
    <g filter="url(#shadow)">
      <circle cx="930" cy="240" r="105" fill="#061a12" fill-opacity="0.9" stroke="#10b981" stroke-width="4" />
      <image href="${palmeirasBase64}" x="845" y="155" width="170" height="170" />
      <text x="930" y="380" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="2">PALMEIRAS</text>
    </g>

    <!-- Bottom Bar Card -->
    <g transform="translate(130, 440)">
      <rect x="0" y="0" width="940" height="145" rx="18" fill="#0b1120" fill-opacity="0.95" stroke="#1e293b" stroke-width="2" filter="url(#shadow)" />
      
      <text x="470" y="46" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="800" text-anchor="middle">Grêmio x Palmeiras</text>
      
      <text x="470" y="84" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">ONDE ASSISTIR AO VIVO · HORÁRIO E ESCALAÇÕES</text>
      
      <text x="470" y="118" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" text-anchor="middle">DOMINGO, 20 DE SETEMBRO · 11H00 · ARENA DO GRÊMIO · EXCLUSIVO PREMIERE</text>
    </g>
  </svg>
  `;

  // 4. Composite SVG onto the stadium photo
  const finalImageBuffer = await sharp(baseStadium)
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }
    ])
    .webp({ quality: 92 })
    .toBuffer();

  // 5. Save 1200w and 720w WebP files
  await sharp(finalImageBuffer)
    .toFile('public/images/gremio-x-palmeiras-onde-assistir.webp');

  await sharp(finalImageBuffer)
    .resize(720, 378)
    .webp({ quality: 90 })
    .toFile('public/images/gremio-x-palmeiras-onde-assistir-720.webp');

  console.log('Successfully generated Grêmio x Palmeiras banner WebP images (1200w and 720w)!');
}

createBanner().catch(console.error);
