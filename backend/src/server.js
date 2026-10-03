const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security and utility middleware
app.use(cors({
  origin: config.frontendUrl || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'SwasthyaGrid API',
    tagline: 'Connecting Health Signals. Enabling Faster Response.',
    version: '1.0.0',
    status: 'operational',
    healthCheck: '/api/health'
  });
});

// API Routes
app.use('/api', routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
let server = null;

const startServer = async () => {
  // Connect to MongoDB (handles standalone mode gracefully if DB is unavailable)
  await connectDB();

  server = app.listen(config.port, () => {
    console.log(`🚀 [SwasthyaGrid Server] Running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    console.log(`🩺 [Health Check] Available at http://localhost:${config.port}/api/health`);
  });

  return server;
};

// Auto-start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
