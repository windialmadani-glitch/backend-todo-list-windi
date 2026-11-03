
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI belum diatur');
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB terhubung');
  } catch (error) {
    console.error('Koneksi MongoDB gagal:', error.message);
    throw error;
  }
};

module.exports = connectDB;
