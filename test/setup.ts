import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/keeviqo_test',
});

export const db = drizzle(pool, { schema });

export async function setupTestDatabase() {
  try {
    console.log('Test database connected successfully');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

export async function teardownTestDatabase() {
  try {
    await pool.end();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
}

export default async function() {
  console.log('Running global setup...');
  await setupTestDatabase();
}
