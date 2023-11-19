const express = require('express');
const { generateSpeech } = require('../utils/textToSpeech');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, voice } = req.body;
    const audioContent = await generateSpeech(text, voice);
    res.send(audioContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating speech');
  }
});

router.get('/text-to-speech/voices', async (req, res) => {
  try {
    const [result] = await client.listVoices({});
    const filteredVoices = result.voices.filter(voice =>
      voice.languageCodes.some(code => code === 'ko-KR') && // Filter by Korean language
      (voice.ssmlGender === 'MALE' || voice.ssmlGender === 'FEMALE' || voice.ssmlGender === 'NEUTRAL') // Filter by gender
    );
    res.json({ voices: filteredVoices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).send('Error fetching voices');
  }
});


module.exports = router;
