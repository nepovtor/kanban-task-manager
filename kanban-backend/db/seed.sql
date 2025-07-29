INSERT INTO users (email, password) 
VALUES ('test@example.com', '$2b$10$yM2jEXAMPLEHASHEDPASSWORD');

INSERT INTO boards (name) VALUES ('Пример доски');

INSERT INTO columns (board_id, name)
VALUES 
  (1, 'To Do'),
  (1, 'In Progress'),
  (1, 'Done');

INSERT INTO tasks (column_id, title, description)
VALUES
  (1, 'Создать проект', 'Инициализировать Vue и Express'),
  (2, 'Подключить БД', 'Настроить PostgreSQL и миграции'),
  (3, 'Реализовать логин', 'Добавить JWT авторизацию');
