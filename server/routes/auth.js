const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).send('Cannot register user');
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).send('No User Exists or Password Incorrect');
    }    
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Successfully Authenticated');
        console.log(req.user);
      });
    }
  })(req, res, next);
});

module.exports = router;
