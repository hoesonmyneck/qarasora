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

// Получение всех новостей (доступно всем)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id, n.title, n.body, n.detail, n.pinned, n.date, n.image_url, n.created_at, n.updated_at,
        u.username as created_by_username
      FROM news n
      LEFT JOIN users u ON n.created_by = u.id
      ORDER BY n.pinned DESC, n.date DESC, n.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения новостей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение новости по ID (доступно всем)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        n.id, n.title, n.body, n.detail, n.pinned, n.date, n.image_url, n.created_at, n.updated_at,
        u.username as created_by_username
      FROM news n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка получения новости:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Создание новости (только админ)
router.post('/', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { title, body, detail, pinned } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать заголовок новости'
      });
    }

    // Если закрепляем новость, сначала откреплям все остальные
    if (pinned === 'true' || pinned === true) {
      await pool.query('UPDATE news SET pinned = FALSE WHERE pinned = TRUE');
    }

    const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO news (title, body, detail, pinned, image_url, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, body || '', detail || '', pinned === 'true' || pinned === true, imageUrl, req.user.userId]
    );

    res.status(201).json({
      success: true,
      message: 'Новость успешно создана',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка создания новости:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Обновление новости (только админ)
router.put('/:id', authenticate, requireAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, detail, pinned, removeImage } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать заголовок новости'
      });
    }

    // Получаем старую новость для удаления старого изображения
    const oldNews = await pool.query('SELECT image_url FROM news WHERE id = $1', [id]);
    
    // Если закрепляем новость, сначала откреплям все остальные
    if (pinned === 'true' || pinned === true) {
      await pool.query('UPDATE news SET pinned = FALSE WHERE pinned = TRUE AND id != $1', [id]);
    }

    let imageUrl = oldNews.rows[0]?.image_url;
    
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
      'UPDATE news SET title = $1, body = $2, detail = $3, pinned = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, body || '', detail || '', pinned === 'true' || pinned === true, imageUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Новость успешно обновлена',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления новости:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Удаление новости (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем новость для удаления изображения
    const news = await pool.query('SELECT image_url FROM news WHERE id = $1', [id]);
    
    if (news.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    // Удаляем изображение если есть
    if (news.rows[0].image_url) {
      const imagePath = path.join(__dirname, '..', news.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query('DELETE FROM news WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Новость успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка удаления новости:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Закрепление/откепление новости (только админ)
router.patch('/:id/pin', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { pinned } = req.body;

    // Если закрепляем, откреплям все остальные
    if (pinned) {
      await pool.query('UPDATE news SET pinned = FALSE WHERE pinned = TRUE AND id != $1', [id]);
    }

    const result = await pool.query(
      'UPDATE news SET pinned = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [pinned, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    res.json({
      success: true,
      message: pinned ? 'Новость закреплена' : 'Новость откреплена',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка закрепления новости:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
