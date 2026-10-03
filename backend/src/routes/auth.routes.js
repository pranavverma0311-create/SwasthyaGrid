const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected identity verification endpoint
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
