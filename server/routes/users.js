const express = require('express');
const router = express.Router();
const pool = require('../db/database');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

async function generateSignedUrl(imageUrl) {
  const bucketName = 'hanguru-profile-pic-bucket';
  const fileName = imageUrl.split('/').slice(-1)[0];
  const signedUrl = await storage.bucket(bucketName).file(fileName).getSignedUrl({
    action: 'read',
    expires: Date.now() + 5 * 60 * 1000,
  });
  return signedUrl[0];
}


router.get('/get-users', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile-pictures/:id', async (req, res) => {
  const pictureId = req.params.id;

  try {
    const [rows, fields] = await pool.query('SELECT image_url FROM profile_pictures WHERE id = ?', [pictureId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    const imageUrl = rows[0].image_url;
    const signedUrl = await generateSignedUrl(imageUrl);

    res.json({ signedUrl });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile-pictures', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM profile_pictures');
    
    const profilePictures = rows.map((row) => ({
      id: row.id,
      imageUrl: row.image_url,
    }));

    res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload', (req, res) => {
    const userId = req.user.id;
    const imageUrl = req.body.imageUrl;

    pool.query(
        'INSERT INTO profile_pictures (user_id, image_url) VALUES (?, ?)',
        [userId, imageUrl],
        (err, results) => {
        if (err) {
            console.error('Error saving profile picture:', err);
            return res.status(500).send('Error saving profile picture');
        }
        return res.status(200).send('Profile picture saved successfully');
        }
    );
});

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;

  pool.query(
    'SELECT image_url FROM profile_pictures WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching profile picture:', err);
        return res.status(500).send('Error fetching profile picture');
      }
      if (results.length === 0) {
        return res.status(404).send('Profile picture not found');
      }
      const imageUrl = results[0].image_url;
      
      res.setHeader('Content-Type', 'image/jpeg');
      res.sendFile(path.join(__dirname, '..', imageUrl));
    }
  );
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
