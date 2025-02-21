import { drizzle } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';
import * as schema from './dbSchema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export default db;