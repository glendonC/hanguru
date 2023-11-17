const LanguageModelInterface = require('./LanguageModelInterface');
const { OpenAIAPI } = require('some-openai-library');

class GPTWrapper extends LanguageModelInterface {
    constructor() {
        super();
        this.api = new OpenAIAPI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async generateSentence(input) {
        const response = await this.api.generate({
            prompt: input,
            maxTokens: 50,
        });
        return response.choices[0].text.trim();
    }

}

module.exports = GPTWrapper;
