require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server di port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error('Server gagal dijalankan:', error.message);
    process.exit(1);
  }
};

// Hanya jalan di lokal. Di Vercel, app diekspor lewat api/index.js
if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;