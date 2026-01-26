import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkNews() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Проверяем структуру таблицы news
    console.log('📋 Структура таблицы news:');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name='news'
      ORDER BY ordinal_position
    `);
    console.table(columns.rows);

    // Проверяем количество новостей
    console.log('\n📊 Статистика новостей:');
    const count = await client.query('SELECT COUNT(*) FROM news');
    console.log(`Всего новостей в БД: ${count.rows[0].count}`);

    // Получаем все новости
    console.log('\n📰 Список новостей:');
    const news = await client.query(`
      SELECT id, title, detail, pinned, date, created_at
      FROM news 
      ORDER BY pinned DESC, date DESC
    `);
    
    if (news.rows.length === 0) {
      console.log('⚠️  Новостей в базе данных нет!');
    } else {
      console.table(news.rows.map(n => ({
        id: n.id,
        title: n.title.substring(0, 50),
        pinned: n.pinned,
        date: n.date?.toISOString().split('T')[0]
      })));
    }

    console.log('\n✅ Проверка завершена!');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.message.includes('column') && error.message.includes('pinned')) {
      console.log('\n⚠️  Колонка "pinned" не найдена!');
      console.log('Запустите миграцию: npm run migrate:pinned');
    }
  } finally {
    await client.end();
  }
}

checkNews();
