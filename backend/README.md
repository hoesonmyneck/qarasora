# Qarasora Backend API

Backend сервер для системы Qarasora с авторизацией, управлением новостями, фермами и документами.

## Установка

```bash
# Установить зависимости
npm install

# Настроить переменные окружения
cp .env.example .env
# Отредактировать .env файл с вашими настройками

# Инициализировать базу данных
npm run init-db

# Запустить сервер в режиме разработки
npm run dev

# Или запустить в production режиме
npm start
```

## API Endpoints

### Авторизация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход из системы
- `GET /api/auth/me` - Получить информацию о текущем пользователе

### Пользователи (только для админа)
- `POST /api/users` - Создать нового пользователя
- `GET /api/users` - Получить список пользователей
- `DELETE /api/users/:id` - Удалить пользователя

### Новости
- `GET /api/news` - Получить все новости
- `GET /api/news/:id` - Получить новость по ID
- `POST /api/news` - Создать новость (только админ)
- `PUT /api/news/:id` - Обновить новость (только админ)
- `DELETE /api/news/:id` - Удалить новость (только админ)

### Фермы
- `GET /api/farms` - Получить все фермы
- `GET /api/farms/:id` - Получить ферму по ID
- `POST /api/farms` - Создать ферму (только админ)
- `PUT /api/farms/:id` - Обновить ферму (только админ)
- `DELETE /api/farms/:id` - Удалить ферму (только админ)

### Документы
- `GET /api/documents` - Получить список документов
- `GET /api/documents/:id` - Получить информацию о документе
- `GET /api/documents/:id/download` - Скачать файл документа
- `POST /api/documents` - Загрузить документ (только админ)
- `DELETE /api/documents/:id` - Удалить документ (только админ)

## Технологии

- Node.js + Express
- PostgreSQL
- JWT для авторизации
- Multer для загрузки файлов
- bcryptjs для хеширования паролей
