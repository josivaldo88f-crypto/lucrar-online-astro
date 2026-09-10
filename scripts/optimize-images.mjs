import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '..', 'public', 'images');
const MIN_SIZE = 60 * 1024;
const MAX_WIDTH = 1200;

const handlerByFormat = {
  jpg: (pipeline) => pipeline.jpeg({ quality: 68, mozjpeg: true, progressive: true }),
  jpeg: (pipeline) => pipeline.jpeg({ quality: 68, mozjpeg: true, progressive: true }),
  webp: (pipeline) => pipeline.webp({ quality: 74, effort: 5 }),
  avif: (pipeline) => pipeline.avif({ quality: 55, effort: 4 }),
  png: (pipeline) => pipeline.png({ compressionLevel: 9, palette: true, quality: 82 }),
};

const fmtKB = (bytes) => (bytes / 1024).toFixed(1);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const files = (await walk(imagesDir)).sort((a, b) => a.localeCompare(b));
const results = [];
let skipped = 0;
let kept = 0;
let totalBefore = 0;
let totalAfter = 0;
let folderBefore = 0;
let folderAfter = 0;

for (const file of files) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const name = path.basename(file);
  const handler = handlerByFormat[ext];
  const before = (await fs.stat(file)).size;
  folderBefore += before;

  if (!handler || before < MIN_SIZE || /favicon|apple-touch-icon/i.test(name)) {
    skipped += 1;
    folderAfter += before;
    continue;
  }

  try {
    const buffer = await fs.readFile(file);
    const pipeline = sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize({ width: MAX_WIDTH, fit: 'inside', withoutEnlargement: true });
    const output = await handler(pipeline).toBuffer();

    if (output.length < before) {
      await fs.writeFile(file, output);
      totalBefore += before;
      totalAfter += output.length;
      folderAfter += output.length;
      results.push({ name, before, after: output.length });
    } else {
      kept += 1;
      totalBefore += before;
      totalAfter += before;
      folderAfter += before;
      results.push({ name, before, after: before, keptOriginal: true });
    }
  } catch (error) {
    kept += 1;
    totalBefore += before;
    totalAfter += before;
    folderAfter += before;
    results.push({ name, before, after: before, keptOriginal: true });
    console.error(`erro ao processar ${name}: ${String(error).slice(0, 120)}`);
  }
}

results.sort((a, b) => b.before - a.before);

console.log('arquivo'.padEnd(52), 'antes'.padStart(10), 'depois'.padStart(10), 'reducao'.padStart(9));
console.log('-'.repeat(85));
for (const r of results) {
  const reduction = r.before > 0 ? (1 - r.after / r.before) * 100 : 0;
  const name = r.name.length > 50 ? `${r.name.slice(0, 47)}...` : r.name;
  const label = r.keptOriginal ? `${reduction.toFixed(1)}% (mantido)` : `${reduction.toFixed(1)}%`;
  console.log(name.padEnd(52), `${fmtKB(r.before)}KB`.padStart(10), `${fmtKB(r.after)}KB`.padStart(10), label.padStart(9));
}
console.log('-'.repeat(85));
const reduction = totalBefore > 0 ? (1 - totalAfter / totalBefore) * 100 : 0;
console.log(`processados: ${results.length} | pulados (<60KB/favicon): ${skipped} | mantidos (sem ganho): ${kept}`);
console.log(`total processados: antes ${fmtKB(totalBefore)}KB -> depois ${fmtKB(totalAfter)}KB (${reduction.toFixed(1)}% de reducao)`);
console.log(`total public/images: antes ${fmtKB(folderBefore)}KB -> depois ${fmtKB(folderAfter)}KB (${(((1 - folderAfter / folderBefore) * 100) || 0).toFixed(1)}% de reducao)`);
