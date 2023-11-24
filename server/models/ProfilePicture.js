const mongoose = require('mongoose');

const profilePictureSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
});

const ProfilePicture = mongoose.model('ProfilePicture', profilePictureSchema);

module.exports = ProfilePicture;
