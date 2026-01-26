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

// Получение всех контактов (доступно всем)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, address, phone, telegram, email, image_url, created_at
      FROM contacts
      ORDER BY id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (error) {
    console.error('Ошибка получения контактов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление контактов (только админ)
router.put('/:id', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, phone, telegram, email, removeImage } = req.body;

    // Получаем старые контакты для удаления старого изображения
    const oldContacts = await pool.query('SELECT image_url FROM contacts WHERE id = $1', [id]);
    
    let imageUrl = oldContacts.rows[0]?.image_url;
    
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
      `UPDATE contacts 
       SET title = $1, address = $2, phone = $3, telegram = $4, email = $5, image_url = $6
       WHERE id = $7 
       RETURNING *`,
      [title, address, phone, telegram, email, imageUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Контакты не найдены'
      });
    }

    res.json({
      success: true,
      message: 'Контакты успешно обновлены',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления контактов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
