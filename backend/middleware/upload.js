import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем директорию для загрузок если её нет
// На Render используем Persistent Disk (абсолютный путь), локально - относительный путь
const fullUploadPath = process.env.UPLOAD_DIR 
  ? (path.isAbsolute(process.env.UPLOAD_DIR) ? process.env.UPLOAD_DIR : path.join(__dirname, '..', process.env.UPLOAD_DIR))
  : path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(fullUploadPath)) {
  fs.mkdirSync(fullUploadPath, { recursive: true });
}

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fullUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|txt|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'));
  }
};

// Экспорт конфигурированного multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB по умолчанию
  },
  fileFilter: fileFilter
});
