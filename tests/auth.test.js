const request = require('supertest');
const app = require('../app');  // your Express app
const { User } = require('../models');
const { sequelize } = require('../models');

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Optionally, clear users before tests run
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Cleanup if needed, close DB connection, etc.
  });

  test('POST /api/auth/register - success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/register - duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'duplicate@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'anotheruser',
        email: 'duplicate@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test('POST /api/auth/login - success', async () => {
    // Register user first
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'loginuser@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  test('GET /api/auth/me - success with token', async () => {
    // Register & login to get token
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'meuser',
        email: 'meuser@example.com',
        password: 'password123'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'meuser@example.com',
        password: 'password123'
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('meuser@example.com');
    expect(res.body.password).toBeUndefined();
  });

  //test('GET /api/auth/me - unauthorized without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await sequelize.close();
});
