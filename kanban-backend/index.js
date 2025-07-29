import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db.js';
import boardsRouter from './routes/boards.js';
import columnsRouter from './routes/columns.js';
import tasksRouter from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/boards', boardsRouter);
app.use('/columns', columnsRouter);
app.use('/tasks', tasksRouter);

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
