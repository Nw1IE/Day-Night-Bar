Для текущих SEO-изменений нужен только frontend-контейнер: изменены `client/index.html`, компоненты и файлы в `client/public`. Backend и Nginx трогать не нужно.

Рабочий процесс я бы сделал таким.

На локальном компьютере сначала проверяете сборку, затем фиксируете изменения в Git и отправляете их в удалённый репозиторий:

```powershell
cd ...

npm --prefix client run build
npm --prefix client run check:seo

коммит
```

На VDS переходите в каталог проекта и сначала убеждаетесь, что там нет незакоммиченных правок:

```bash
cd /var/www/bar/...

git status --short
git pull --ff-only
```

`--ff-only` полезен: он не создаёт автоматических merge-коммитов и остановится, если серверная копия отличается от репозитория. Это особенно важно в вашем случае, потому что на VDS раньше могли оставаться незапушенные рабочие правки.

Затем для текущего SEO-обновления пересобираете и перезапускаете только клиент:

```bash
docker compose up -d --build --no-deps frontend
docker compose ps
docker compose logs --tail=50 frontend
```

После этого проверьте публичные адреса:

```bash
curl -I https://day-night-bar.ru/
curl -i https://day-night-bar.ru/robots.txt
curl -i https://day-night-bar.ru/sitemap.xml
curl -i https://day-night-bar.ru/llms.txt
```

Системный Nginx на VDS обновлять или перезапускать не нужно, если вы не меняли его конфигурацию, домен, сертификат или reverse proxy. Контейнер `frontend` внутри проекта использует свой Nginx и получит новые статические файлы при пересборке.

Ориентир для будущих обновлений:

| Изменение | Команда на VDS |
|---|---|
| Только `client/` | `docker compose up -d --build --no-deps frontend` |
| Только `server/` | `docker compose up -d --build --no-deps backend` |
| Клиент и сервер | `docker compose up -d --build frontend backend` |
| `docker-compose.yml`, общая инфраструктура | `docker compose config --quiet`, затем `docker compose up -d --build` |
| Конфигурация системного Nginx | `sudo nginx -t && sudo systemctl reload nginx` |
| Сертификат Certbot | Обычно ничего: продление автоматическое; после изменения конфигурации — `sudo certbot renew --dry-run` |

Не используйте для обычного деплоя `docker compose down`: он создаёт лишний простой. Также не используйте `git reset --hard` на VDS как стандартный способ обновления — он может уничтожить важные правки, которые не были отправлены в Git.

Для следующего SEO-этапа вам будет достаточно повторять именно клиентский сценарий.