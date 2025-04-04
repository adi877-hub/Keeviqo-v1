
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

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestDatabase, teardownTestDatabase } from './setup';
import request from 'supertest';
import app from '../server/index';

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
