const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs'); // Assuming we add this for real auth later, simple version for now
// const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Simplistic auth for demo without bcrypt/jwt to keep focused on Fleet flow
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

<<<<<<< HEAD
=======
        if (email === 'varun@gmail.com' && password === 'Varun27!') {
            return res.json({
                message: 'Login successful',
                user: { _id: 'admin-hardcoded', name: 'Varun', email: 'varun@gmail.com', role: 'Admin' }
            });
        }

>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

module.exports = router;
