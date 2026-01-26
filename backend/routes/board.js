import express from 'express';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { imageUpload } from '../middleware/imageUpload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Получение всех членов правления (доступно всем)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, position, description, image_url, created_at
      FROM board_members
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения правления:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Создание нового члена правления (только админ)
router.post('/', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { name, position, description } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать имя и должность'
      });
    }

    const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO board_members (name, position, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, position, description || '', imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Член правления успешно добавлен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка создания члена правления:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление члена правления (только админ)
router.put('/:id', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, description, removeImage } = req.body;

    // Получаем старые данные для удаления старого изображения
    const oldMember = await pool.query('SELECT image_url FROM board_members WHERE id = $1', [id]);
    
    let imageUrl = oldMember.rows[0]?.image_url;
    
    // Если нужно удалить изображение
    if (removeImage === 'true') {
      if (imageUrl) {
        const oldImagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = null;
    }
    
    // Если загружено новое изображение
    if (req.file) {
      // Удаляем старое изображение
      if (imageUrl) {
        const oldImagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/images/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE board_members 
       SET name = $1, position = $2, description = $3, image_url = $4
       WHERE id = $5 
       RETURNING *`,
      [name, position, description, imageUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Член правления не найден'
      });
    }

    res.json({
      success: true,
      message: 'Данные члена правления обновлены',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления члена правления:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Удаление члена правления (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем данные для удаления изображения
    const member = await pool.query('SELECT image_url FROM board_members WHERE id = $1', [id]);
    
    if (member.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Член правления не найден'
      });
    }

    // Удаляем изображение если есть
    if (member.rows[0].image_url) {
      const imagePath = path.join(__dirname, '..', member.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query('DELETE FROM board_members WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Член правления успешно удалён'
    });

  } catch (error) {
    console.error('Ошибка удаления члена правления:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
