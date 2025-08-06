const express = require('express');
const router = express.Router();
const User = require('./User'); // If User.js is in the same directory as api.js

// Input validation helper
const validateInput = (email, password, name = null) => {
  const errors = {};
  
  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }
  
  if (name !== null && (!name || name.trim().length < 2)) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  return errors;
};

// @route   POST /api/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    // Validate input
    const validationErrors = validateInput(email, password, name);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create and save new user
    const newUser = new User({ 
      name: name.trim(),
      email: email.toLowerCase().trim(), 
      password 
    });
    
    await newUser.save();

    // Return success (don't send back password)
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// @route   POST /api/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Validate input
    const validationErrors = validateInput(email, password);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password using the comparePassword method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful
    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// @route   GET /api/test
// @desc    Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API routes working!' });
});

module.exports = router;