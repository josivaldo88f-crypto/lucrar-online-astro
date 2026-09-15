import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'src', 'pages');
const outputFile = path.join(rootDir, 'src', 'data', 'posts.generated.json');

const FIELDS = ['title', 'description', 'categoria', 'image', 'date', 'dateModified', 'locale'];

function unescapeValue(value) {
  return value
    .replace(/\\(['"`\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
}

function extractString(frontmatter, name) {
  const pattern = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(['"\`])((?:\\\\.|(?!\\1).)*?)\\1`);
  const match = frontmatter.match(pattern);
  return match ? unescapeValue(match[2]) : undefined;
}

function getFrontmatter(source) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

function buildUrl(relativeFile) {
  const noExt = relativeFile.replace(/\.astro$/, '');
  const isIndex = noExt === 'index' || noExt.endsWith('/index');
  const route = noExt.replace(/(^|\/)index$/, '');
  const url = route ? `/${route}/` : '/';
  return { url, isIndex };
}

async function main() {
  const files = await walk(pagesDir);
  const posts = [];

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const frontmatter = getFrontmatter(source);
    const relativeFile = path.relative(pagesDir, file).split(path.sep).join('/');
    const { url, isIndex } = buildUrl(relativeFile);

    const post = { file: relativeFile, url, isIndex };
    for (const field of FIELDS) {
      const value = extractString(frontmatter, field);
      if (value !== undefined) post[field] = value;
    }
    if (!post.locale) post.locale = 'pt-BR';
    posts.push(post);
  }

  posts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const payload = {
    count: posts.length,
    posts,
  };

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[posts-manifest] ${posts.length} páginas -> ${path.relative(rootDir, outputFile)}`);
}

main().catch((error) => {
  console.error('[posts-manifest] falhou:', error);
  process.exit(1);
});
