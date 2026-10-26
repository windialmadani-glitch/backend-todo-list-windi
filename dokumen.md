# Struktur Dokumen

## User
- name (String, wajib)
- email (String, wajib, unik)
- password (String, wajib, di-hash)
- createdAt (Date, otomatis)

## Todo
- title (String, wajib)
- description (String, opsional)
- status (String: pending / in-progress / done)
- dueDate (Date, opsional)
- user (ObjectId, referensi ke User)
- category (ObjectId, referensi ke Category)
- createdAt (Date, otomatis)

## Category
- name (String, wajib)
- user (ObjectId, referensi ke User)
- createdAt (Date, otomatis)

## Activity Log
- user (ObjectId, referensi ke User)
- action (String, contoh: CREATE_TODO, UPDATE_TODO, DELETE_TODO)
- todo (ObjectId, referensi ke Todo)
- description (String)
- createdAt (Date, otomatis)