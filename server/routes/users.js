const express = require('express');
const router = express.Router();
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

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


const User = require('../models/User');
const ProfilePicture = require('../models/ProfilePicture');

router.get('/get-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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


// router.get('/profile-pictures', async (req, res) => {
//   try {
//     console.log('Fetching profile pictures...');
//     const pictures = await ProfilePicture.find({});
//     console.log(`Found ${pictures.length} pictures, generating URLs...`);
//     const profilePictures = pictures.map(picture => ({
//       id: picture._id,
//       imageUrl: picture.imageUrl,
//     }));
//     console.log('Sending response with profile pictures.');
//     res.json(profilePictures);
//   } catch (error) {
//     console.error('Error fetching profile pictures:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });
router.get('/profile-pictures', async (req, res) => {
  res.json({ message: "Route hit successfully" });
});




router.post('/upload', async (req, res) => {
  const { userId, imageUrl } = req.body;

  try {
    const newPicture = new ProfilePicture({ userId, imageUrl });
    await newPicture.save();
    res.status(200).send('Profile picture saved successfully');
  } catch (error) {
  }
});

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

router.get('/current-user', (req, res) => {
  console.log('Received request to /api/users/current-user');
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});




module.exports = router;
