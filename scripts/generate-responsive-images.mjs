import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');
const srcDir = path.resolve('src');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

const referenced = new Set();
const re = /["'`]\/images\/([^"'`\s)]+)["'`]/g;
for (const file of walk(srcDir)) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = re.exec(content))) referenced.add(match[1]);
}

const heroBases = new Set([
  'cargosort-inicio',
  'cargosort-conquistas',
  'cargosort-tarefa-diaria',
  'cargosort-vip',
  'cargosort-saque-moedas',
  'cargosort-saque-diamantes',
  'cargosort-canais',
  'hotminidrama-abertura',
  'hotminidrama-episodio',
  'hotminidrama-saque',
  'dramaspot-inicio',
  'dramaspot-carteira',
  'dramaspot-episodio',
  'dramaspot-google-play',
]);

async function encode(src, out, width, quality) {
  const meta = await sharp(src).metadata();
  if (!meta.width) return false;
  const w = Math.min(width, meta.width);
  const buf = await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 5 }).toBuffer();
  fs.writeFileSync(out, buf);
  return true;
}

let created = 0;
let skipped = 0;

for (const rel of referenced) {
  const src = path.join(imagesDir, rel);
  if (!fs.existsSync(src)) {
    console.log('skip (ausente):', rel);
    continue;
  }
  const base = rel.replace(/\.[^.]+$/, '');
  const cardOut = path.join(imagesDir, `${base}-720.webp`);
  try {
    await encode(src, cardOut, 720, 76);
    created++;
  } catch (error) {
    console.log('erro 720:', rel, String(error).slice(0, 80));
  }
  if (heroBases.has(base)) {
    for (const width of [480, 900]) {
      const out = path.join(imagesDir, `${base}-${width}.webp`);
      const quality = width === 480 ? 76 : 74;
      try {
        await encode(src, out, width, quality);
        created++;
      } catch (error) {
        console.log(`erro ${width}:`, rel, String(error).slice(0, 80));
      }
    }
  }
}

console.log(`Referencias encontradas: ${referenced.size}. Variantes criadas/atualizadas: ${created}. Puladas: ${skipped}.`);
