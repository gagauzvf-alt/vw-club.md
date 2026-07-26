# Публикация: GitHub Actions → FTP → cPanel

Актуально: 2026-07-26. Production deploy не выполнялся.

## Что делает workflow

При push в `main` устанавливает зависимости через lockfile, собирает Astro, запускает SEO/Schema-аудиты и передаёт содержимое `dist/` по FTP.

## Настройка GitHub

В production environment создайте secrets:

- `FTP_SERVER`;
- `FTP_USERNAME`;
- `FTP_PASSWORD`.

Создайте environment variable `FTP_SERVER_DIR`. Значение должен подтвердить хостинг или владелец. `./` допустим только когда FTP-пользователь действительно привязан к Document Root именно `vw-club.md`.

## Перед первым deploy

1. Подтвердить FTP-аккаунт, IP/host и Document Root.
2. Убедиться, что пользователь не видит каталоги соседних доменов.
3. Защитить environment `production` ручным approval.
4. Локально выполнить build и оба аудита.
5. Сначала проверить тестовую публикацию либо резервную копию Document Root.

Workflow не содержит паролей и не должен удалять каталоги выше Document Root.
