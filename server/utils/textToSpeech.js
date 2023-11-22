const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

/**
 * Asynchronously generates speech from text using Google Cloud's Text-to-Speech API.
 *
 * @param {string} text - The text to be converted into speech
 * @param {string} voiceName - The name of the voice to be used for the speech synthesis
 *   The voice name should correspond to one of the available voices in Google Cloud Text-to-Speech in KOR
 * 
 * @returns {Promise<Buffer>} - A promise that resolves to the buffer containing the MP3 audio content.
 * 
 */
async function generateSpeech(text, voiceName) {
  const request = {
    input: { text: text },
    voice: { languageCode: 'ko-KR', name: voiceName },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioContent = response.audioContent;
  return audioContent;
}

module.exports = { generateSpeech };
