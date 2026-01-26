import express from 'express';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Получение настроек (доступно всем авторизованным)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, telegram_chat_url, created_at, updated_at
      FROM settings
      ORDER BY id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (error) {
    console.error('Ошибка получения настроек:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление настроек (только админ)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { telegram_chat_url } = req.body;

    const result = await pool.query(
      `UPDATE settings 
       SET telegram_chat_url = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [telegram_chat_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Настройки не найдены'
      });
    }

    res.json({
      success: true,
      message: 'Настройки успешно обновлены',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
