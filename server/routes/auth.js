const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // create a new user instance and save it in the database
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send('User created');
  } catch {
    res.status(400).send('Cannot register user');
  }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

// Export the router
module.exports = router;
