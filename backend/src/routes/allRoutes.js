const express = require('express');
const router = express.Router();

// Import controllers
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

module.exports = router;