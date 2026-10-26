require('dotenv').config({ quiet: true });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const stamp = Date.now();
const owner = {
  name: 'Owner Todo',
  email: `owner${stamp}@example.com`,
  password: 'password123',
};
const other = {
  name: 'Other User',
  email: `other${stamp}@example.com`,
  password: 'password123',
};

let ownerToken;
let otherToken;
let todoId;

beforeAll(async () => {
  if (process.env.MONGO_URI_TEST === process.env.MONGO_URI) {
    throw new Error('MONGO_URI_TEST tidak boleh sama dengan MONGO_URI');
  }
  await mongoose.connect(process.env.MONGO_URI_TEST);

  const r1 = await request(app).post('/api/auth/register').send(owner);
  ownerToken = r1.body.token;
  const r2 = await request(app).post('/api/auth/register').send(other);
  otherToken = r2.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Todo API (integration test)', () => {
  test('GET /api/todos tanpa token harus 401', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/todos tanpa title harus 400', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ description: 'tanpa judul' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  test('POST /api/todos berhasil membuat todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Belajar Jest', description: 'Latihan test' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.todo.title).toBe('Belajar Jest');
    expect(res.body.data.todo.status).toBe('pending');
    todoId = res.body.data.todo._id;
  });

  test('GET /api/todos menampilkan todo milik user', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.todos[0].title).toBe('Belajar Jest');
  });

  test('GET /api/todos/:id menampilkan detail todo', async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.todo._id).toBe(todoId);
  });

  test('GET /api/todos/:id yang tidak ada harus 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/todos/${fakeId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/todos/:id berhasil mengubah status', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'done' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.todo.status).toBe('done');
  });

  test('PUT /api/todos/:id oleh user lain harus 403', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ status: 'pending' });
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /api/todos/:id oleh user lain harus 403', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /api/todos/:id berhasil menghapus todo', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Todo berhasil dihapus');
  });

  test('GET /api/todos/:id setelah dihapus harus 404', async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(404);
  });
});