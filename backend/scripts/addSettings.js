import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addSettings() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Создание таблицы settings
    console.log('📝 Создание таблицы settings...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        telegram_chat_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица settings создана');

    // Проверка наличия данных в таблице settings
    const settingsCheck = await client.query('SELECT COUNT(*) FROM settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      console.log('📝 Добавление начальных данных в settings...');
      await client.query(`
        INSERT INTO settings (telegram_chat_url)
        VALUES ('https://t.me/')
      `);
      console.log('✅ Начальные данные добавлены в settings');
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

addSettings();
