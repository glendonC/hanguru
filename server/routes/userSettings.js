const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User not authenticated');
}

// Endpoint to change username
router.post('/change-username', isAuthenticated, async (req, res) => {
  const { newUsername } = req.body;

  const existingUser = await User.findOne({ username: newUsername });
  if (existingUser) {
    return res.status(400).send('Username already taken');
  } 

  if (!newUsername || newUsername.length < 3) {
    return res.status(400).send('Invalid username');
  }

  try {
    await User.findByIdAndUpdate(req.user.id, { username: newUsername });
    res.send('Username updated successfully');
  } catch (err) {
    res.status(500).send('Error updating username');
  }
});

// Endpoint to change password
router.post('/change-password', isAuthenticated, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).send('Password too short');
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.send('Password updated successfully');
  } catch (err) {
    res.status(500).send('Error updating password');
  }
});

module.exports = router;
