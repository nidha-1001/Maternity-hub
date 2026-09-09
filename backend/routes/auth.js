const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const localStore = require('../utils/localStore');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_maternityhub';

// Register (Public registration creates standard 'user' only)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Always enforce role 'user' for public registration
        const role = 'user';

        if (mongoose.connection.readyState === 1) {
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ message: 'User already exists' });

            const user = await User.create({ name, email, password, phone, role });
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

            return res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
        } else {
            // Local store fallback
            const userExists = localStore.findUserByEmail(email);
            if (userExists) return res.status(400).json({ message: 'User already exists' });

            const user = await localStore.createUser({ name, email, password, phone, role });
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

            return res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (mongoose.connection.readyState === 1) {
            let user = await User.findOne({ email });

            // Auto-provision admin account if it does not exist yet
            if (!user && email.toLowerCase() === 'admin@maternityhub.com' && password === 'admin123') {
                user = await User.create({
                    name: 'Platform Admin',
                    email: 'admin@maternityhub.com',
                    password: 'admin123',
                    phone: '+1 (800) 555-0199',
                    role: 'admin'
                });
            }

            if (user && (await user.matchPassword(password))) {
                const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
                return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
            }
        }

        // Local store fallback
        const localUser = localStore.findUserByEmail(email);
        if (localUser && (await localStore.verifyUserPassword(localUser, password))) {
            const token = jwt.sign({ id: localUser._id, role: localUser.role }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({ _id: localUser._id, name: localUser.name, email: localUser.email, role: localUser.role, token });
        }

        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Login failed' });
    }
});

module.exports = router;
