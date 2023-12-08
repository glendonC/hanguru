const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const router = express.Router();
const fs = require('fs');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Initialize Google Cloud Speech-to-Text client
const speechClient = new SpeechClient({ keyFilename: process.env.SPEECH_TO_TEXT_SERVICE_ACCOUNT });

/**
 * POST /transcribe
 * Transcribes the audio file uploaded by the user using Google Cloud's Speech-to-Text API.
 * 
 * Request:
 * - The request should contain a 'multipart/form-data' encoded file with the key 'audio'.
 * 
 * Response:
 * - On success: Returns the transcribed text in JSON format.
 * - On error: 500 status with message 'Error transcribing audio'.
 * 
 * The endpoint handles audio file upload and transcribes it using Google Cloud Speech-to-Text.
 * It supports Korean language transcription (language code: 'ko-KR').
*/
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    const audio = {
      content: fs.readFileSync(file.path).toString('base64'),
    };
    const config = {
        languageCode: 'ko-KR',
      };      
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.json({ transcription });
    console.log('Response from Speech-to-Text:', response);

  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).send('Error transcribing audio');
  }
});

module.exports = router;
