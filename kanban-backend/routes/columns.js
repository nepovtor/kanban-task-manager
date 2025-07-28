const express = require('express');
const router = express.Router();
const db = require('../db');

// Получить колонки для доски
router.get('/board/:boardId', async (req, res) => {
  const { boardId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.*, 
              json_agg(t.* ORDER BY t.position) AS tasks
       FROM columns c
       LEFT JOIN tasks t ON c.id = t.column_id
       WHERE c.board_id = $1
       GROUP BY c.id
       ORDER BY c.position`,
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать колонку
router.post('/', async (req, res) => {
  const { board_id, title, position } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO columns (board_id, title, position) 
       VALUES ($1, $2, $3) RETURNING *`,
      [board_id, title, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить колонку
router.put('/:columnId', async (req, res) => {
  const { columnId } = req.params;
  const { title } = req.body;
  try {
    const result = await db.query(
      `UPDATE columns SET title = $1 WHERE id = $2 RETURNING *`,
      [title, columnId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить колонку
router.delete('/:columnId', async (req, res) => {
  const { columnId } = req.params;
  try {
    await db.query('DELETE FROM columns WHERE id = $1', [columnId]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
