/**
 * Standard API Response Formatter
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, error = 'An error occurred', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details })
  });
};

module.exports = {
  successResponse,
  errorResponse
};
