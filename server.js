const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const forgotPassword = require('./routes/forgotPassword');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const cors = require('cors');

// Load config
dotenv.config();

// Initialize express
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet()); // Add security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS for all routes
app.use(session({
    secret: process.env.SESSION_SECRET || 'sadkadodkaodo', // Provide a secret here
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using https in production
}));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/forgot-password', forgotPassword);

// Logout route
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Default route to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
