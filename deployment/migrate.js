import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: globalThis.process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function runMigrations() {
  globalThis.console.log('Running database migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    globalThis.console.log('Migrations completed successfully!');
  } catch (error) {
    globalThis.console.error('Migration failed:', error);
    globalThis.process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
