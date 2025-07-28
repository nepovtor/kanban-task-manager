const express = require('express');
const router = express.Router();
const db = require('../db');

// Получить задачи по колонке
router.get('/column/:columnId', async (req, res) => {
  const { columnId } = req.params;
  try {
    const tasks = await db.query(
      'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position',
      [columnId]
    );
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать задачу
router.post('/', async (req, res) => {
  const { column_id, title, description, deadline, position } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tasks (column_id, title, description, deadline, position)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [column_id, title, description, deadline, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить задачу
router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline } = req.body;
  try {
    const result = await db.query(
      `UPDATE tasks SET title = $1, description = $2, deadline = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [title, description, deadline, taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить задачу
router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Переместить задачу
router.put('/:taskId/move', async (req, res) => {
  const { taskId } = req.params;
  const { newColumnId, newPosition } = req.body;

  try {
    await db.query('BEGIN');

    // Получаем исходную колонку и позицию задачи
    const task = await db.query('SELECT column_id, position FROM tasks WHERE id = $1', [taskId]);
    const { column_id: oldColumnId, position: oldPosition } = task.rows[0];

    // Сдвигаем позиции в старой колонке
    await db.query(
      'UPDATE tasks SET position = position - 1 WHERE column_id = $1 AND position > $2',
      [oldColumnId, oldPosition]
    );

    // Сдвигаем позиции в новой колонке
    await db.query(
      'UPDATE tasks SET position = position + 1 WHERE column_id = $1 AND position >= $2',
      [newColumnId, newPosition]
    );

    // Обновляем колонку и позицию задачи
    await db.query(
      'UPDATE tasks SET column_id = $1, position = $2, updated_at = NOW() WHERE id = $3',
      [newColumnId, newPosition, taskId]
    );

    await db.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
