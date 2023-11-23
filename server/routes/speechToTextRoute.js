const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const router = express.Router();
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

const speechClient = new SpeechClient({ keyFilename: process.env.SPEECH_TO_TEXT_SERVICE_ACCOUNT });

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
