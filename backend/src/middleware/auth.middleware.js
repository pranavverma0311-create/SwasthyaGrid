const { verifyJwtToken } = require('../services/auth.service');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Validates JWT from 'Authorization: Bearer <token>' header and attaches user to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Missing or malformed Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing.'
      });
    }

    let decoded;
    try {
      decoded = verifyJwtToken(token);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token.'
      });
    }

    // Lookup user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found. Authentication rejected.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User account is deactivated.'
      });
    }

    // Attach safe user object to request
    req.user = user.toJSON();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed.'
    });
  }
};

/**
 * Role-Based Authorization Middleware
 * Restricts route access to specified user roles.
 * @param  {...string} allowedRoles 
 */
const requireRole = (...allowedRoles) => {
  // Support either requireRole('ADMIN') or requireRole('ADMIN', 'OFFICER') or requireRole(['ADMIN', 'OFFICER'])
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required before role verification.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Role '${req.user.role}' is not authorized for this resource.`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requireRoles: requireRole // Alias for readability
};
