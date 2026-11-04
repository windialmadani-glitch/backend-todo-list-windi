const mongoose = require('mongoose');

let cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI belum diatur');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB terhubung');
  } catch (error) {
    cached.promise = null;
    console.error('Koneksi MongoDB gagal:', error.message);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;