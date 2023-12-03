const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function isAuthenticated(req, res, next) {
  console.log("Session ID from isAuthenticated middleware: ", req.sessionID);
  console.log("Session data from isAuthenticated middleware: ", req.session);
  console.log("User data from isAuthenticated middleware: ", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User not authenticated');
}

router.post('/update-profile-picture', isAuthenticated, async (req, res) => {
  const { selectedProfilePicture } = req.body;
  console.log("Session ID in update-profile-picture: ", req.sessionID);
  console.log("Session data in update-profile-picture: ", req.session);
  console.log("User data in update-profile-picture: ", req.user);
  if (!req.user || !req.user.id) {
    return res.status(401).send('User not authenticated');
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: selectedProfilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Error updating profile picture' });
  }
});

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

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.send('Password updated successfully');
  } catch (err) {
    res.status(500).send('Error updating password');
  }
});

module.exports = router;
