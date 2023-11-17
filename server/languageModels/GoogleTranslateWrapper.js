const LanguageModelInterface = require('./LanguageModelInterface');
const { Translate } = require('@google-cloud/translate').v2;

// This class provides a wrapper around the Google Translate API
// It extends the LanguageModelInterface and implements translation functionality
class GoogleTranslateWrapper extends LanguageModelInterface {
    constructor(apiKey) {
        super();
        console.log(apiKey)
        this.translateClient = new Translate({ key: apiKey });
    }
    // Translates the given text from the source language to the target language using Google API
    async translate(text, sourceLang = 'en', targetLang = 'ko') {
        try {
            const [translation] = await this.translateClient.translate(text, { from: sourceLang, to: targetLang });
            return translation;
        } catch (error) {
            console.error('Error in Google Translate API:', error);
            throw error;
        }
    }
}

module.exports = GoogleTranslateWrapper;
