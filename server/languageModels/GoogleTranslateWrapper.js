const LanguageModelInterface = require('./LanguageModelInterface');
const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateWrapper extends LanguageModelInterface {
    constructor() {
        super();
        this.translate = new Translate({ projectId: process.env.GOOGLE_PROJECT_ID });
    }

    async translate(text, sourceLang, targetLang) {
        const [translation] = await this.translate.translate(text, { from: sourceLang, to: targetLang });
        return translation;
    }

}

module.exports = GoogleTranslateWrapper;
