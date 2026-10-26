# Todo List Backend API

RESTful API backend untuk manajemen tugas harian (Todo List) yang dibangun menggunakan Node.js, Express, dan MongoDB Atlas. Dilengkapi dengan sistem autentikasi pengguna, validasi input, serta fitur pencarian, filtering, sorting, dan pagination.

## 🚀 Fitur Utama
- **Autentikasi Pengguna**: Registrasi dan login akun aman menggunakan JSON Web Token (JWT) dan bcryptjs.
- **Manajemen Todo (CRUD)**: Pengguna dapat menambah, melihat, memperbarui, dan menghapus tugas mereka sendiri.
- **Validasi Data**: Memastikan input data bersih dan sesuai aturan menggunakan `express-validator`.
- **Query Lanjutan**: Mendukung fitur pencarian (*search*), penyaringan (*filtering*), pengurutan (*sorting*), dan pembagian halaman (*pagination*).

## 🛠️ Teknologi yang Digunakan
- **Runtime & Framework**: Node.js, Express.js
- **Database**: MongoDB Atlas, Mongoose ODM
- **Autentikasi & Keamanan**: JSON Web Token (JWT), bcryptjs
- **Validasi**: express-validator
- **Pengujian API**: Postman

## ⚙️ Cara Instalasi & Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk menjalankan project di komputer lokal kamu:

1. **Clone repository ini** (atau download foldernya):
   ```bash
   git clone <url-repository-kamu>
   cd "backend todo list-windi"