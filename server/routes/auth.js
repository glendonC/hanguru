const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

/**
  * POST /register
  * Handles user registration. It receives user data, encrypts the password using bcrypt, 
  * and saves the new user to the database.
  * 
  * Request body:
  * - username: The username of the new user.
  * - email: The email address of the new user.
  * - password: The password of the new user.
  * 
  * Response:
  * - On success: 201 status with message 'User created' and user details (username and email).
  * - On error: 400 status with message 'Cannot register user'.
  * Note: Password is hashed using bcrypt before storing in the database for security.
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
  * Handles user login using Passport's local strategy. Authenticates the user based on username and password.
  * 
  * Request body:
  * - username: The user's username.
  * - password: The user's password.
  * 
  * Response:
  * - On success: Returns the user object with message 'Successfully Authenticated'.
  * - On failure: 401 status with message 'No User Exists or Password Incorrect'.
  * 
  * Note: Utilizes Passport for authentication with a 'local' strategy.
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

    req.logIn(user, async (err) => {
      console.log('User logged in, Session ID:', req.sessionID);
      if (err) {
        console.error('Error in req.logIn:', err);
        return res.status(500).json({ message: 'Error during login process' });
      }

      res.cookie('connect.sid', req.sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000
      });
  
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

/**
  * calculateStreak
  * Calculates the user's login streak based on their login dates.
  * 
  * @param {Array} dates - Array of user's login dates.
  * @returns {number} The calculated login streak.
*/
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

/**
  * POST /logout
  * Handles user logout. Ends the user's session and sends a confirmation response.
  * 
  * Response:
  * - On success: 200 status with message 'Logged out'.
  * - On error: Returns error if logout process fails.
  * 
  * Note: Utilizes Passport's req.logout function to end the user session.
*/
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.status(200).send('Logged out');
  });
});


module.exports = router;
