import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получение списка документов (доступно авторизованным пользователям)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id, d.name, d.filename, d.mimetype, d.size, d.created_at,
        u.username as created_by_username
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      ORDER BY d.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения документов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Получение информации о документе по ID (доступно авторизованным пользователям)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        d.id, d.name, d.filename, d.mimetype, d.size, d.created_at,
        u.username as created_by_username
      FROM documents d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка получения документа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Скачивание файла документа (доступно авторизованным пользователям)
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
    }

    const document = result.rows[0];
    const filePath = path.join(__dirname, '..', document.filepath);

    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Файл не найден на сервере'
      });
    }

    res.download(filePath, document.name);

  } catch (error) {
    console.error('Ошибка скачивания документа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Загрузка нового документа (только админ)
router.post('/', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не предоставлен'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать название документа'
      });
    }

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filepath = path.join(uploadDir, req.file.filename);

    const result = await pool.query(
      'INSERT INTO documents (name, filename, filepath, mimetype, size, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, req.file.filename, filepath, req.file.mimetype, req.file.size, req.user.userId]
    );

    res.status(201).json({
      success: true,
      message: 'Документ успешно загружен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка загрузки документа:', error);
    
    // Удаляем файл если произошла ошибка при сохранении в БД
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при загрузке документа'
    });
  }
});

// Обновление документа (только админ)
router.put('/:id', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать название документа'
      });
    }

    // Получаем текущий документ
    const currentDoc = await pool.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );

    if (currentDoc.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
    }

    let result;

    // Если загружен новый файл
    if (req.file) {
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const filepath = path.join(uploadDir, req.file.filename);

      // Удаляем старый файл
      const oldFilePath = path.join(__dirname, '..', currentDoc.rows[0].filepath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      result = await pool.query(
        'UPDATE documents SET name = $1, filename = $2, filepath = $3, mimetype = $4, size = $5 WHERE id = $6 RETURNING *',
        [name, req.file.filename, filepath, req.file.mimetype, req.file.size, id]
      );
    } else {
      // Обновляем только название
      result = await pool.query(
        'UPDATE documents SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
    }

    res.json({
      success: true,
      message: 'Документ успешно обновлен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления документа:', error);
    
    // Удаляем новый файл если произошла ошибка
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении документа'
    });
  }
});

// Удаление документа (только админ)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM documents WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
    }

    const document = result.rows[0];
    const filePath = path.join(__dirname, '..', document.filepath);

    // Удаление файла с диска
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'Документ успешно удален'
    });

  } catch (error) {
    console.error('Ошибка удаления документа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

export default router;
