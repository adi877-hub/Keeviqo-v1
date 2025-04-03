import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../../shared/schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const rootDir = process.cwd();

async function runMigration() {
  console.log('Starting database migration...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/keeviqo',
  });
  
  const db = drizzle(pool, { schema });
  
  try {
    await migrate(db, { migrationsFolder: path.join(rootDir, 'drizzle') });
    console.log('Migration completed successfully');
    
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
