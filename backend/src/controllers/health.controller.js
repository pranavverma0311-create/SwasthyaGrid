/**
 * Health Check Controller
 * Verifies system availability and API connectivity.
 */
const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'SwasthyaGrid API is running'
  });
};

module.exports = {
  getHealthStatus
};
