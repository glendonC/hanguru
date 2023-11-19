const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

async function generateSpeech(text, languageCode = 'ko-KR') {
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode, ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioContent = response.audioContent;
  return audioContent;
}

module.exports = { generateSpeech };
