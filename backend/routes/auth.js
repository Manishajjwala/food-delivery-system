const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to create token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET is not defined in .env');
    throw new Error('JWT_SECRET missing');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Signup attempt:', email);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found in DB');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Detailed Login Error:', error);
    res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
});

module.exports = router;
