import express from 'express';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Получение всех ферм (доступно авторизованным пользователям)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.id, f.name, f.region, f.area, f.lat, f.lng, f.note, 
        f.created_at, f.updated_at,
        u.username as created_by_username
      FROM farms f
      LEFT JOIN users u ON f.created_by = u.id
      ORDER BY f.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения ферм:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение фермы по ID (доступно авторизованным пользователям)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        f.id, f.name, f.region, f.area, f.lat, f.lng, f.note, 
        f.created_at, f.updated_at,
        u.username as created_by_username
      FROM farms f
      LEFT JOIN users u ON f.created_by = u.id
      WHERE f.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ферма не найдена'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка получения фермы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Создание фермы (только админ)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, region, area, lat, lng, note } = req.body;

    if (!name || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать название, широту и долготу'
      });
    }

    const result = await pool.query(
      'INSERT INTO farms (name, region, area, lat, lng, note, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, region || '', area || '', parseFloat(lat), parseFloat(lng), note || '', req.user.userId]
    );

    res.status(201).json({
      success: true,
      message: 'Ферма успешно создана',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка создания фермы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление фермы (только админ)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, area, lat, lng, note } = req.body;

    if (!name || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать название, широту и долготу'
      });
    }

    const result = await pool.query(
      'UPDATE farms SET name = $1, region = $2, area = $3, lat = $4, lng = $5, note = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, region || '', area || '', parseFloat(lat), parseFloat(lng), note || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ферма не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Ферма успешно обновлена',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления фермы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Удаление фермы (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM farms WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ферма не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Ферма успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка удаления фермы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
