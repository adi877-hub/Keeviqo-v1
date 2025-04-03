import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: globalThis.process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/keeviqo_test',
});

export async function setupTestDatabase() {
  try {
    const client = await pool.connect();
    globalThis.console.log('Successfully connected to test database');
    client.release();
    return true;
  } catch (error) {
    globalThis.console.error('Error connecting to test database:', error);
    return false;
  }
}

export async function teardownTestDatabase() {
  await pool.end();
  globalThis.console.log('Test database connection closed');
}

if (globalThis.process.argv[1] === import.meta.url) {
  setupTestDatabase()
    .then((success) => {
      if (success) {
        globalThis.console.log('Test database setup successful');
      } else {
        globalThis.console.error('Test database setup failed');
        globalThis.process.exit(1);
      }
      return teardownTestDatabase();
    })
    .catch((error) => {
      globalThis.console.error('Unexpected error during test setup:', error);
      globalThis.process.exit(1);
    });
}
