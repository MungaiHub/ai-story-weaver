const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }
  try {
    await mongoose.connect(uri);
    console.log('[db] MongoDB connected');
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
