import { config, collection, fields } from '@keystatic/core';

// ADR-004: Keystatic — только локально (npm run cms), в прод-сборку не попадает.
// ADR-003: отдельные коллекции per-locale.

const articleFields = {
  title: fields.slug({ name: { label: 'Заголовок' } }),
  date: fields.date({ label: 'Дата публикации', validation: { isRequired: true } }),
  model: fields.array(fields.text({ label: 'Модель' }), {
    label: 'Модели (например: Q5 8R, A4 B8)',
    itemLabel: (props) => props.value,
  }),
  engine: fields.array(fields.text({ label: 'Двигатель' }), {
    label: 'Двигатели (например: 2.0 TFSI) — опционально',
    itemLabel: (props) => props.value,
  }),
  years: fields.text({ label: 'Годы (например: 2008–2016)' }),
  type: fields.select({
    label: 'Тип статьи',
    options: [
      { label: 'Типичные проблемы', value: 'проблемы' },
      { label: 'Обслуживание', value: 'обслуживание' },
      { label: 'Кейс', value: 'кейс' },
      { label: 'Гайд', value: 'гайд' },
    ],
    defaultValue: 'проблемы',
  }),
  cover: fields.text({ label: 'Обложка (путь, например /images/q5.webp)' }),
  description: fields.text({ label: 'Описание для SEO/OG', multiline: true, validation: { isRequired: true } }),
  draft: fields.checkbox({ label: 'Черновик (не публиковать)', defaultValue: false }),
  content: fields.markdoc({ label: 'Текст статьи', extension: 'md' }),
};

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'VW Club Moldova — Журнал' } },
  collections: {
    articles_ru: collection({
      label: 'Статьи (RU)',
      slugField: 'title',
      path: 'src/content/articles/ru/*',
      format: { contentField: 'content' },
      schema: articleFields,
    }),
    articles_ro: collection({
      label: 'Статьи (RO)',
      slugField: 'title',
      path: 'src/content/articles/ro/*',
      format: { contentField: 'content' },
      schema: articleFields,
    }),
  },
});
