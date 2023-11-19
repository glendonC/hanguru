const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToGoogleCloud } = require('../utils/googleCloudStorage');
const upload = multer({ dest: 'uploads/' });
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucketName = process.env.GCS_BUCKET_NAME;
router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    try {
      await uploadToGoogleCloud(file);
      res.json({ message: 'File uploaded successfully to Google Cloud Storage.' });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading to Google Cloud Storage', error });
    }
});

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
