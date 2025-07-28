const { Pool } = require('pg');

const pool = new Pool({
  user: 'kanban_user',
  host: 'localhost',
  database: 'kanban_db',
  password: 'kanban_pass',
  port: 5432
});

module.exports = pool;