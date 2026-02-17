import express from 'express';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { imageUpload } from '../middleware/imageUpload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для получения абсолютного пути к файлу
const getAbsoluteFilePath = (filepath) => {
  if (!filepath) return null;
  if (path.isAbsolute(filepath)) {
    return filepath;
  }
  return path.join(__dirname, '..', filepath);
};

const router = express.Router();

// Получение всех фотографий галереи (доступно всем)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, image_url, created_at
      FROM gallery
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения галереи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Добавление фото в галерею (только админ)
router.post('/', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Изображение не предоставлено'
      });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    const result = await pool.query(
      'INSERT INTO gallery (title, image_url, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title || null, imageUrl, req.user.userId]
    );

    res.status(201).json({
      success: true,
      message: 'Фото успешно добавлено в галерею',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка добавления фото в галерею:', error);
    
    // Удаляем файл если произошла ошибка при сохранении в БД
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при добавлении фото'
    });
  }
});

// Обновление фото в галерее (только админ)
router.put('/:id', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, removeImage } = req.body;

    // Получаем текущее фото
    const oldImage = await pool.query('SELECT image_url FROM gallery WHERE id = $1', [id]);

    if (oldImage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Фото не найдено'
      });
    }

    let imageUrl = oldImage.rows[0]?.image_url;

    // Если загружено новое изображение
    if (req.file) {
      // Удаляем старое изображение
      if (imageUrl) {
        const oldImagePath = getAbsoluteFilePath(imageUrl);
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/images/${req.file.filename}`;
    } else if (removeImage === 'true' && imageUrl) {
      // Удаляем изображение если флаг установлен
      const oldImagePath = getAbsoluteFilePath(imageUrl);
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      imageUrl = null;
    }

    const result = await pool.query(
      'UPDATE gallery SET title = $1, image_url = $2 WHERE id = $3 RETURNING *',
      [title || null, imageUrl, id]
    );

    res.json({
      success: true,
      message: 'Фото успешно обновлено',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления фото:', error);
    
    // Удаляем новый файл если произошла ошибка
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении фото'
    });
  }
});

// Удаление фото из галереи (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM gallery WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Фото не найдено'
      });
    }

    const image = result.rows[0];

    // Удаление файла с диска
    if (image.image_url) {
      const imagePath = getAbsoluteFilePath(image.image_url);
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Фото успешно удалено'
    });

  } catch (error) {
    console.error('Ошибка удаления фото:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
