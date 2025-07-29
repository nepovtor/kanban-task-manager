import express from 'express';
import cors from 'cors';
import pool from './db/config.js';
import boardsRouter from './routes/boards.js';
import columnsRouter from './routes/columns.js';
import tasksRouter from './routes/tasks.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
const SECRET_KEY = 'super_secret_key';

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Пример пользователей (лучше через БД)
const users = [
  { id: 1, username: 'admin', password: '123456' }
];

// Тестовый маршрут
app.get('/', (req, res) => {
  res.send('Kanban backend is running');
});

// Логин
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// API маршруты
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

// Получение колонок и задач по boardId
app.get('/api/columns/board/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await pool.query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position',
      [boardId]
    );

    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1)',
      [boardId]
    );

    res.json({
      columns: columns.rows,
      tasks: tasks.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
