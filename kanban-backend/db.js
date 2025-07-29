import { Pool } from 'pg';
import config from './db/config.js';

const pool = new Pool(config);

export default pool;
