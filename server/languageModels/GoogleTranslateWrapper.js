const LanguageModelInterface = require('./LanguageModelInterface');
const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateWrapper extends LanguageModelInterface {
    constructor(apiKey) {
        super();
        console.log(apiKey)
        this.translateClient = new Translate({ key: apiKey });
    }

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
