const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Пример маршрута
app.get('/', (req, res) => {
  res.send('Kanban API is running');
});

// Подключение роутов задач
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
