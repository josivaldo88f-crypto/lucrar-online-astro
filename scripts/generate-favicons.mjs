import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const projectRoot = process.cwd();
const inputArg = process.argv[2];

if (!inputArg) {
  console.error('Uso: npm run generate:favicons -- "caminho/para/sua-logo.png"');
  process.exit(1);
}

const inputPath = path.resolve(projectRoot, inputArg);
const publicDir = path.join(projectRoot, 'public');

const outputPaths = {
  svg: path.join(publicDir, 'favicon.svg'),
  ico: path.join(publicDir, 'favicon.ico'),
  apple: path.join(publicDir, 'apple-touch-icon.png')
};

const mimeByExtension = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const iconSizes = [48, 96, 144, 192];

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return mimeByExtension[extension] ?? 'application/octet-stream';
}

async function ensureInputExists(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    console.error(`Arquivo de entrada nao encontrado: ${filePath}`);
    process.exit(1);
  }
}

async function createSquarePng(size) {
  return sharp(inputPath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
}

async function createSvgWrapper() {
  const sourceBuffer = await fs.readFile(inputPath);
  const base64 = sourceBuffer.toString('base64');
  const mimeType = getMimeType(inputPath);

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',
    `  <image href="data:${mimeType};base64,${base64}" width="512" height="512" preserveAspectRatio="xMidYMid meet" />`,
    '</svg>',
    ''
  ].join('\n');
}

async function main() {
  await ensureInputExists(inputPath);
  await fs.mkdir(publicDir, { recursive: true });

  const icoBuffers = await Promise.all(iconSizes.map((size) => createSquarePng(size)));
  const appleTouchIcon = await sharp(inputPath)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();

  const faviconSvg = await createSvgWrapper();
  const faviconIco = await pngToIco(icoBuffers);

  await fs.writeFile(outputPaths.svg, faviconSvg, 'utf8');
  await fs.writeFile(outputPaths.ico, faviconIco);
  await fs.writeFile(outputPaths.apple, appleTouchIcon);

  console.log('Favicons gerados com sucesso:');
  console.log(`- ${outputPaths.svg}`);
  console.log(`- ${outputPaths.ico}`);
  console.log(`- ${outputPaths.apple}`);
  console.log(`Tamanhos usados no ICO: ${iconSizes.join(', ')}px`);
  console.log('Apple Touch Icon: 180x180');
}

main().catch((error) => {
  console.error('Erro ao gerar favicons:', error);
  process.exit(1);
});
