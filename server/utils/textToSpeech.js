const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

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
