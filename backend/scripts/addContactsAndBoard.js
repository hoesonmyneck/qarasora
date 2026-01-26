import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addContactsAndBoard() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('📦 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение успешно\n');

    // Создание таблицы контактов
    console.log('📝 Создание таблицы contacts...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500),
        address TEXT,
        phone VARCHAR(100),
        telegram VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица contacts создана');

    // Проверка наличия данных в таблице контактов
    const contactsCheck = await client.query('SELECT COUNT(*) FROM contacts');
    if (parseInt(contactsCheck.rows[0].count) === 0) {
      console.log('📝 Добавление начальных данных в contacts...');
      await client.query(`
        INSERT INTO contacts (title, address, phone, telegram, email)
        VALUES (
          'Штаб-квартира ассоциации',
          'г. Нур-Султан, проспект Мәңгілік Ел, 55',
          '+7 (123) 456-7890',
          '@qarasora_kz',
          'info@qarasora.kz'
        )
      `);
      console.log('✅ Начальные данные добавлены в contacts');
    }

    // Создание таблицы правления
    console.log('📝 Создание таблицы board_members...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS board_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица board_members создана');

    // Проверка наличия данных в таблице правления
    const boardCheck = await client.query('SELECT COUNT(*) FROM board_members');
    if (parseInt(boardCheck.rows[0].count) === 0) {
      console.log('📝 Добавление начальных данных в board_members...');
      await client.query(`
        INSERT INTO board_members (name, position, description)
        VALUES 
          ('Иванов Иван Иванович', 'Председатель правления', 'Опыт работы в агросекторе более 20 лет'),
          ('Петрова Анна Сергеевна', 'Исполнительный директор', 'Эксперт по международной торговле'),
          ('Сидоров Петр Михайлович', 'Юрист ассоциации', 'Специалист по аграрному законодательству')
      `);
      console.log('✅ Начальные данные добавлены в board_members');
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

addContactsAndBoard();
