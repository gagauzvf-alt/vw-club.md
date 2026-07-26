import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const site = 'https://vw-club.md';
const errors = [];
const warnings = [];
const pages = [];
const metrics = { brokenInternalLinks: 0, missingCanonical: 0, missingH1: 0, missingOgTags: 0 };

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    (await stat(path)).isDirectory() ? out.push(...await walk(path)) : out.push(path);
  }
  return out;
}

const text = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? '';
const count = (html, pattern) => [...html.matchAll(pattern)].length;
const pageUrl = (file) => {
  const rel = relative(root, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  return `/${rel.replace(/index\.html$/, '')}`;
};

for (const file of (await walk(root)).filter((file) => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const url = pageUrl(file);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const title = text(html, /<title>([\s\S]*?)<\/title>/i);
  const description = text(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
  const canonical = text(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i);
  const h1s = count(html, /<h1(?:\s|>)/gi);

  if (!title) errors.push(`${url}: title отсутствует`);
  if (!description) errors.push(`${url}: meta description отсутствует`);
  if (!canonical.startsWith(site)) { errors.push(`${url}: canonical отсутствует или не абсолютный`); metrics.missingCanonical++; }
  if (count(html, /<link[^>]+rel=["']canonical["']/gi) !== 1) errors.push(`${url}: canonical должен быть один`);
  if (h1s !== 1) { errors.push(`${url}: найдено H1: ${h1s}`); metrics.missingH1++; }
  if (!/<html[^>]+lang=["'](?:ru|ro)["']/i.test(html)) errors.push(`${url}: некорректный lang`);
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
    if (!html.includes(`property="${property}"`)) { errors.push(`${url}: отсутствует ${property}`); metrics.missingOgTags++; }
  }
  if (!html.includes('name="twitter:image"')) errors.push(`${url}: отсутствует twitter:image`);

  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${url}: невалидный JSON-LD`); }
  }
  if (!noindex && !html.includes('application/ld+json')) errors.push(`${url}: JSON-LD отсутствует`);
  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(img[0])) errors.push(`${url}: изображение без alt`);
  }
  pages.push({ file, html, url, title, description, canonical, noindex });
}

for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const page of pages.filter((page) => !page.noindex)) {
    if (seen.has(page[field])) errors.push(`${page.url}: дублирующийся ${field} с ${seen.get(page[field])}`);
    else seen.set(page[field], page.url);
  }
}

const known = new Set(pages.map((page) => page.url));
for (const page of pages) {
  for (const match of page.html.matchAll(/href=["']([^"'#?]+)[^"']*["']/gi)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//') || /\.(?:css|js|xml|webmanifest|png|jpe?g|webp|avif|svg|ico)$/i.test(href)) continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (!known.has(href) && !known.has(normalized)) { errors.push(`${page.url}: битая внутренняя ссылка ${href}`); metrics.brokenInternalLinks++; }
  }
}

const sitemapFiles = (await walk(root)).filter((file) => /sitemap.*\.xml$/.test(file));
const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    if (match[1].startsWith(site) && !match[1].endsWith('.xml')) sitemapUrls.add(new URL(match[1]).pathname);
  }
}
for (const page of pages.filter((page) => !page.noindex && page.url !== '/404.html')) {
  if (!sitemapUrls.has(new URL(page.canonical).pathname)) errors.push(`${page.url}: индексируемая страница отсутствует в sitemap`);
}
for (const url of sitemapUrls) {
  if (!known.has(url)) errors.push(`sitemap: URL не найден в сборке ${url}`);
}

for (const page of pages) {
  if (page.title.length > 70) warnings.push(`${page.url}: длинный title (${page.title.length})`);
  if (page.description.length > 170) warnings.push(`${page.url}: длинный description (${page.description.length})`);
}

console.log(`SEO audit: ${pages.length} HTML, ${sitemapUrls.size} sitemap URL`);
console.log(`Ошибки: ${errors.length}; предупреждения: ${warnings.length}`);
console.log(`Broken internal links: ${metrics.brokenInternalLinks}`);
console.log(`Missing canonical: ${metrics.missingCanonical}`);
console.log(`Missing H1: ${metrics.missingH1}`);
console.log(`Missing OG tags: ${metrics.missingOgTags}`);
for (const item of errors) console.error(`ERROR ${item}`);
for (const item of warnings) console.warn(`WARN  ${item}`);
process.exitCode = errors.length ? 1 : 0;
