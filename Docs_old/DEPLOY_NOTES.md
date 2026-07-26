# Деплой на cPanel: грабли и решения

Этот документ — памятка для будущих сайтов (vw-club.md, skoda-club.md, и любых других на этом хостинге). Написан после того, как настройка деплоя audi-club.md заняла полдня из-за трёх неочевидных проблем.

---

## Грабля 1: FTP-сервер — это IP, а не имя домена

**Проблема.** cPanel в разделе «Configure FTP Client» показывает FTP-сервер как `ftp.chisinau.in` (по Primary Domain аккаунта). Это имя **не резолвится** в DNS — подключиться к нему невозможно. GitHub Actions падает с ошибкой `ENOTFOUND`.

**Решение.** Использовать **Shared IP Address** сервера, а не доменное имя:

```
FTP_SERVER = 185.181.230.90
```

Где взять: cPanel → боковая панель → **Shared IP Address** (или Server Information).

**Проверка перед использованием:** в CMD на Windows выполнить `nslookup <адрес>` — если резолвится, адрес рабочий. IP-адрес резолвить не нужно, он работает всегда.

---

## Грабля 2: FTP-аккаунт создаёт вложенную папку, а не пишет в корень домена

**Проблема.** При создании FTP-аккаунта через cPanel в поле **Directory** автоматически подставляется путь с вложенной папкой, например:

```
/home/chisinau/audi-club.md/deploy
```

Если не заметить и не исправить, FTP-аккаунт при входе попадает в `deploy/`, а не в корень домена. Файлы сайта оказываются на уровень глубже, чем Document Root, и домен показывает «Index of /» вместо сайта.

**Решение.** При создании FTP-аккаунта в cPanel **вручную** очистить поле Directory и вписать путь **ровно до папки домена**, без вложенных подпапок:

```
/home/chisinau/audi-club.md
```

Тогда FTP-аккаунт входит прямо в Document Root, и `server-dir` в workflow = `./`.

**Как проверить, куда входит FTP-аккаунт:** cPanel → FTP Accounts → у нужного аккаунта посмотреть поле **Path**. Если там `/home/chisinau/audi-club.md` — правильно. Если `/home/chisinau/audi-club.md/deploy` или другая вложенная папка — исправить (удалить аккаунт, создать заново с правильным путём).

---

## Грабля 3: Git создаёт ветку master, а GitHub ждёт main

**Проблема.** Git на Windows по умолчанию создаёт ветку `master`. GitHub и наш workflow (`deploy.yml`) работают с веткой `main`. Если Claude Code (или любой другой инструмент) делает коммит, он попадает в `master`. Push уходит в `master` на GitHub, но деплой **не запускается**, потому что workflow слушает только `main`:

```yaml
on:
  push:
    branches: [main]   # ← master сюда не попадает
```

В GitHub Desktop это выглядит как «Detached HEAD» или «Cannot publish detached HEAD», а на сайте GitHub появляется Pull Request из `master` в `main` вместо прямого деплоя. Коммиты есть, а сайт не обновляется.

**Решение.** Настроить Git один раз, чтобы по умолчанию создавал `main`:

```
git config --global init.defaultBranch main
```

**Проверка и исправление, если проблема уже возникла:**

1. Посмотреть текущую ветку: `git branch --show-current`
   - Если `master` — переключиться: `git checkout main`
2. Удалить лишнюю локальную ветку: `git branch -d master`
3. Убедиться, что origin смотрит на main: `git remote show origin`

**Как не повторить:**
- После `git config --global init.defaultBranch main` все новые репозитории будут создаваться с веткой `main`.
- В задании Claude Code всегда указывать: «Коммить в ветку main».
- В GitHub Desktop после любого коммита проверять: вверху по центру должно быть **Current branch: main**, а не master или Detached HEAD.

---

## Итоговая конфигурация audi-club.md

| Параметр | Значение |
|---|---|
| Хостинг | cPanel на web5.innovahosting.net |
| Primary Domain аккаунта | chisinau.in |
| Тип домена audi-club.md | Addon Domain |
| Document Root | /home/chisinau/audi-club.md |
| Shared IP | 185.181.230.90 |
| FTP-аккаунт | deploy@audi-club.md |
| FTP-путь аккаунта | /home/chisinau/audi-club.md (= Document Root) |

### Секреты GitHub Actions (Settings → Secrets → Actions)

| Секрет | Что вписывать |
|---|---|
| `FTP_SERVER` | `185.181.230.90` (Shared IP, **не** доменное имя) |
| `FTP_USERNAME` | `deploy@audi-club.md` (полное имя с доменом) |
| `FTP_PASSWORD` | пароль FTP-аккаунта |

### deploy.yml — ключевые строки

```yaml
on:
  push:
    branches: [main]    # деплой только из main, не master

local-dir: ./dist/       # результат сборки Astro (статика)
server-dir: ./            # корень = Document Root домена
```

---

## Чек-лист для нового клубного сайта (vw-club.md, skoda-club.md)

1. **Git.** Убедиться, что `git config --global init.defaultBranch` = `main`. Если нет — настроить (см. Грабля 3).
2. **Создать Addon Domain** в cPanel. Запомнить Document Root (обычно `/home/chisinau/<домен>`).
3. **Создать FTP-аккаунт** (например `deploy@<домен>`). В поле Directory **убрать** автоподставленную вложенную папку — вписать ровно Document Root (см. Грабля 2).
4. **Секреты GitHub Actions:**
   - `FTP_SERVER` = `185.181.230.90` (один IP на все сайты этого аккаунта, см. Грабля 1)
   - `FTP_USERNAME` = `deploy@<домен>` (полное имя)
   - `FTP_PASSWORD` = пароль
5. **deploy.yml:** `server-dir: ./` (если FTP-аккаунт привязан к Document Root), ветка `main`.
6. **Первый push:** в GitHub Desktop убедиться, что Current branch = **main**. Закоммитить → Push origin.
7. **Проверка:** после деплоя открыть File Manager и убедиться, что `index.html` лежит **в корне** папки домена, а не во вложенной подпапке. Открыть сайт в браузере.
