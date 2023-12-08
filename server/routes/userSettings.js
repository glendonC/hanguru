const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Middleware to check if the user is authenticated
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Callback to pass control to the next middleware
*/
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User not authenticated');
}

/**
 * POST /update-profile-picture
 * Updates the profile picture of the authenticated user.
 * Requires user authentication.
 * 
 * Request body:
 * - selectedProfilePicture: ID of the new profile picture to be set for the user.
 * 
 * Response:
 * - On success: 200 status with a success message and updated user data.
 * - On error: 500 status with error message.
 * 
 * Note: User must be authenticated to access this endpoint.
*/
router.post('/update-profile-picture', isAuthenticated, async (req, res) => {
  const { selectedProfilePicture } = req.body;
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

/**
 * POST /change-username
 * Changes the username of the authenticated user.
 * Requires user authentication.
 * 
 * Request body:
 * - newUsername: New username to be set for the user.
 * 
 * Response:
 * - On success: Sends a success message 'Username updated successfully'.
 * - On username taken: 400 status with message 'Username already taken'.
 * - On invalid username: 400 status with message 'Invalid username'.
 * - On error: 500 status with error message.
 * 
 * Note: User must be authenticated to access this endpoint.
*/
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

/**
 * POST /change-password
 * Changes the password of the authenticated user.
 * Requires user authentication.
 * 
 * Request body:
 * - newPassword: New password to be set for the user.
 * 
 * Response:
 * - On success: Sends a success message 'Password updated successfully'.
 * - On error: 500 status with error message.
 * 
 * Note: The new password is hashed using bcrypt before storing in the database.
*/
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
