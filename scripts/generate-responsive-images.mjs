import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = path.join(root, 'images');
const targets = {
  articles: [
    'vw_passat_b8_2.0TDI_2018_01.jpg', 'vw_passat_b8_2.0TDI_2018_02.jpg',
    'vw_golf_2013.jpg', 'vw_golf_2013_01.jpg', 'vw_golf_2013_02.jpg',
    'vw_golf_2015.jpg', 'vw_golf_2015_02.jpg', 'vw_golf_GTE_2015.jpg',
    'vw_tiguan_2017.jpg', 'vw_tiguan_2017_02.jpg',
    'vw_tiguan_se_2018_usa_01.jpg', 'vw_tiguan_se_2018_usa_02.jpg',
    'vw_transporter_01.jpg', 'vw_transporter_02.jpg',
    'vw_toareg_3.0tdi_2011_01.jpg', 'vw_toareg_3.0tdi_2011_02.jpg',
    'vw_tiguan_2012_2.0TSi_usa_01.jpg', 'vw_tiguan_2012_2.0TSi_usa_02.jpg',
    'vw_tiguan_2012_2.0TSi_usa_03.jpg',
    'vw_T-Roc_2019.jpg', 'vw_T-Roc_2019_02.jpg', 'vw_T-Roc_2019_03.jpg',
    'vw_jetta_2018.jpg', 'vw_jetta_2018_2.jpg', 'vw_golf6_R_2013_01.jpg',
    'vw_scirocco_2009_01.jpg', 'vw_scirocco_2009_02.jpg',
    'vw_amarok3.0TDI2018__01.jpg', 'vw_amarok3.0TDI2018__02.jpg',
    'vw_amarok_2.0TDI_2012.jpg',
  ],
  partner: ['vw_service_01.jpg', 'vw_autoservice_02.jpg', 'vw_autoservice_03.jpg'],
  home: ['vw_logo.jpg'],
};

for (const [group, files] of Object.entries(targets)) {
  const directory = path.join(root, 'public/images', group);
  await fs.mkdir(directory, { recursive: true });
  for (const file of files) {
    const source = path.join(sourceRoot, file);
    const basename = path.parse(file).name.toLowerCase();
    for (const width of [1200, 640]) {
      await sharp(source)
        .rotate()
        .resize({
          width,
          height: group === 'home' ? Math.round(width * 0.67) : undefined,
          fit: 'cover',
          position: 'centre',
          withoutEnlargement: true,
        })
        .webp({ quality: width === 1200 ? 82 : 76, effort: 5 })
        .toFile(path.join(directory, `${basename}${width === 640 ? '-640' : ''}.webp`));
    }
  }
}

console.log('Desktop and mobile WebP image variants generated.');
