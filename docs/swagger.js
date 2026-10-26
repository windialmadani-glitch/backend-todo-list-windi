const idParam = {
  name: 'id', in: 'path', required: true,
  schema: { type: 'string' }, description: 'ID todo',
};
const secured = [{ bearerAuth: [] }];

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Todo List API',
    version: '1.0.0',
    description: 'Dokumentasi API Todo List (Express + MongoDB)',
  },
  servers: [{ url: 'http://localhost:5000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Daftar akun baru',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Windi' },
            email: { type: 'string', example: 'windi@example.com' },
            password: { type: 'string', example: 'password123' },
          } } } } },
        responses: { 201: { description: 'Berhasil, mengembalikan token' }, 400: { description: 'Email sudah terdaftar' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'windi@example.com' },
            password: { type: 'string', example: 'password123' },
          } } } } },
        responses: { 200: { description: 'Berhasil, mengembalikan token' }, 400: { description: 'Data kosong' }, 401: { description: 'Email atau password salah' } },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'], summary: 'Data user yang sedang login', security: secured,
        responses: { 200: { description: 'Data user' }, 401: { description: 'Tanpa token / token salah' } },
      },
    },
    '/api/todos': {
      get: {
        tags: ['Todos'], summary: 'Ambil semua todo milik user', security: secured,
        responses: { 200: { description: 'Daftar todo' }, 401: { description: 'Belum login' } },
      },
      post: {
        tags: ['Todos'], summary: 'Buat todo baru', security: secured,
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['title'],
          properties: {
            title: { type: 'string', example: 'Belajar Jest' },
            description: { type: 'string', example: 'Latihan test' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'done'] },
            dueDate: { type: 'string', format: 'date-time' },
          } } } } },
        responses: { 201: { description: 'Todo dibuat' }, 400: { description: 'Title kosong' }, 401: { description: 'Belum login' } },
      },
    },
    '/api/todos/{id}': {
      get: {
        tags: ['Todos'], summary: 'Detail satu todo', security: secured, parameters: [idParam],
        responses: { 200: { description: 'Detail todo' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
      },
      put: {
        tags: ['Todos'], summary: 'Ubah todo', security: secured, parameters: [idParam],
        requestBody: { content: { 'application/json': { schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'done'] },
          } } } } },
        responses: { 200: { description: 'Todo diubah' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
      },
      delete: {
        tags: ['Todos'], summary: 'Hapus todo', security: secured, parameters: [idParam],
        responses: { 200: { description: 'Todo dihapus' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
      },
    },
  },
};