import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addPinnedColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно');

    // Проверяем, существует ли колонка pinned
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='news' AND column_name='pinned'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('ℹ️  Колонка "pinned" уже существует');
    } else {
      console.log('📝 Добавление колонки "pinned" в таблицу news...');
      await client.query(`
        ALTER TABLE news 
        ADD COLUMN pinned BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Колонка "pinned" успешно добавлена');
    }

    console.log('');
    console.log('✅ Миграция завершена успешно!');
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addPinnedColumn();
