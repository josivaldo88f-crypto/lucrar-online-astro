import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createBanner() {
  const width = 1200;
  const height = 630;

  const flaBuffer = fs.readFileSync(path.resolve('public/images/escudo-flamengo.webp'));
  const bragBuffer = fs.readFileSync(path.resolve('public/images/escudo-bragantino.webp'));

  // First resize the badges to fit nicely
  const flaBadge = await sharp(flaBuffer)
    .resize(170, 170, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const bragBadge = await sharp(bragBuffer)
    .resize(170, 170, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const flaBase64 = 'data:image/png;base64,' + flaBadge.toString('base64');
  const bragBase64 = 'data:image/png;base64,' + bragBadge.toString('base64');

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080b12" />
        <stop offset="50%" stop-color="#0e1320" />
        <stop offset="100%" stop-color="#080a10" />
      </linearGradient>

      <radialGradient id="flaGlow" cx="270" cy="250" r="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#c51d24" stop-opacity="0.45" />
        <stop offset="60%" stop-color="#c51d24" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#c51d24" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="bragGlow" cx="930" cy="250" r="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.45" />
        <stop offset="60%" stop-color="#dc2626" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0" />
      </radialGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6" />
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <circle cx="270" cy="250" r="260" fill="url(#flaGlow)" />
    <circle cx="930" cy="250" r="260" fill="url(#bragGlow)" />

    <!-- Top Badge Pill -->
    <g transform="translate(425, 45)">
      <rect x="0" y="0" width="350" height="40" rx="20" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="1.5" />
      <text x="175" y="25" fill="#93c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="2" text-anchor="middle">BRASILEIRÃO 2026 · 28ª RODADA</text>
    </g>

    <!-- Left Badge (Flamengo) -->
    <g filter="url(#shadow)">
      <circle cx="270" cy="250" r="110" fill="#111827" stroke="#c51d24" stroke-width="4" />
      <image href="${flaBase64}" x="185" y="165" width="170" height="170" />
      <text x="270" y="395" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="1.5">FLAMENGO</text>
    </g>

    <!-- VS Badge -->
    <g transform="translate(570, 220)">
      <circle cx="30" cy="30" r="30" fill="#1e293b" stroke="#f59e0b" stroke-width="3" filter="url(#shadow)" />
      <text x="30" y="38" fill="#fbbf24" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" text-anchor="middle">VS</text>
    </g>

    <!-- Right Badge (Red Bull Bragantino) -->
    <g filter="url(#shadow)">
      <circle cx="930" cy="250" r="110" fill="#ffffff" stroke="#1e3a8a" stroke-width="4" />
      <image href="${bragBase64}" x="845" y="165" width="170" height="170" />
      <text x="930" y="395" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="1.5">BRAGANTINO</text>
    </g>

    <!-- Bottom Bar Card -->
    <g transform="translate(150, 450)">
      <rect x="0" y="0" width="900" height="135" rx="16" fill="#0f172a" fill-opacity="0.95" stroke="#1e293b" stroke-width="2" filter="url(#shadow)" />
      
      <text x="450" y="44" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="800" text-anchor="middle">Flamengo x Red Bull Bragantino</text>
      
      <text x="450" y="80" fill="#f59e0b" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" text-anchor="middle" letter-spacing="1.5">ONDE ASSISTIR AO VIVO · HORÁRIO E ESCALAÇÕES</text>
      
      <text x="450" y="112" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="500" text-anchor="middle">DOMINGO, 20 DE SETEMBRO · 18H30 · MARACANÃ (RIO DE JANEIRO)</text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  await sharp(svgBuffer)
    .webp({ quality: 92 })
    .toFile('public/images/flamengo-x-bragantino-onde-assistir.webp');

  await sharp(svgBuffer)
    .resize(720, 378)
    .webp({ quality: 90 })
    .toFile('public/images/flamengo-x-bragantino-onde-assistir-720.webp');

  console.log('Successfully generated flamengo-x-bragantino-onde-assistir banner images!');
}

createBanner().catch(console.error);
