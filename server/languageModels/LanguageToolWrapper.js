const LanguageModelInterface = require('./LanguageModelInterface');
const axios = require('axios');

class LanguageToolWrapper extends LanguageModelInterface {
    constructor() {
        super();
        this.baseUrl = 'https://api.languagetool.org/v2/check';
    }

    async checkGrammar(text) {
        const response = await axios.post(this.baseUrl, {
            text: text,
            language: 'ko'
        });
        return response.data.matches;
    }

}

module.exports = LanguageToolWrapper;
