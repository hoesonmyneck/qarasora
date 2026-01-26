import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав админа
router.use(authenticate, requireAdmin);

// Создание нового пользователя
router.post('/', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать логин и пароль'
      });
    }

    // Проверка на существование пользователя
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует'
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id, username, is_admin, created_at',
      [username, hashedPassword, isAdmin || false]
    );

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании пользователя'
    });
  }
});

// Получение списка пользователей
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, is_admin, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление пользователя
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать логин'
      });
    }

    // Проверка на существование пользователя с таким логином
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует'
      });
    }

    let result;
    
    // Если указан новый пароль, хешируем его
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(
        'UPDATE users SET username = $1, password = $2, is_admin = $3 WHERE id = $4 RETURNING id, username, is_admin, created_at',
        [username, hashedPassword, isAdmin !== undefined ? isAdmin : false, id]
      );
    } else {
      result = await pool.query(
        'UPDATE users SET username = $1, is_admin = $2 WHERE id = $3 RETURNING id, username, is_admin, created_at',
        [username, isAdmin !== undefined ? isAdmin : false, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      message: 'Пользователь успешно обновлен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Удаление пользователя
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка на попытку удаления самого себя
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Нельзя удалить свой собственный аккаунт'
      });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });

  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
