import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Получить все задачи для колонки
router.get('/column/:columnId', async (req, res) => {
  const { columnId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE column_id = $1', [columnId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Создать задачу
router.post('/', async (req, res) => {
  const { column_id, title, description, position } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (column_id, title, description, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [column_id, title, description, position]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Переместить задачу между колонками
router.put('/:id/move', async (req, res) => {
  const { id } = req.params;
  const { newColumnId, newPosition } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3 RETURNING *',
      [newColumnId, newPosition, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

// Обновить задачу
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, column_id, position } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, column_id = $3, position = $4 WHERE id = $5 RETURNING *',
      [title, description, column_id, position, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Удалить задачу
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
