import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kanban',
  password: 'your_password',
  port: 5432
});

app.use(cors());
app.use(bodyParser.json());

// Получение доски с колонками и задачами
app.get('/api/board/:id', async (req, res) => {
  const boardId = req.params.id;
  try {
    const board = await pool.query('SELECT * FROM boards WHERE id = $1', [boardId]);
    const columns = await pool.query('SELECT * FROM columns WHERE board_id = $1 ORDER BY position', [boardId]);
    const tasks = await pool.query('SELECT * FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1)', [boardId]);

    res.json({
      board: board.rows[0],
      columns: columns.rows,
      tasks: tasks.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
