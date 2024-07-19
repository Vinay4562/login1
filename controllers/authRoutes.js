const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', authUser);

// Get logged-in user
router.get('/user', authMiddleware, getUser);

// Define route for forgot password
router.post('/reset/forgot', authController.forgotPassword);

// Reset Password Route
router.post('/reset/password/:token', authController.resetPassword);

module.exports = router;
