export const imageVariant = (src: string, width: 640 | 960) =>
  src.replace(/(\.[a-z0-9]+)$/i, `-${width}$1`);

export const mobileImageSrc = (src: string) => imageVariant(src, 640);

export const imageSrcset = (src: string) =>
  `${imageVariant(src, 640)} 640w, ${imageVariant(src, 960)} 960w, ${src} 1200w`;

export const avifSrc = (src: string) => src.replace(/\.webp$/i, '.avif');

export const avifSrcset = (src: string) => {
  const avif = avifSrc(src);
  return `${imageVariant(avif, 640)} 640w, ${imageVariant(avif, 960)} 960w, ${avif} 1200w`;
};
