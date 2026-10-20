# 🍸 «День / Ночь» — Веб-сайт бара с админ-панелью

Современный одностраничный веб-сайт для бара с интерактивным меню, разделом актуальных акций, бегущей строкой объявлений и встроенной административной панелью для управления контентом в реальном времени.

---

## Технологический стек

* **Frontend:** JavaScript, HTML5, CSS3, Vite 6.
* **Backend:** ASP.NET Core (.NET 10 Web API), Entity Framework Core 9.
* **База данных:** PostgreSQL 16+.
* **Безопасность:** HttpOnly JWT Cookies, Rate Limiting (по IP), IP Ban Middleware от брутфорса, автоматическая поддержка Reverse Proxy (Nginx / Docker).

---

## Как это работает

Все данные на сайте загружаются напрямую из PostgreSQL через REST API:
1. **Меню (`/api/menu`):** Автоматическая фильтрация по категориям (Коктейли, Вино, Пиво, Закуски, Основные блюда, Десерты). Любые добавления, редактирования и удаления сразу отображаются у гостей.
2. **Акции (`/api/promotions`):** Публичный эндпоинт отдает только **активные** акции (`StartDate <= Now < EndDate`). Админский эндпоинт (`/api/promotions/all`) отображает все созданные акции.
3. **Объявления (`/api/announcements/current`):** Выводит последнее актуальное объявление на главной странице.
4. **Админка и безопасность:** 
   - Вход в панель админа защищен секретным шлюзом (`AUTH_GATEWAY_PATH`) и ключом клиента.
   - Авторизация работает через безопасную куку `AdminAuth` (`HttpOnly`, `SameSite=Lax`).
   - Если 5 раз подряд ввести неверный пароль, IP-адрес нарушителя блокируется на 24 часа. При этом локальные адреса (`127.0.0.1`) аппаратно защищены от блокировки.

---

## Настройка переменных окружения (.env)

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

> **Важно:** При первом запуске сервер сам применит миграции к базе данных и создаст учетную запись администратора с хэшем из `ADMIN_PASSWORD`. Для смены пароля достаточно изменить его в `.env` и перезапустить сервер.

### 2. Клиент (`client/.env`)
```ini
VITE_API_URL=/api
VITE_IMAGES_URL=/imgs
VITE_GATEWAY_PATH=l1og9in_enter04
VITE_ADMIN_CLIENT_KEY=SuperSecretAppKey123!
```

---

## 🚀 Быстрый запуск для разработки

### Шаг 1: Запуск базы данных
Убедитесь, что служба PostgreSQL запущена, и создайте базу данных `barDb`.

### Шаг 2: Запуск сервера
```bash
cd server
dotnet restore
dotnet run
```
*Сервер запустится на `http://localhost:5101`. Таблицы и начальные данные создадутся автоматически.*

### Шаг 3: Запуск клиента
```bash
cd client
npm install
npm run dev
```
*Сайт откроется на `http://localhost:5173`. Vite автоматически проксирует запросы `/api` и `/imgs` на бэкенд.*

---

## 🌐 Руководство по развёртыванию на хостинг

Самый стабильный и рекомендуемый вариант для продакшена — размещение на Linux VPS (Ubuntu) с Nginx в качестве реверс-прокси.

### 1. Сборка фронтенда:
```bash
cd client
npm run build
```
Вся готовая статика будет собрана в папку `client/dist`. Её содержимое копируется в веб-директорию на сервере (например, `/var/www/bar/html`).

### 2. Сборка бэкенда:
```bash
cd server
dotnet publish -c Release -o /var/www/bar/backend
```
Запуск бэкенда на сервере настраивается как `systemd`-сервис (или через Docker), слушающий локальный порт `http://127.0.0.1:5000`.

### 3. Пример конфигурации Nginx (`/etc/nginx/sites-available/bar`):
```nginx
server {
    listen 80;
    server_name mybar.ru www.mybar.ru;

    # 1. Отдача статики фронтенда (HTML/CSS/JS/картинки)
    location / {
        root /var/www/bar/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 2. Проксирование API-запросов на .NET бэкенд
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

*При такой схеме фронтенд и бэкенд работают на одном домене: исключаются любые проблемы с CORS, а куки авторизации работают с максимальной безопасностью.*