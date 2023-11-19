const express = require('express');
const { generateSpeech } = require('../utils/textToSpeech');
const router = express.Router();

router.post('/text-to-speech', async (req, res) => {
  try {
    const text = req.body.text;
    const audioContent = await generateSpeech(text);
    res.send(audioContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating speech');
  }
});

module.exports = router;
