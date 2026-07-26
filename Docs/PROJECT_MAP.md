# Карта проекта VW Club Moldova

Актуально: 2026-07-26.

## Проект одним экраном

Astro 6 генерирует статический RU/RO-сайт в `dist/`. Русский язык расположен в корне, румынский — в `/ro/`. Статьи хранятся в Markdown и локально редактируются через Keystatic. Страницы моделей формируются из поля `model`. Production-публикация подготовлена через GitHub Actions и FTP, но не выполнялась.

## Дерево

```text
.github/workflows/deploy.yml
public/
scripts/
src/
  components/
  content/articles/{ru,ro}/
  layouts/
  lib/seo/
  pages/
  styles/
Docs/
README.md
PROJECT_MAP.md
DECISIONS.md
TODO.md
```

## Логика → файл → заметки

| Логика | Файл | Заметки |
|---|---|---|
| бренд, ссылки, i18n | `src/lib/i18n.ts` | клубные каналы подтверждены владельцем |
| схема контента | `src/content.config.ts` | RU/RO коллекции |
| редактор | `keystatic.config.ts` | только локально |
| SEO и общий HTML | `src/layouts/BaseLayout.astro` | canonical, hreflang, OG |
| Schema.org | `src/lib/seo/schema.ts` | единый связанный `@graph` |
| статьи | `src/content/articles/` | одинаковый slug для переводов |
| страницы моделей | `src/components/pages/ModelPage.astro` | генерируются из тегов |
| аудит | `scripts/audit-*.mjs` | проверяет готовый `dist` |
| deploy | `.github/workflows/deploy.yml` | требует secrets и variable |

## Карта документов

- `DECISIONS.md` — принятые решения;
- `Docs/DESIGN.md` — визуальная система;
- `Docs/CONTENT_MODEL.md` — поля контента;
- `Docs/EDITORIAL_GUIDELINES.md` — правила публикации;
- `Docs/SEO-GEO-AI.md` — SEO и Schema;
- `Docs/DEPLOY.md` — безопасная публикация;
- `Docs/IMAGE_SOURCES.md` — реестр изображений;
- `TODO.md` — данные владельца.

## Задача → что читать

| Задача | Файлы |
|---|---|
| изменить навигацию или тексты UI | `src/lib/i18n.ts`, соответствующий компонент |
| добавить статью | `Docs/CONTENT_MODEL.md`, `Docs/EDITORIAL_GUIDELINES.md` |
| изменить SEO | `src/layouts/BaseLayout.astro`, `src/lib/seo/schema.ts`, `Docs/SEO-GEO-AI.md` |
| подготовить публикацию | `Docs/DEPLOY.md`, `.github/workflows/deploy.yml`, `TODO.md` |

## Рабочий цикл

Изменение → `npm run build` → оба аудита → проверка RU/RO → обновление документов. При изменении структуры обновить этот файл; при новом существенном решении — `DECISIONS.md`.

## Подводные камни

- не переносить Audi-контент и изображения;
- не добавлять неподтверждённые контакты, статистику, цены и промокоды;
- не включать Keystatic в production;
- не удалять `trailingSlash: "always"`;
- не публиковать без проверки FTP Document Root.
