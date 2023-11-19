const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToGoogleCloud } = require('../utils/googleCloudStorage');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    try {
      await uploadToGoogleCloud(file);
      res.json({ message: 'File uploaded successfully to Google Cloud Storage.' });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading to Google Cloud Storage', error });
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    await uploadToGoogleCloud(file);
    res.json({ message: 'File uploaded successfully to Google Cloud Storage.' });
});

module.exports = router;
