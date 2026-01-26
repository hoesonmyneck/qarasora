import express from 'express';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Создание новой заявки (доступно всем)
router.post('/', async (req, res) => {
  try {
    const { name, contact, region, area } = req.body;

    if (!name || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать имя и контакт'
      });
    }

    const result = await pool.query(
      'INSERT INTO applications (name, contact, region, area) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, contact, region || '', area || '']
    );

    res.status(201).json({
      success: true,
      message: 'Заявка успешно отправлена',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение всех заявок (только админ)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, contact, region, area, status, created_at
      FROM applications
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление статуса заявки (только админ)
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Неверный статус'
      });
    }

    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Заявка не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Статус заявки обновлен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления статуса заявки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Удаление заявки (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Заявка не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Заявка успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
