import type { Locale } from './i18n';

export interface ArticleMediaItem {
  src: string;
  alt: Record<Locale, string>;
  caption?: Record<Locale, string>;
  credit?: string;
}

// Реестр намеренно пуст: изображения добавляются только после проверки лицензии.
export const articleMedia: Record<string, ArticleMediaItem[]> = {};
export const mediaForArticle = (id: string) => articleMedia[id] ?? [];
