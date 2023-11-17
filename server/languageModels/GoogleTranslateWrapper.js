// GoogleTranslateWrapper.js

const LanguageModelInterface = require('./LanguageModelInterface');
const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateWrapper extends LanguageModelInterface {
    constructor(apiKey) {
        super();
        console.log(apiKey)
        this.translateClient = new Translate({ key: apiKey }); // Renamed the client instance
    }

    async translate(text, sourceLang = 'ko', targetLang = 'en') {
        try {
            const [translation] = await this.translateClient.translate(text, { from: sourceLang, to: targetLang });
            return translation;
        } catch (error) {
            console.error('Error in Google Translate API:', error);
            throw error; // or handle it as per your application's error handling policy
        }
    }
}

module.exports = GoogleTranslateWrapper;
