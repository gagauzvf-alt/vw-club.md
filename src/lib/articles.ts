import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';
import { modelSlug } from './i18n';

export type Article = CollectionEntry<'articles_ru'> | CollectionEntry<'articles_ro'>;

export async function getArticles(locale: Locale): Promise<Article[]> {
  const collection = locale === 'ru' ? 'articles_ru' : 'articles_ro';
  const items = await getCollection(collection, ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export interface ModelGroup {
  model: string; // «человеческое» имя: "Q5 8R"
  slug: string; // для URL: "q5-8r"
  articles: Article[];
}

// Ключевая GEO/SEO-механика: страницы /models/[model]/ собираются из тегов model в статьях
export async function getModelGroups(locale: Locale): Promise<ModelGroup[]> {
  const articles = await getArticles(locale);
  const map = new Map<string, ModelGroup>();
  for (const article of articles) {
    for (const model of article.data.model) {
      const slug = modelSlug(model);
      if (!map.has(slug)) map.set(slug, { model, slug, articles: [] });
      map.get(slug)!.articles.push(article);
    }
  }
  return [...map.values()].sort((a, b) => a.model.localeCompare(b.model));
}
