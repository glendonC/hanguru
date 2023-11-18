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
 * - On successful authentication: The user object with a message 'Successfully Authenticated'.
 * - On failure: 401 status with a message 'No User Exists or Password Incorrect'
 * 
 * Uses Passport for authentication. Passport utilizes a 'local' strategy to validate the user credentials
 * In case of errors during the login process, appropriate messages are returned to the client
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login Error:', err);
      throw err;
    }
    if (!user) {
      return res.status(401).json({ message: 'No User Exists or Password Incorrect' });
    }    
    else {
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login Error:', err);
          throw err;
        }
        res.json({ message: 'Successfully Authenticated', user: user });
        console.log(req.user);
      });
    }
  })(req, res, next);
});

module.exports = router;
