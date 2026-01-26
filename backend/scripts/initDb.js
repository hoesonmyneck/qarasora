import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Инициализация базы данных...');

    // Создание таблицы пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица users создана');

    // Создание таблицы новостей
    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        body TEXT,
        detail TEXT,
        pinned BOOLEAN DEFAULT FALSE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица news создана');

    // Создание таблицы ферм
    await client.query(`
      CREATE TABLE IF NOT EXISTS farms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        region VARCHAR(255),
        area VARCHAR(255),
        lat DECIMAL(10, 7) NOT NULL,
        lng DECIMAL(10, 7) NOT NULL,
        note TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица farms создана');

    // Создание таблицы документов
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(500) NOT NULL,
        mimetype VARCHAR(100),
        size INTEGER,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица documents создана');

    // Проверка существования админа
    const adminCheck = await client.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );

    if (adminCheck.rows.length === 0) {
      // Создание администратора по умолчанию
      const hashedPassword = await bcrypt.hash('admin', 10);
      await client.query(
        'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, true]
      );
      console.log('✅ Админ создан (username: admin, password: admin)');
    } else {
      console.log('ℹ️  Админ уже существует');
    }

    // Создание тестовых пользователей
    const userCheck = await client.query(
      "SELECT * FROM users WHERE username = 'user'"
    );

    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('user', 10);
      await client.query(
        'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3)',
        ['user', hashedPassword, false]
      );
      console.log('✅ Тестовый пользователь создан (username: user, password: user)');
    }

    // Добавление тестовых новостей
    const newsCount = await client.query('SELECT COUNT(*) FROM news');
    if (parseInt(newsCount.rows[0].count) === 0) {
      const adminUser = await client.query("SELECT id FROM users WHERE username = 'admin'");
      const adminId = adminUser.rows[0].id;

      await client.query(`
        INSERT INTO news (title, body, detail, created_by) VALUES
        ('Ежегодная конференция по конопле', 
         'Приглашаем на главное событие года в индустрии технической конопли',
         'Конференция пройдет в формате круглого стола с участием ведущих экспертов отрасли. Будут обсуждаться вопросы законодательства, технологий выращивания и перспектив развития рынка.',
         $1),
        ('Новые стандарты выращивания', 
         'Министерство сельского хозяйства утвердило новые стандарты',
         'Новые стандарты включают требования к качеству посевного материала, условиям хранения и транспортировки продукции.',
         $1),
        ('Расширение программы субсидирования', 
         'Правительство объявило о расширении программы поддержки',
         'Размер субсидий увеличен на 30%. Новые условия вступают в силу с 1 марта 2025 года.',
         $1),
        ('Международная выставка', 
         'Приглашаем посетить международную выставку Hemp Expo 2025',
         'Выставка соберет более 200 участников из 15 стран. Специальная программа для членов ассоциации.',
         $1)
      `, [adminId]);
      console.log('✅ Тестовые новости добавлены');
    }

    // Добавление тестовых ферм
    const farmsCount = await client.query('SELECT COUNT(*) FROM farms');
    if (parseInt(farmsCount.rows[0].count) === 0) {
      const adminUser = await client.query("SELECT id FROM users WHERE username = 'admin'");
      const adminId = adminUser.rows[0].id;

      await client.query(`
        INSERT INTO farms (name, region, area, lat, lng, note, created_by) VALUES
        ('Хозяйство "Астана-Агро"', 'Акмолинская область', '500 га', 51.1694, 71.4491, 
         'Основное хозяйство специализируется на выращивании технической конопли', $1),
        ('ТОО "Караганда-Hemp"', 'Карагандинская область', '350 га', 49.8064, 73.0855,
         'Современное предприятие с полным циклом переработки', $1),
        ('Фермерское хозяйство "Алматы-Конопля"', 'Алматинская область', '200 га', 43.2383, 76.9453,
         'Органическое производство, сертифицировано по международным стандартам', $1)
      `, [adminId]);
      console.log('✅ Тестовые фермы добавлены');
    }

    console.log('✅ База данных успешно инициализирована!');
    console.log('\n📝 Учетные данные:');
    console.log('   Админ: username=admin, password=admin');
    console.log('   Пользователь: username=user, password=user\n');

  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

initDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
