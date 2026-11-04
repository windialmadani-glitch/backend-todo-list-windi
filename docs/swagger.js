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
  servers: [{ url: '/' }],
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
  parameters: [
    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Nomor halaman' },
    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Jumlah data per halaman' },
    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Cari berdasarkan judul' },
    { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in-progress', 'done'] }, description: 'Filter status' },
    { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter berdasarkan ID kategori' },
    { name: 'sort', in: 'query', schema: { type: 'string', example: '-createdAt' }, description: 'Urutan, contoh: -createdAt atau title' },
  ],
  responses: { 200: { description: 'Daftar todo (dengan pagination)' }, 401: { description: 'Belum login' } },
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
// ===== Tambahan: Categories, Stats, Admin =====
module.exports.components.securitySchemes.apiKeyAuth = {
  type: 'apiKey', in: 'header', name: 'x-api-key',
};

const catParam = {
  name: 'id', in: 'path', required: true,
  schema: { type: 'string' }, description: 'ID kategori',
};

module.exports.paths['/api/auth/admin-only'] = {
  get: {
    tags: ['Auth'], summary: 'Endpoint khusus admin', security: secured,
    responses: {
      200: { description: 'Berhasil (role admin)' },
      401: { description: 'Belum login' },
      403: { description: 'Bukan admin' },
    },
  },
};

module.exports.paths['/api/categories'] = {
  get: {
    tags: ['Categories'], summary: 'Ambil semua kategori milik user', security: secured,
    responses: { 200: { description: 'Daftar kategori' }, 401: { description: 'Belum login' } },
  },
  post: {
    tags: ['Categories'], summary: 'Buat kategori baru', security: secured,
    requestBody: { required: true, content: { 'application/json': { schema: {
      type: 'object', required: ['name'],
      properties: { name: { type: 'string', example: 'Kuliah' } },
    } } } },
    responses: { 201: { description: 'Kategori dibuat' }, 401: { description: 'Belum login' } },
  },
};

module.exports.paths['/api/categories/{id}'] = {
  get: {
    tags: ['Categories'], summary: 'Detail satu kategori', security: secured, parameters: [catParam],
    responses: { 200: { description: 'Detail kategori' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
  },
  put: {
    tags: ['Categories'], summary: 'Ubah kategori', security: secured, parameters: [catParam],
    requestBody: { content: { 'application/json': { schema: {
      type: 'object',
      properties: { name: { type: 'string', example: 'Kuliah (baru)' } },
    } } } },
    responses: { 200: { description: 'Kategori diubah' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
  },
  delete: {
    tags: ['Categories'], summary: 'Hapus kategori', security: secured, parameters: [catParam],
    responses: { 200: { description: 'Kategori dihapus' }, 403: { description: 'Bukan milik user' }, 404: { description: 'Tidak ditemukan' } },
  },
};

module.exports.paths['/api/stats'] = {
  get: {
    tags: ['Stats'], summary: 'Statistik sistem (butuh API Key)',
    security: [{ apiKeyAuth: [] }],
    responses: { 200: { description: 'Data statistik' }, 401: { description: 'API Key tidak valid / tidak ada' } },
  },
};
module.exports.paths['/api/stats/summary'] = {
  get: {
    tags: ['Stats'], summary: 'Ringkasan statistik sistem (butuh API Key)',
    security: [{ apiKeyAuth: [] }],
    responses: { 200: { description: 'Data statistik' }, 401: { description: 'API Key tidak valid / tidak ada' } },
  },
};

module.exports.paths['/api/external/summary'] = {
  get: {
    tags: ['External'], summary: 'Ringkasan untuk akses eksternal (butuh API Key)',
    security: [{ apiKeyAuth: [] }],
    responses: { 200: { description: 'Data ringkasan' }, 401: { description: 'API Key tidak valid / tidak ada' } },
  },
};

module.exports.paths['/api/activity-logs'] = {
  get: {
    tags: ['Activity Logs'], summary: 'Riwayat aktivitas milik user', security: secured,
    responses: { 200: { description: 'Daftar log aktivitas (terbaru di atas)' }, 401: { description: 'Belum login' } },
  },
};