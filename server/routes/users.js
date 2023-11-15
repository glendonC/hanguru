const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// POST route for User Registration
router.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
  
      console.log("Attempting to save user:", newUser);
  
      const savedUser = await newUser.save();
  
      console.log("User saved:", savedUser);
  
      res.status(201).send('User created');
    } catch (error) {
    console.error('Error caught during user registration:', error.message);
      res.status(400).send('Cannot register user');
    }
  });

// POST route for User Login
router.post('/login', async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with user
    res.json({ message: "Logged in successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
