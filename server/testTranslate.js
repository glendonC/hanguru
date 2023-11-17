// testTranslate.js

const GoogleTranslateWrapper = require('./languageModels/GoogleTranslateWrapper');
const googleTranslate = new GoogleTranslateWrapper(process.env.GOOGLE_API_KEY);

async function testTranslation() {
    try {
        const result = await googleTranslate.translate('안녕하세요', 'ko', 'en');
        console.log('Translation result:', result);
    } catch (error) {
        console.error('Translation error:', error);
    }
}

testTranslation();
