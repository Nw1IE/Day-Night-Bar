# День / Ночь

Современный одностраничный веб‑сайт для бара с интерактивным меню, разделом акций, объявлений и встроенной административной панелью для управления контентом в реальном времени.

---

## Технологический стек

* **Frontend:** JavaScript, HTML5, CSS3, Vite 6.
* **Backend:** ASP.NET Core, Entity Framework Core 9.
* **База данных:** PostgreSQL 16+.
* **Безопасность:** HttpOnly JWT Cookies, Rate Limiting (по IP), IP Ban Middleware от брутфорса, автоматическая поддержка Reverse Proxy.

---

## Как это работает

Все данные на сайте загружаются напрямую из PostgreSQL через REST API:
1. **Меню (`/api/menu`)** – автоматическая фильтрация по категориям.
2. **Акции (`/api/promotions`)** – выдаёт только активные акции.
3. **Объявления (`/api/announcements/current`)** – последняя актуальная запись.
4. **Админка** – защита через JWT‑куки, блокировка IP после 5 неверных попыток ввода пароля.

---

## Развёртывание проекта с помощью Docker

### 1. Предварительные требования

* VPS с Ubuntu 22.
* Доступ по SSH.
* Домен, привязанный к IP‑адресу VPS.  
* Установленный Docker и Docker‑Compose (скрипт ниже установит их автоматически).

### 2. Установка Docker и Docker‑Compose на сервере
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```
> После выполнения команды `newgrp docker` перезапустите SSH‑сессию, если необходимо.

### 3. Клонирование репозитория и подготовка `.env`
```bash
# Перейти в каталог, где будет размещён проект
sudo mkdir -p /var/www/bar && sudo chown $USER:$USER /var/www/bar
cd /var/www/bar

# Клонировать ваш репозиторий (замените URL на ваш)
git clone https://github.com/youruser/BarSite.git
cd BarSite/Web-Cite-Project

# Создать .env файлы (скопировать из .env.example и заполнить секреты)
cp server/.env.example server/.env
cp client/.env.example client/.env
# Отредактировать их: nano server/.env && nano client/.env
```

### 4. Проверка `.dockerignore`
Убедитесь, что в корне проекта существует файл `.dockerignore` и в нём указаны строки `client/.env` и `server/.env`. Это гарантирует, что секреты не попадут в образ.
```bash
cat .dockerignore
# Ожидаемый вывод:
client/.env
server/.env
.git
node_modules
```

### 5. Сборка и запуск контейнеров
```bash
# Запустить все сервисы в фоне, собрать образы при первом запуске
docker compose up -d --build
```
Команда создаст три контейнера:
* **backend** – .NET‑приложение, слушает порт 5000 внутри Docker‑сети.
* **frontend** – Nginx, обслуживает статические файлы из `client/dist` на порту 80.
* **db** – PostgreSQL, данные сохраняются в volume `db_data`.

Проверьте статус:
```bash
docker compose ps
```
Все сервисы должны иметь статус `Up`.

### 6. Получение SSL‑сертификата и настройка обратного прокси
Для HTTPS удобно использовать Certbot на хосте и оставить Nginx внутри Docker только для обслуживания статики и проксирования API.
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
# Открыть порты в firewall (если используете ufw)
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Получить сертификат для вашего домена
sudo certbot --nginx -d вашдомен.ru -d www.вашдомен.ru
```
Certbot автоматически создаст конфигурацию Nginx, которая будет проксировать запросы к контейнерам:
* `http://127.0.0.1:80` → контейнер **frontend**
* `http://127.0.0.1:5000` → контейнер **backend**

### 7. Тестирование развернутого сайта
```bash
# Проверка доступности API
curl -s https://вашдомен.ru/api/health | jq .
# Открываем в браузере https://вашдомен.ru – должна отобразиться главная страница SPA.
```
Если всё работает, проект успешно развернут.

### 8. Обновление кода
При необходимости добавить новые изменения:
```bash
cd /var/www/bar/BarSite/Web-Cite-Project
git pull
docker compose up -d --build   # пересобрать образы и перезапустить сервисы
```

### SEO и проверка домена

В SEO-разметке указан основной адрес `https://day-night-bar.ru/`.
После подключения DNS и HTTPS проверьте, что HTTP и другие используемые
варианты домена перенаправляют на него. Настройки внешнего прокси и TLS
зависят от конфигурации VDS и клиентской сборкой не меняются.

Перед обновлением сравните код на сервере с репозиторием и сохраните все
локальные изменения: пересборка frontend создаст образ из кода на VDS и
может заменить работающую версию, если она отличается от репозитория.
Для проверки клиентской сборки в окружении с Node.js выполните:

```bash
cd client
npm ci
npm run build
npm run check:seo
cd ..
```

Эта проверка читает только файлы `client/dist`: она не проверяет работу API,
настройки VDS или индексацию поисковыми системами.
После получения изменений и проверки кода клиент можно пересобрать отдельно:

```bash
docker compose up -d --build --no-deps frontend
docker compose ps
curl -I https://day-night-bar.ru/
curl -i https://day-night-bar.ru/robots.txt
curl -i https://day-night-bar.ru/sitemap.xml
curl -I https://day-night-bar.ru/nesushchestvuyushchaya-stranitsa
```

Главная страница и SEO-файлы должны возвращать HTTP 200, несуществующий
адрес — HTTP 404. Проверьте также меню, изображения и админку. Добавьте
`https://day-night-bar.ru/sitemap.xml` в Яндекс Вебмастер и Google Search
Console. При изменении контактов обновляйте исходный HTML, структурированные
данные и компонент `client/components/footer.js`.

---

## Быстрый запуск для разработки (без Docker)
```bash
# База данных
docker run -d --name barsite-db -e POSTGRES_USER=barsite_user -e POSTGRES_PASSWORD=секрет -e POSTGRES_DB=barsite_db -p 5432:5432 postgres:16-alpine

# Backend
cd server
dotnet run

# Frontend
cd ../client
npm install
npm run dev
```
