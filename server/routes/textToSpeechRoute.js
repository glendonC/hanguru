const express = require('express');
const { generateSpeech } = require('../utils/textToSpeech');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

/**
 * POST /text-to-speech
 * This endpoint converts a given text to speech using Google Cloud's Text-to-Speech API.
 * It allows for specifying different voice options.
 *
 * Request body:
 * - text: A string representing the text to be converted to speech.
 * - voice: An object containing the configuration for the voice to be used in the speech synthesis.
 * 
 * Response:
 * - The response contains the audio content of the synthesized speech.
 * 
 * In case of an error during the text-to-speech conversion process, a 500 status code is sent with an error message.
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
 * POST /text-to-speech
 * This endpoint converts a given text to speech using Google Cloud's Text-to-Speech API.
 * It allows for specifying different voice options.
 *
 * Request body:
 * - text: A string representing the text to be converted to speech.
 * - voice: An object containing the configuration for the voice to be used in the speech synthesis.
 * 
 * Response:
 * - The response contains the audio content of the synthesized speech.
 * 
 * In case of an error during the text-to-speech conversion process, a 500 status code is sent with an error message.
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
