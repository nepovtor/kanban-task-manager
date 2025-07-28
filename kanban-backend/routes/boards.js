const express = require('express');
const router = express.Router();
const db = require('../db');

// Получить все доски пользователя
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать доску
router.post('/', async (req, res) => {
  const { user_id, title } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO boards (user_id, title) VALUES ($1, $2) RETURNING *',
      [user_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить доску
router.delete('/:boardId', async (req, res) => {
  const { boardId } = req.params;
  try {
    await db.query('DELETE FROM boards WHERE id = $1', [boardId]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
