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
  const { column_id, title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (column_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [column_id, title, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Обновить задачу
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, column_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, column_id = $3 WHERE id = $4 RETURNING *',
      [title, description, column_id, id]
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
