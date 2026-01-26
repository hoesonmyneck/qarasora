import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Вход в систему
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать логин и пароль'
      });
    }

    // Поиск пользователя
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    const user = result.rows[0];

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Генерация JWT токена
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        isAdmin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Успешный вход',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.is_admin
        }
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе'
    });
  }
});

// Получение информации о текущем пользователе
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, is_admin, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        isAdmin: result.rows[0].is_admin,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Выход (клиентская операция, токен удаляется на клиенте)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Успешный выход'
  });
});

export default router;
