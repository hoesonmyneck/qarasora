import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из папки backend (на уровень выше config)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

// Настройка SSL для облачных баз данных (Supabase, Neon, и т.д.)
const isCloudDatabase = process.env.DATABASE_URL || 
  (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost'));

// Если есть DATABASE_URL, используем его
let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000, // Увеличен таймаут до 20 секунд
  };
} else {
  // Иначе используем отдельные параметры
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'qarasora',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    ssl: isCloudDatabase ? {
      rejectUnauthorized: false
    } : false
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Подключено к базе данных PostgreSQL');
  if (isCloudDatabase) {
    console.log('🌐 Используется облачная база данных (SSL включён)');
  }
});

pool.on('error', (err) => {
  console.error('❌ Ошибка базы данных:', err);
  process.exit(-1);
});

export default pool;
