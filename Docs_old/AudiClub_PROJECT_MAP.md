# PROJECT_MAP — audi-club.md

Пилотный клубный сайт (первый из трёх: audi-club.md → vw-club.md → skoda-club.md).
Источник требований: `docs/BRIEF_audi-club-md.md`. Пайплайн — клон bravo-motors.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Локальный дев-сервер (без Keystatic) |
| `npm run cms` | Дев-сервер + Keystatic: редактор статей на `http://127.0.0.1:4321/keystatic/` (слэш в конце обязателен) |
| `npm run build` | Прод-сборка: чистая статика в `./dist/` |
| `npm run images:responsive` | Генерирует мобильные варианты изображений шириной до 640 px |
| `npm run preview` | Просмотр прод-сборки |

## Структура

```
astro.config.mjs          — конфиг: i18n RU/RO, trailingSlash always, sitemap;
                            Keystatic подключается только при KEYSTATIC=true
keystatic.config.ts       — коллекции редактора (articles_ru / articles_ro)
src/
  content.config.ts       — схема frontmatter статей (model/engine/years/type…)
  content/articles/ru/    — статьи RU (markdown)
  content/articles/ro/    — статьи RO (сокращённые переводы допустимы)
  lib/i18n.ts             — словарь UI-строк RU/RO, константы клуба (ссылки, промокод), хелперы путей
  lib/articles.ts         — выборка статей и группировка по моделям для /models/
  lib/articleMedia.ts     — единая RU/RO-медиакарта статей: пути, alt, подписи, атрибуция
  lib/images.ts           — формирование пути к мобильной версии изображения `*-640.*`
  styles/tokens.css       — дизайн-токены (акцентный красный меняется в ОДНОЙ переменной --c-accent)
  styles/global.css       — база: типографика, кнопки, карточки, лонгрид
  layouts/BaseLayout.astro— head: SEO/OG/hreflang/canonical + Schema.org Organization
  components/             — Header, Footer, ArticleCard, PartnerSection
  components/pages/       — тела страниц (общие для RU и RO)
  pages/                  — тонкие маршруты RU (корень) и RO (/ro/)
public/
  .htaccess               — www→без www, http→https
  favicon.svg             — ЗАГЛУШКА до работы с логотипом
  images/articles/        — оптимизированные WebP статей; временные интернет-файлы начинаются с web-
  images/partner/         — уникальные фотографии BRAVO MOTORS для двуязычной страницы партнёра
scripts/
  fetch-web-article-images.mjs — воспроизводимая загрузка и оптимизация утверждённых источников
  generate-responsive-images.mjs — генерация 640 px WebP статей/партнёра и AVIF/WebP/JPG для hero
docs/                     — БРИФ, DECISIONS (ADR), TASK_LOG
.github/workflows/deploy.yml — GitHub Actions → FTP на cPanel
```

## Как добавить статью

1. `npm run cms` → `http://127.0.0.1:4321/keystatic/` → «Статьи (RU)» → создать.
   Либо руками: markdown-файл в `src/content/articles/ru/` с frontmatter по схеме.
2. Поле `model` («Q5 8R», «A4 B8»…) автоматически создаёт/пополняет страницу `/models/<slug>/` — ключевая SEO/GEO-механика, заполнять обязательно.
3. RO-версия — файл с ТЕМ ЖЕ именем в `articles/ro/`. Совпадение имён связывает версии hreflang-парой. Нет перевода — не страшно, hreflang просто не выводится.
4. Изображения статьи описать один раз в `src/lib/articleMedia.ts` под ключом, совпадающим с именем markdown-файла без `.md`. Первый элемент становится обложкой карточки и OG-image.
5. Для временных интернет-изображений использовать SEO-имя с `web-`, WebP и обязательно обновлять `Docs/IMAGE_SOURCES.md`. Передний/задний ракурсы проверять визуально как одну машину.
6. Commit + push через GitHub Desktop → GitHub Actions соберёт и зальёт на cPanel.

## Клонирование под VW/Skoda (после приёмки пилота)

Копия репозитория; меняются: токены в `tokens.css` (цвет, при необходимости шрифты), словарь и константы в `lib/i18n.ts` (ссылки, промокод VWCLUB15/SKODACLUB15, копирайтинг), контент, логотип, favicon, `site` в astro.config, server-dir в deploy.yml.
