
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

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/keeviqo_test',
  user: process.env.NODE_ENV === 'test' ? 'postgres' : undefined,
});

export async function setupTestDatabase() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to test database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to test database:', error);
    return false;

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

  await pool.end();
  console.log('Test database connection closed');
}

if (process.argv[1] === import.meta.url) {
  setupTestDatabase()
    .then((success) => {
      if (success) {
        console.log('Test database setup successful');
      } else {
        console.error('Test database setup failed');
        process.exit(1);
      }
      return teardownTestDatabase();
    })
    .catch((error) => {
      console.error('Unexpected error during test setup:', error);
      process.exit(1);
    });

}
