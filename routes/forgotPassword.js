const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email provider
    auth: {
        user: 'vkvinaykumar391@gmail.com',
        pass: 'azyr tgtt htra mrpa'
    }
});

const JWT_SECRET = 'scsccsvxcnmsabcnsnmcbasnbcnascsccs'; // Replace with your actual secret

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
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
                res.status(500).send('Error sending recovery email');
            } else {
                res.status(200).send('Recovery email sent');
            }
        });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password reset successfully');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
});

module.exports = router;