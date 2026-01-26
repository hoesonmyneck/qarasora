import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addImageFields() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Добавление поля image_url в таблицу news
    console.log('📝 Проверка колонки image_url в таблице news...');
    const checkNewsColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='news' AND column_name='image_url'
    `);
    
    if (checkNewsColumn.rows.length > 0) {
      console.log('ℹ️  Колонка "image_url" уже существует в news');
    } else {
      console.log('📝 Добавление колонки "image_url" в таблицу news...');
      await client.query(`
        ALTER TABLE news
        ADD COLUMN image_url VARCHAR(500)
      `);
      console.log('✅ Колонка "image_url" успешно добавлена в news');
    }

    // Добавление поля image_url в таблицу contacts
    console.log('📝 Проверка колонки image_url в таблице contacts...');
    const checkContactsColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='contacts' AND column_name='image_url'
    `);
    
    if (checkContactsColumn.rows.length > 0) {
      console.log('ℹ️  Колонка "image_url" уже существует в contacts');
    } else {
      console.log('📝 Добавление колонки "image_url" в таблицу contacts...');
      await client.query(`
        ALTER TABLE contacts
        ADD COLUMN image_url VARCHAR(500)
      `);
      console.log('✅ Колонка "image_url" успешно добавлена в contacts');
    }

    console.log('\n✅ Миграция завершена успешно!');
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addImageFields();
