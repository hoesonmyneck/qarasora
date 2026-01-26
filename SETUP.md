# Руководство по установке и запуску Qarasora

## Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 14 или выше)
- npm или yarn

## Установка

### 1. Установка PostgreSQL

Если у вас еще не установлен PostgreSQL:

**Windows:**
```bash
# Скачайте установщик с https://www.postgresql.org/download/windows/
# Или используйте Chocolatey:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Создание базы данных

```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE qarasora;

# Выйдите
\q
```

### 3. Установка зависимостей

```bash
# Установка зависимостей фронтенда
npm install

# Установка зависимостей бекенда
cd backend
npm install
cd ..
```

### 4. Настройка переменных окружения

Файлы `.env` уже созданы в корне проекта и в папке `backend/`. Проверьте и при необходимости измените настройки базы данных в `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres  # Укажите ваш пароль
DB_NAME=qarasora
```

### 5. Инициализация базы данных

```bash
cd backend
npm run init-db
```

Это создаст все необходимые таблицы и добавит тестовые данные:
- **Админ:** username=`admin`, password=`admin`
- **Пользователь:** username=`user`, password=`user`

## Запуск

### Вариант 1: Запуск в режиме разработки

Откройте **два терминала**:

**Терминал 1 - Бекенд:**
```bash
cd backend
npm run dev
```
Сервер запустится на http://localhost:3001

**Терминал 2 - Фронтенд:**
```bash
npm run dev
```
Фронтенд запустится на http://localhost:5173

### Вариант 2: Запуск в production режиме

**Бекенд:**
```bash
cd backend
npm start
```

**Фронтенд:**
```bash
npm run build
npm run preview
```

## Использование

1. Откройте браузер и перейдите на http://localhost:5173
2. Перейдите в раздел "Портал" (http://localhost:5173/portal)
3. Войдите с учетными данными:
   - Админ: `admin` / `admin`
   - Пользователь: `user` / `user`

### Возможности админа

- ✅ Создание новых новостей
- ✅ Добавление ферм/хозяйств на карту
- ✅ Загрузка документов
- ✅ Создание новых пользователей
- ✅ Просмотр всех данных

### Возможности обычного пользователя

- ✅ Просмотр новостей
- ✅ Просмотр ферм на карте
- ✅ Скачивание документов

## API Endpoints

Полная документация API доступна в файле `backend/README.md`

Основные endpoints:
- `POST /api/auth/login` - Вход
- `GET /api/news` - Список новостей
- `GET /api/farms` - Список ферм
- `GET /api/documents` - Список документов

## Решение проблем

### Ошибка подключения к базе данных

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Решение:** Убедитесь, что PostgreSQL запущен:
```bash
# Windows
# Проверьте службу PostgreSQL в диспетчере задач

# macOS
brew services list
brew services restart postgresql

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Порт уже занят

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Решение:** Измените порт в `backend/.env`:
```env
PORT=3002
```

И обновите `VITE_API_URL` в `.env` корневой директории:
```env
VITE_API_URL=http://localhost:3002/api
```

### CORS ошибки

Если возникают CORS ошибки, проверьте, что фронтенд запущен на порту 5173, или обновите настройку CORS в `backend/server.js`.

## Структура проекта

```
qarasora/
├── backend/                 # Backend API
│   ├── config/             # Конфигурация базы данных
│   ├── middleware/         # Express middleware
│   ├── routes/             # API маршруты
│   ├── scripts/            # Скрипты инициализации
│   ├── uploads/            # Загруженные файлы
│   ├── server.js           # Основной файл сервера
│   └── package.json
├── src/                    # Frontend Vue приложение
│   ├── pages/              # Страницы приложения
│   ├── services/           # API сервисы
│   └── ...
├── .env                    # Переменные окружения фронтенда
└── package.json
```

## Дополнительная информация

Для получения дополнительной помощи:
- Backend README: `backend/README.md`
- Frontend: стандартное Vue 3 приложение с Vite

## Production Deploy

Для развертывания на продакшн сервере:

1. Измените все пароли и секретные ключи
2. Настройте HTTPS
3. Используйте nginx как reverse proxy
4. Настройте автозапуск через systemd или PM2
5. Настройте регулярные бэкапы базы данных

Пример nginx конфигурации доступен по запросу.
