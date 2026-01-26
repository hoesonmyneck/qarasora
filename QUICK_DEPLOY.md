# ⚡ Быстрый деплой на Render

## 1️⃣ Подготовка (5 минут)

### Запустите миграции на Supabase

Если вы еще не запускали миграции:

```bash
cd backend
npm run migrate:pinned
npm run migrate:applications
npm run migrate:contacts-board
npm run migrate:images
npm run migrate:board-image
npm run migrate:settings
```

### Убедитесь что код в GitHub

```bash
git add .
git commit -m "Подготовка к деплою"
git push origin main
```

---

## 2️⃣ Деплой Backend (10 минут)

1. **Зайдите на [render.com](https://render.com)**
2. **New + → Web Service**
3. **Подключите GitHub репозиторий**
4. **Настройки:**
   - Name: `qarasora-backend`
   - Region: `Singapore`
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. **Environment Variables** (добавьте):
   ```
   DATABASE_URL=postgresql://postgres.ljhpzgqagwspiydxcdub:[ВАШ_ПАРОЛЬ]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
   JWT_SECRET=qarasora_super_secret_key_2026_change_this
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://qarasora.onrender.com
   ```
   ⚠️ **Замените `[ВАШ_ПАРОЛЬ]`** на реальный пароль от Supabase!

6. **Нажмите "Create Web Service"**

7. **Дождитесь деплоя** (~5 минут)

8. **Скопируйте URL** (например: `https://qarasora-backend.onrender.com`)

9. **Проверьте работу:**
   - Откройте: `https://qarasora-backend.onrender.com`
   - Должен вернуть JSON с информацией об API

---

## 3️⃣ Обновите CORS в Backend

1. В Render, откройте ваш backend service
2. Перейдите в "Environment"
3. Измените `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://qarasora.onrender.com
   ```

Или откройте `backend/server.js` и раскомментируйте строку:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://qarasora.onrender.com', // 👈 Раскомментируйте
];
```

Закоммитьте изменения:

```bash
git add .
git commit -m "Добавлен production URL в CORS"
git push
```

---

## 4️⃣ Деплой Frontend (10 минут)

1. **New + → Static Site**
2. **Выберите тот же репозиторий**
3. **Настройки:**
   - Name: `qarasora`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://qarasora-backend.onrender.com
   ```
   ⚠️ **Замените на ваш URL из шага 2.8**

5. **Нажмите "Create Static Site"**

6. **Дождитесь билда** (~3 минуты)

7. **Откройте URL** (например: `https://qarasora.onrender.com`)

---

## 5️⃣ Финальная проверка ✅

1. Откройте ваш сайт
2. Попробуйте авторизоваться
3. Добавьте новость с изображением
4. Загрузите документ
5. Проверьте карту

**Всё работает?** 🎉 Поздравляю!

---

## 🆘 Если что-то не работает

### Backend не отвечает
- Проверьте логи в Render Dashboard
- Убедитесь что DATABASE_URL правильный
- Проверьте что порт 3001 или process.env.PORT

### CORS ошибки
- Убедитесь что FRONTEND_URL добавлен в allowedOrigins
- Проверьте что URL без слеша в конце

### Изображения не загружаются
- На бесплатном плане нужен Persistent Disk
- Или используйте Cloudinary (см. DEPLOYMENT_GUIDE.md)

### База данных не подключается
- Проверьте что DATABASE_URL правильный
- Убедитесь что используете Transaction Pooler (порт 6543)

---

## 📊 Что дальше?

1. **Настройте кастомный домен** (например, qarasora.kz)
2. **Добавьте SSL** (автоматически на Render)
3. **Настройте мониторинг** (UptimeRobot бесплатно)
4. **Добавьте резервные копии** БД (в Supabase Dashboard)

---

## 💰 Цены

### Бесплатный план:
- ✅ Frontend: бесплатно навсегда
- ✅ Backend: бесплатно (спит после 15 мин)
- ✅ Database: бесплатно (Supabase)

### Платный план ($7/мес):
- ✅ Backend всегда активен
- ✅ Больше ресурсов
- ✅ Persistent storage для файлов

---

## 🎉 Готово!

Ваш проект в production:
- 🌐 Frontend: https://qarasora.onrender.com
- 🔧 Backend: https://qarasora-backend.onrender.com
- 🗄️ Database: Supabase (Transaction Pooler)

**Время деплоя:** ~25 минут
**Стоимость:** $0 (бесплатный план)
