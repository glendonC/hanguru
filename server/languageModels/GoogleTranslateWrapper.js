const LanguageModelInterface = require('./LanguageModelInterface');
const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateWrapper extends LanguageModelInterface {
    constructor(apiKey) {
        super();
        this.translate = new Translate({ key: apiKey });
    }

    async translate(text, sourceLang = 'ko', targetLang = 'en') {
        try {
            const [translation] = await this.translate.translate(text, { from: sourceLang, to: targetLang });
            return translation;
        } catch (error) {
            console.error('Error in Google Translate API:', error);
            throw error;
        }
    }

}

module.exports = GoogleTranslateWrapper;
