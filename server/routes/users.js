const express = require('express');
const router = express.Router();
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const User = require('../models/User');
const ProfilePicture = require('../models/ProfilePicture');

/**
 * Function to generate a signed URL for accessing a stored image
 * @param {string} imageUrl The URL of the image stored in Google Cloud Storage
 * @returns {Promise<string>} A promise that resolves to a signed URL of the image
*/
async function generateSignedUrl(imageUrl) {
  const bucketName = 'hanguru-profile-pic-bucket';
  const fileName = imageUrl.split('/').pop();
  console.log("Image URL: ", imageUrl)
  try {
    const options = {
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, 
    };

    const [signedUrl] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}
/**
 * GET /get-users
 * Retrieves all user data from the database.
 * 
 * Response:
 * - On success: JSON array of all users.
 * - On error: 500 status with error message 'Internal Server Error'.
*/
router.get('/get-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /profile-pictures/:id
 * Retrieves a specific profile picture by its ID and generates a signed URL for it.
 * 
 * Request parameters:
 * - id: ID of the profile picture to retrieve.
 * 
 * Response:
 * - On success: JSON object with the signed URL of the image.
 * - On not found: 404 status with error message 'Profile picture not found'.
 * - On error: 500 status with error message 'Internal Server Error'.
*/
router.get('/profile-pictures/:id', async (req, res) => {
  const pictureId = req.params.id;

  try {
    const picture = await ProfilePicture.findById(pictureId);
    if (!picture) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }
    const signedUrl = await generateSignedUrl(picture.imageUrl);

    res.json({ imageUrl: signedUrl });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /profile-pictures
 * Retrieves all profile pictures from the database.
 * 
 * Response:
 * - On success: JSON array of all profile pictures.
 * - On error: 500 status with error message 'Internal Server Error'.
*/
router.get('/profile-pictures', async (req, res) => {
  try {
    console.log('Fetching profile pictures...');
    const pictures = await ProfilePicture.find({});
    console.log(`Found ${pictures.length} pictures, generating URLs...`);
    const profilePictures = pictures.map(picture => ({
      id: picture._id,
      imageUrl: picture.imageUrl,
    }));
    console.log('Sending response with profile pictures.');
    res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

/**
 * POST /upload
 * Saves a profile picture's metadata in the database.
 * 
 * Request body:
 * - userId: ID of the user to which the profile picture belongs.
 * - imageUrl: URL of the uploaded profile picture.
 * 
 * Response:
 * - On success: 200 status with success message 'Profile picture saved successfully'.
 * - On error: 500 status with error message.
*/
router.post('/upload', async (req, res) => {
  const { userId, imageUrl } = req.body;

  try {
    const newPicture = new ProfilePicture({ userId, imageUrl });
    await newPicture.save();
    res.status(200).send('Profile picture saved successfully');
  } catch (error) {
  }
});

/**
 * GET /:userId
 * Retrieves the profile picture for a specific user.
 * 
 * Request parameters:
 * - userId: ID of the user whose profile picture is to be retrieved.
 * 
 * Response:
 * - On success: JSON object with the URL of the user's profile picture.
 * - On not found: 404 status with error message 'Profile picture not found'.
 * - On error: 500 status with error message 'Error fetching profile picture'.
*/
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const picture = await ProfilePicture.findOne({ userId });
    if (!picture) {
      return res.status(404).send('Profile picture not found');
    }
    const imageUrl = picture.imageUrl;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).send('Error fetching profile picture');
  }
});

/**
 * GET /user/:userId/login-streak
 * Calculates and returns the login streak of a specific user.
 * 
 * Request parameters:
 * - userId: ID of the user whose login streak is to be calculated.
 * 
 * Response:
 * - On success: JSON object with the user's login streak.
 * - On error: 500 status with error message.
*/
router.get('/user/:userId/login-streak', (req, res) => {
  User.findById(req.params.userId, (err, user) => {
      if (err) {
          return res.status(500).send('Error fetching user data');
      }
      if (!user) {
          return res.status(404).send('User not found');
      }

      const streak = calculateStreak(user.loginDates);
      res.json({ streak });
  });
});

/**
 * Function to calculate the login streak from an array of login dates
 * @param {Array<Date>} dates Array of user's login dates
 * @returns {number} The calculated login streak
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
 * GET /current-user
 * Retrieves information about the currently authenticated user.
 * 
 * Response:
 * - If authenticated: JSON object with the current user's data.
 * - If not authenticated: 401 status with message 'Not authenticated'.
*/
router.get('/current-user', (req, res) => {
  console.log('Received request to /api/users/current-user');
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;