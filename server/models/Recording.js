const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    fileName: String,
    audioUrl: String,
    associatedText: String,
    uploadDate: { type: Date, default: Date.now },
  });
  

module.exports = mongoose.model('Recording', recordingSchema);