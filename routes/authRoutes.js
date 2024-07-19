const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { registerUser, authUser, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Make sure this path is correct

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', authUser);

// Get logged-in user
router.get('/user', authMiddleware, getUser);

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email provider
    auth: {
        user: 'vkvinaykumar391@gmail.com',
        pass: 'azyr tgtt htra mrpa'
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'scsccsvxcnmsabcnsnmcbasnbcnascsccs'; // Use environment variable for secret

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        const mailOptions = {
            from: 'vkvinaykumar391@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetLink}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending recovery email' });
            } else {
                return res.status(200).json({ message: 'Recovery email sent' });
            }
        });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
