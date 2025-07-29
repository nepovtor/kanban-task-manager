const express = require('express');
const router = express.Router();

// Получить все колонки для доски
router.get('/board/:boardId', async (req, res) => {
  const { boardId } = req.params;
  try {
    const result = await req.pool.query('SELECT * FROM columns WHERE board_id = $1', [boardId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});

// Создать колонку
router.post('/', async (req, res) => {
  const { board_id, title } = req.body;
  try {
    const result = await req.pool.query(
      'INSERT INTO columns (board_id, title) VALUES ($1, $2) RETURNING *',
      [board_id, title]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create column' });
  }
});

module.exports = router;
