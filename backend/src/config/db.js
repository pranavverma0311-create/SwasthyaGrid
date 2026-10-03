const mongoose = require('mongoose');
const config = require('./env');

/**
 * Mask sensitive credentials from MongoDB URI for safe logging
 * @param {string} uri 
 * @returns {string} Sanitized URI
 */
const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/(.*?):(.*?)@/, '//***:***@');
};

/**
 * Safe MongoDB connection service with error handling and credential protection.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || config.mongodbUri;

  if (!uri) {
    console.warn('⚠️  [MongoDB] MONGODB_URI not configured. Running in standalone mode.');
    return null;
  }

  const sanitized = sanitizeMongoUri(uri);

  try {
    console.log(`📡 [MongoDB] Connecting to database (${sanitized})...`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: config.nodeEnv !== 'production'
    });

    console.log(`✅ [MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  [MongoDB] Connection failed: ${error.message}`);
    console.warn('ℹ️  [MongoDB] Application continuing in fallback/standalone mode without active DB.');
    return null;
  }
};

/**
 * Check if MongoDB connection is active
 * @returns {boolean}
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get human-readable connection status
 * @returns {string}
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// Event listeners for connection lifecycle
mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  [MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ [MongoDB] Reconnected to database.');
});

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.isConnected = isConnected;
module.exports.getConnectionStatus = getConnectionStatus;
module.exports.sanitizeMongoUri = sanitizeMongoUri;
