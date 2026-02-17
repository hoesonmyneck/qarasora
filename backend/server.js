import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Импорт маршрутов
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import newsRoutes from './routes/news.js';
import farmRoutes from './routes/farms.js';
import documentRoutes from './routes/documents.js';
import applicationRoutes from './routes/applications.js';
import contactsRoutes from './routes/contacts.js';
import boardRoutes from './routes/board.js';
import settingsRoutes from './routes/settings.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  // Добавьте сюда URL вашего деплоя после создания
  // 'https://qarasora.onrender.com',
  // 'https://your-custom-domain.com'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (мобильные приложения, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы для загруженных документов и изображений
// На Render используем Persistent Disk, локально - относительный путь
const uploadsPath = process.env.UPLOAD_DIR 
  ? (path.isAbsolute(process.env.UPLOAD_DIR) ? process.env.UPLOAD_DIR : path.join(__dirname, process.env.UPLOAD_DIR))
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Qarasora API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      news: '/api/news',
      farms: '/api/farms',
      documents: '/api/documents',
      applications: '/api/applications',
      contacts: '/api/contacts',
      board: '/api/board',
      settings: '/api/settings',
      gallery: '/api/gallery'
    }
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('❌ Ошибка сервера:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 API доступно по адресу: http://localhost:${PORT}`);
  console.log(`🌍 Режим: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
