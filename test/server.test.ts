import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { setupTestDatabase, teardownTestDatabase } from './setup.js';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

describe('Server', () => {
  test('should pass a basic test', () => {
    expect(true).toBe(true);
  });
  
  test('database connection should be configured correctly', () => {
    const dbUrl = process.env.DATABASE_URL;
    expect(dbUrl).toBeDefined();
    expect(dbUrl).toContain('postgres:postgres');
  });
});
