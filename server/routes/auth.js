const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

/**
 * POST /register
 * This endpoint handles user registration. It receives user data, encrypts the password, 
 * and saves the new user to the database
 * 
 * Request body:
 * - username: The username of the new user
 * - email: The email address of the new user
 * - password: The password of the new user
 * 
 * Response:
 * - On success: 201 status with a message 'User created' and user details (username and email)
 * - On error: 400 status with a message 'Cannot register user'
 * 
 * The password is hashed using bcrypt before storing it in the database
 */
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'User created', user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).json({ message: 'Cannot register user' });
  }
});


/**
 * POST /login
 * This endpoint handles user login using Passport's local strategy
 * It authenticates the user based on the provided username and password
 * 
 * Request body:
 * - Contains the username and password entered by the user
 * 
 * Response:
 * - On successful authentication: The user object with a message 'Successfully Authenticated'
 * - On failure: 401 status with a message 'No User Exists or Password Incorrect'
 * 
 * Uses Passport for authentication. Passport utilizes a 'local' strategy to validate the user credentials
 * In case of errors during the login process, appropriate messages are returned to the client
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ message: 'Error during login' });
    }
    if (!user) {
      return res.status(401).json({ message: 'No User Exists or Password Incorrect' });
    }

    console.log("User found in login route: ", user);

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Error in req.logIn:', err);
        return res.status(500).json({ message: 'Error during login process' });
      }

      console.log("User logged in: ", req.user);

      const currentDate = new Date().toISOString();
      if (!user.loginDates.some((date) => date.toISOString().split('T')[0] === currentDate.split('T')[0])) {
        user.loginDates.push(currentDate);

        try {
          await user.save();
        } catch (error) {
          console.error('Error saving user with updated loginDates:', error);
          throw error;
        }
      }

      const streak = calculateStreak(user.loginDates);

      res.json({ message: 'Successfully Authenticated', user: user, streak: streak });
    });
  })(req, res, next);
});


function calculateStreak(dates) {
  let streak = 0;
  let currentDate = new Date();

  for (let i = dates.length - 1; i >= 0; i--) {
    let loginDate = new Date(dates[i]);
    if (currentDate.toDateString() === loginDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// POST /signout
// This endpoint handles user sign-out
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.status(200).send('Logged out');
  });
});


module.exports = router;
