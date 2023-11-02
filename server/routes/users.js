const express = require('express');
const bcrypt = require('bcryptjs'); // You will use bcryptjs for hashing passwords
const User = require('../models/User'); // Assuming you have a User model in the 'models' directory
const router = express.Router();

// POST route for user registration
router.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username, // make sure you're using the correct field names
        password: hashedPassword,
      });
  
      console.log("Attempting to save user:", newUser); // Log the user object
  
      const savedUser = await newUser.save();
  
      console.log("User saved:", savedUser); // Log the saved user
  
      res.status(201).send('User created');
    } catch (error) {
    console.error('Error caught during user registration:', error.message);
      res.status(400).send('Cannot register user');
    }
  });

// POST route for user login
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
