# VW Club Moldova

Статический двуязычный сайт технического сообщества владельцев Volkswagen в Молдове.

## Локальный запуск

1. Установите Node.js 22.
2. Выполните `npm ci`.
3. Запустите `npm run dev`.

Локальный редактор статей: `npm run cms`. Production остаётся статическим и не содержит Keystatic UI.

## Проверка

- `npm run build` — собрать `dist/`;
- `npm run preview` — локально открыть production-сборку;
- `npm run audit:seo` — проверить метаданные, ссылки и sitemap;
- `npm run audit:schema` — проверить JSON-LD.

Начинайте знакомство с [PROJECT_MAP.md](PROJECT_MAP.md), принятые решения находятся в [DECISIONS.md](DECISIONS.md), незакрытые данные — в [TODO.md](TODO.md).
