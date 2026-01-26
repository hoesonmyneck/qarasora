import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addBoardImageField() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Добавление поля image_url в таблицу board_members
    console.log('📝 Проверка колонки image_url в таблице board_members...');
    const checkColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='board_members' AND column_name='image_url'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('ℹ️  Колонка "image_url" уже существует в board_members');
    } else {
      console.log('📝 Добавление колонки "image_url" в таблицу board_members...');
      await client.query(`
        ALTER TABLE board_members
        ADD COLUMN image_url VARCHAR(500)
      `);
      console.log('✅ Колонка "image_url" успешно добавлена в board_members');
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

addBoardImageField();
