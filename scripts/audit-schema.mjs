import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const errors = [];
const allTypes = new Set();
let withJsonLd = 0;
let invalidBlocks = 0;

async function walk(dir) {
  const files = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    (await stat(path)).isDirectory() ? files.push(...await walk(path)) : files.push(path);
  }
  return files;
}

function route(file) {
  const rel = relative(root, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  return `/${rel.replace(/index\.html$/, '')}`;
}

function typesIn(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((item) => typesIn(item, out));
  else if (value && typeof value === 'object') {
    const type = value['@type'];
    (Array.isArray(type) ? type : [type]).filter(Boolean).forEach((item) => out.add(item));
    Object.values(value).forEach((item) => typesIn(item, out));
  }
  return out;
}

const files = (await walk(root)).filter((file) => file.endsWith('.html'));
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const url = route(file);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!noindex && blocks.length === 0) errors.push(`${url}: JSON-LD отсутствует`);
  if (blocks.length) withJsonLd++;
  const pageTypes = new Set();
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1]);
      if (parsed['@context'] !== 'https://schema.org') errors.push(`${url}: неверный @context`);
      if (!Array.isArray(parsed['@graph']) || parsed['@graph'].length === 0) errors.push(`${url}: пустой @graph`);
      const ids = parsed['@graph']?.map((item) => item?.['@id']).filter(Boolean) ?? [];
      if (new Set(ids).size !== ids.length) errors.push(`${url}: дублирующийся @id`);
      for (const type of typesIn(parsed)) { pageTypes.add(type); allTypes.add(type); }
    } catch (error) {
      invalidBlocks++;
      errors.push(`${url}: JSON.parse: ${error.message}`);
    }
  }
  if (!noindex) {
    for (const required of ['Organization', 'WebSite']) if (!pageTypes.has(required)) errors.push(`${url}: отсутствует ${required}`);
    if (!pageTypes.has('WebPage') && !pageTypes.has('CollectionPage')) errors.push(`${url}: отсутствует тип страницы`);
    if (/\/(?:ro\/)?zhurnal\/[^/]+\/$/.test(url) && !pageTypes.has('Article')) errors.push(`${url}: отсутствует Article`);
    if (url !== '/' && url !== '/ro/' && !pageTypes.has('BreadcrumbList')) errors.push(`${url}: отсутствует BreadcrumbList`);
  }
  console.log(`${url}: ${[...pageTypes].sort().join(', ') || '(noindex; JSON-LD omitted)'}`);
}

console.log(`HTML pages checked: ${files.length}`);
console.log(`Pages with JSON-LD: ${withJsonLd}`);
console.log(`Pages without JSON-LD: ${files.length - withJsonLd}`);
console.log(`Invalid JSON-LD blocks: ${invalidBlocks}`);
console.log(`Unique schema types: ${[...allTypes].sort().join(', ')}`);
console.log(`Errors: ${errors.length}`);
errors.forEach((error) => console.error(`ERROR ${error}`));
process.exitCode = errors.length ? 1 : 0;
