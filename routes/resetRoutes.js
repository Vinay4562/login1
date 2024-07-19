const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/authController');

// Forgot Password route
router.post('/forgot', forgotPassword);

// Reset Password route
router.post('/reset/:token', resetPassword);

module.exports = router;
