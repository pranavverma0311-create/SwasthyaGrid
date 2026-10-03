const mongoose = require('mongoose');

/**
 * Health Check Controller
 * Verifies system availability and API connectivity.
 */
const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return res.status(200).json({
    success: true,
    message: 'SwasthyaGrid API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
};

module.exports = {
  getHealthStatus
};
