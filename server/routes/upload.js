const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToGoogleCloud } = require('../utils/googleCloudStorage');
const upload = multer({ dest: 'uploads/' });
const { storage, bucketName } = require('../utils/googleCloudConfig');
const Recording = require('../models/Recording');

/**
 * POST /
 * Handles the upload of audio files to Google Cloud Storage and saves recording metadata in the database.
 * Utilizes 'multer' for handling multipart/form-data, specifically for file uploads.
 * 
 * Request:
 * - File: The audio file to be uploaded, sent as part of form data with key 'file'.
 * - AssociatedText: Text associated with the recording, sent as part of form data with key 'associatedText'.
 * 
 * Response:
 * - On success: Returns JSON with a success message and the file name.
 * - On error: Returns a 500 status with an error message.
 * 
 * Note: Saves recording metadata (file name, audio URL, associated text) to the database.
*/
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  try {
    console.log('Uploading file to GCS:', file.filename);
    const audioUrl = await uploadToGoogleCloud(file);
    console.log('File uploaded to GCS:', audioUrl);

    const recordingName = req.body.customRecordingName || file.filename;

    console.log('Saving recording to MongoDB:', recordingName);
    const newRecording = new Recording({
      fileName: recordingName,
      gcsFileName: file.filename,
      audioUrl: audioUrl,
      associatedText: req.body.associatedText,
    });

    await newRecording.save();
    console.log('Recording saved:', newRecording);
    res.json({ message: 'File uploaded successfully.', fileName: recordingName });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'Error uploading to Google Cloud Storage', error: error.message });
  }
});


/**
 * DELETE /delete/:customName
 * Deletes a specified file from Google Cloud Storage.
 * The file name is obtained from the URL parameter.
 * 
 * Request parameters:
 * - customName: The name of the file to be deleted from Google Cloud Storage.
 * 
 * Response:
 * - On success: Returns JSON with a success message.
 * - On error: Returns a 500 status with an error message.
 * 
 * Note: The deletion process targets files in the Google Cloud Storage bucket.
*/
router.delete('/delete/:customName', async (req, res) => {
  try {
    const customName = req.params.customName;
    const recording = await Recording.findOne({ fileName: customName });
    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    // Delete the file from GCS
    await storage.bucket(bucketName).file(`uploads/${recording.gcsFileName}`).delete();

    // Delete the recording from MongoDB
    await Recording.deleteOne({ _id: recording._id });
    
    res.json({ message: 'Audio file deleted successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error deleting the file', error: error.message });
  }
});



module.exports = router;
