import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const imageDirectories = ['public/images/articles', 'public/images/partner'];

for (const relativeDirectory of imageDirectories) {
  const directory = path.join(root, relativeDirectory);
  const files = await fs.readdir(directory);

  for (const file of files.filter((name) => name.endsWith('.webp') && !name.endsWith('-640.webp'))) {
    const source = path.join(directory, file);
    const target = path.join(directory, file.replace(/\.webp$/, '-640.webp'));
    await sharp(source)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(target);
  }
}

const heroFormats = [
  { extension: 'avif', options: { quality: 55, effort: 5 } },
  { extension: 'webp', options: { quality: 76, effort: 5 } },
  { extension: 'jpg', options: { quality: 78, mozjpeg: true } },
];

for (const { extension, options } of heroFormats) {
  const source = path.join(root, `public/images/hero-1440.${extension}`);
  const target = path.join(root, `public/images/hero-640.${extension}`);
  const pipeline = sharp(source).resize({ width: 640, withoutEnlargement: true });
  await pipeline[extension === 'jpg' ? 'jpeg' : extension](options).toFile(target);
}

console.log('Responsive 640 px image variants generated.');
