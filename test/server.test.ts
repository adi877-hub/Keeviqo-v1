
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { setupTestDatabase, teardownTestDatabase } from './setup.js';

// import request from 'supertest';

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

/*
describe('Server API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  test('GET /api/health returns status 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
*/
