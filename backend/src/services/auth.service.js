const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

const VALID_ROLES = ['CITIZEN', 'HEALTH_WORKER', 'OFFICER', 'ADMIN'];

/**
 * Generate a JWT token containing minimal, non-sensitive identity data
 * @param {Object} user 
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || config.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role
  };

  return jwt.sign(payload, secret, {
    expiresIn: config.jwtExpiresIn || '7d'
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token 
 * @returns {Object} Decoded payload
 */
const verifyJwtToken = (token) => {
  const secret = process.env.JWT_SECRET || config.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.verify(token, secret);
};

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Promise<{ user: Object, token: string }>}
 */
const registerUser = async ({ name, email, password, role = 'CITIZEN', area = 'General', phone, assignedWard }) => {
  if (!name || !name.trim()) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!email || !email.trim()) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(normalizedEmail)) {
    const error = new Error('Please provide a valid email address');
    error.statusCode = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const targetRole = role ? role.toUpperCase() : 'CITIZEN';
  if (!VALID_ROLES.includes(targetRole)) {
    const error = new Error(`Invalid role: ${role}. Supported roles are ${VALID_ROLES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // Check duplicate email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409;
    throw error;
  }

  // Hash password safely
  const passwordHash = await User.hashPassword(password);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: targetRole,
    area: area ? area.trim() : 'General',
    phone: phone ? phone.trim() : undefined,
    assignedWard: assignedWard ? assignedWard.trim() : undefined
  });

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token
  };
};

/**
 * Authenticate an existing user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ user: Object, token: string }>}
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error('Please provide both email and password');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    // Generic error to avoid exposing account existence
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account has been deactivated. Please contact an administrator.');
    error.statusCode = 403;
    throw error;
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token
  };
};

/**
 * Get user profile by ID safely (excluding sensitive fields)
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.toJSON();
};

module.exports = {
  generateToken,
  verifyJwtToken,
  registerUser,
  loginUser,
  getUserById,
  VALID_ROLES
};
