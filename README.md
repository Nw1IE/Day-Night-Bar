# "День / Ночь" — Веб‑сайт бара

Современный одностраничный веб‑сайт для бара с интерактивным меню, разделом актуальных акций, бегущей строкой объявлений и встроенной административной панелью для управления контентом в реальном времени.

---

## Технологический стек

* **Frontend:** JavaScript, HTML5, CSS3, Vite 6.
* **Backend:** ASP.NET Core, Entity Framework Core 9.
* **База данных:** PostgreSQL 16+.
* **Безопасность:** HttpOnly JWT Cookies, Rate Limiting (по IP), IP Ban Middleware от брутфорса, автоматическая поддержка Reverse Proxy (Nginx / Docker).

---

## Как это работает

Все данные на сайте загружаются напрямую из PostgreSQL через REST API:
1. **Меню (`/api/menu`)** – автоматическая фильтрация по категориям.
2. **Акции (`/api/promotions`)** – выдаёт только активные акции.
3. **Объявления (`/api/announcements/current`)** – последняя актуальная запись.
4. **Админка** – защита через JWT‑куки, блокировка IP после 5 неверных попыток ввода пароля.

---

## Настройка переменных окружения

Перед запуском создайте файлы `.env` в папках `client` и `server` (на основе `.env.example`).

### 1. Сервер (`server/.env`)
```ini
DATABASE_CONNECTION_STRING=Host=localhost;Port=5432;Database=barDb;Username=postgres;Password=ВашПароль
AUTH_GATEWAY_PATH=l1og9in_enter04
ADMIN_PASSWORD=ВашНадежныйПарольАдмина
ADMIN_CLIENT_KEY=SuperSecretAppKey123!
JWT_KEY=СуперСекретныйКлючМинимум32Символа12345!
JWT_ISSUER=BarServer
JWT_AUDIENCE=BarClient
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
COOKIE_SAME_SITE=lax
```

### 2. Клиент (`client/.env`)
```ini
VITE_API_URL=/api
VITE_IMAGES_URL=/imgs
VITE_GATEWAY_PATH=l1og9in_enter04
VITE_ADMIN_CLIENT_KEY=SuperSecretAppKey123!
```

---

## Развёртывание проекта с помощью Docker

### 1. Предварительные требования

* VPS с Ubuntu 22.04 (или любой современной Linux‑дистрибутив).
* Доступ по SSH.
* Домен, привязанный к IP‑адресу VPS (A‑запись).  
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

---

*Весь исходный код находится в этом репозитории. При необходимости откройте `docker-compose.yml`, `server/Dockerfile` и `client/Dockerfile` для изменения деталей сборки.*