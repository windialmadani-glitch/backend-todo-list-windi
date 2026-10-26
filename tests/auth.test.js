require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const user = {
  name: 'User Test',
  email: 'test@example.com',
  password: 'password123',
};

beforeAll(async () => {
  if (process.env.MONGO_URI_TEST === process.env.MONGO_URI) {
    throw new Error('MONGO_URI_TEST tidak boleh sama dengan MONGO_URI');
  }
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API (integration test)', () => {
  test('GET / harus 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/auth/register berhasil', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.token).toBeDefined();
    expect(res.body.data.user.email).toBe(user.email);
  });

  test('POST /api/auth/register email dobel harus 400', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login berhasil', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login password salah harus 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'salahbanget' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/login tanpa data harus 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/auth/me pakai token harus 200', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/auth/me tanpa token harus ditolak', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});