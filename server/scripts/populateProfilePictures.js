const { Storage } = require('@google-cloud/storage');
const mongoose = require('mongoose');
const ProfilePicture = require('../models/ProfilePicture');

mongoose.connect('mongodb+srv://gchin:bob@hanguruprod.mr25ass.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const storage = new Storage();
const bucketName = 'hanguru-profile-pic-bucket';

async function insertProfilePictures() {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();

    const profilePictureDocs = files.map(file => {
      return {
        name: file.name,
        imageUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`, // Construct the URL
      };
    });

    await ProfilePicture.insertMany(profilePictureDocs);
    console.log('Profile pictures inserted into MongoDB:', profilePictureDocs.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

insertProfilePictures();
