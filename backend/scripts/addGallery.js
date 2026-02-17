import pool from '../config/database.js';

async function addGallery() {
  try {
    // Создание таблицы gallery
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);

    console.log('✅ Таблица gallery успешно создана');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при создании таблицы gallery:', error);
    process.exit(1);
  }
}

addGallery();
