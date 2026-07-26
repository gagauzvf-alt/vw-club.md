import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ADR-003: отдельные коллекции per-locale (articles_ru / articles_ro) — проще редактировать, ничего не перепутать
const articleSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  // Модель(и): например "Q5 8R", "A4 B8", "A6 C7". Из этих тегов автогенерируются страницы /models/
  model: z.array(z.string()).default([]),
  // Двигатель(и): например "2.0 TFSI", "2.0 TDI CR" — опционально
  engine: z.array(z.string()).default([]),
  // Диапазон лет, строкой: "2008–2016"
  years: z.string().optional(),
  type: z.enum(['проблемы', 'обслуживание', 'кейс', 'гайд']),
  cover: z.string().optional(),
  description: z.string(), // для SEO/OG
  draft: z.boolean().default(false),
});

const articles_ru = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles/ru' }),
  schema: articleSchema,
});

const articles_ro = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles/ro' }),
  schema: articleSchema,
});

export const collections = { articles_ru, articles_ro };
