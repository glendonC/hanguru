const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToGoogleCloud } = require('../utils/googleCloudStorage');
const upload = multer({ dest: 'uploads/' });
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.GCS_SERVICE_ACCOUNT });
const bucketName = process.env.GCS_BUCKET_NAME;
const Recording = require('../models/Recording');

/**
 * POST /
 * This endpoint handles the upload of a file to Google Cloud Storage and saves the recording metadata
 * It uses 'multer' for handling multipart/form-data, specifically for file uploads
 *
 * Request:
 * - The file to be uploaded should be sent as part of the form data with the key 'file'
 * - Associated text for the recording should be sent as part of the form data with the key 'associatedText'
 * 
 * Response:
 * - On successful upload, it returns a JSON object with a success message and the filename
 * - Saves the recording metadata (file name, audio URL, associated text) to the database
 * - In case of an error during the upload process, it returns a 500 status code with an error message
 */
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  try {
    const audioUrl = await uploadToGoogleCloud(file);

    const recordingName = req.body.customRecordingName || file.filename;

    const newRecording = new Recording({
      fileName: recordingName,
      audioUrl: audioUrl,
      associatedText: req.body.associatedText,
    });

    await newRecording.save();
    res.json({ message: 'File uploaded successfully.', fileName: recordingName });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error uploading to Google Cloud Storage', error });
  }
});


/**
 * DELETE /delete/:fileName
 * This endpoint deletes a specific file from Google Cloud Storage
 * The file to be deleted is specified by the fileName parameter in the URL
 *
 * Request parameters:
 * - fileName: The name of the file to be deleted from the Google Cloud Storage bucket
 * 
 * Response:
 * - On successful deletion, it returns a JSON object with a success message
 * - If there's an error in the file deletion process, it returns a 500 status code with an error message
 */
router.delete('/delete/:fileName', async (req, res) => {
    try {
      const fileName = req.params.fileName;
      await storage.bucket(bucketName).file(`uploads/${fileName}`).delete();
      res.json({ message: 'Audio file deleted successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'Error deleting the file', error });
    }
});

module.exports = router;
