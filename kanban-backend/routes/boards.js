const express = require('express');
const router = express.Router();

// Получить все доски
router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM boards');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// Создать доску
router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await req.pool.query(
      'INSERT INTO boards (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

module.exports = router;
