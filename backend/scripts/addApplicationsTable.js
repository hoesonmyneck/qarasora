import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addApplicationsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Создание таблицы applications
    console.log('📝 Создание таблицы applications...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        contact VARCHAR(500) NOT NULL,
        region VARCHAR(255),
        area VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица applications создана');

    console.log('\n✅ Миграция завершена успешно!');
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addApplicationsTable();
