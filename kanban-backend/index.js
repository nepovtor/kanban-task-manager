// Импорты
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Подключение к БД
const db = require('./db');

// Инициализация сервера
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Базовая проверка работоспособности
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Проверка БД
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Подключение маршрутов
const taskRoutes = require('./routes/tasks');
const columnRoutes = require('./routes/columns');
const boardRoutes = require('./routes/boards');

app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/boards', boardRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
