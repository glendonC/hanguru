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

  // Basic validation for new username
  if (!newUsername || newUsername.length < 3) {
    return res.status(400).send('Invalid username');
  }

  // Additional validation checks can be added here (e.g., check if username already exists)

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

  // Basic validation for new password
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
