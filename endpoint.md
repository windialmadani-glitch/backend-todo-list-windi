# Daftar Endpoint API

## Auth
| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| POST | /api/auth/register | Daftar akun baru | Public |
| POST | /api/auth/login | Login, mengembalikan token JWT | Public |
| GET | /api/auth/me | Lihat profil user yang login | Private |

## Todo
| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | /api/todos | Lihat semua todo milik user | Private |
| GET | /api/todos/:id | Lihat detail satu todo | Private |
| POST | /api/todos | Buat todo baru | Private |
| PUT | /api/todos/:id | Ubah todo | Private |
| DELETE | /api/todos/:id | Hapus todo | Private |

## Category
| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | /api/categories | Lihat semua kategori milik user | Private |
| POST | /api/categories | Buat kategori baru | Private |
| PUT | /api/categories/:id | Ubah kategori | Private |
| DELETE | /api/categories/:id | Hapus kategori | Private |

## Activity Log
| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | /api/activity-logs | Lihat riwayat aktivitas user | Private |

## Stats
| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | /api/stats | Ringkasan jumlah todo per status | Private |

## Keterangan Akses
- **Public**: bisa diakses tanpa login
- **Private**: wajib login, kirim token JWT di header `Authorization: Bearer <token>`