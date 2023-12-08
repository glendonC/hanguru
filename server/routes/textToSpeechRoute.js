const express = require('express');
const { generateSpeech } = require('../utils/textToSpeech');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

/**
 * POST /text-to-speech
 * Converts given text to speech using Google Cloud's Text-to-Speech API.
 * 
 * Request body:
 * - text: String representing the text to be converted to speech.
 * - voice: Object containing the configuration for the voice used in speech synthesis.
 * 
 * Response:
 * - On success: Sends the audio content of the synthesized speech.
 * - On error: 500 status with message 'Error generating speech'.
 * 
 * This endpoint synthesizes speech from text with the ability to specify voice options.
*/
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

/**
 * GET /text-to-speech/voices
 * Fetches and lists available voice options for text-to-speech synthesis in Korean.
 * 
 * Response:
 * - On success: Returns a JSON object with an array of voice options.
 * - On error: 500 status with message 'Error fetching voices'.
 * 
 * This endpoint retrieves available voices from Google Cloud's Text-to-Speech API,
 * filtering them for the Korean language and specific gender types (Male, Female, Neutral).
*/
router.get('/text-to-speech/voices', async (req, res) => {
  try {
    const [result] = await client.listVoices({});
    const filteredVoices = result.voices.filter(voice =>
      voice.languageCodes.some(code => code === 'ko-KR') &&
      (voice.ssmlGender === 'MALE' || voice.ssmlGender === 'FEMALE' || voice.ssmlGender === 'NEUTRAL')
    );
    res.json({ voices: filteredVoices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).send('Error fetching voices');
  }
});

module.exports = router;
