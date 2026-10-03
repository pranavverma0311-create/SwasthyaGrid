const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    if (!config.mongodbUri) {
      console.warn('⚠️ [MongoDB] MONGODB_URI not defined. Skipping DB connection (Phase 1 mode).');
      return;
    }
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ [MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection error (${error.message}). Server running in standalone mode for initial setup.`);
  }
};

module.exports = connectDB;
