import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Получить все доски
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boards');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// Создать доску
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO boards (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

export default router;
