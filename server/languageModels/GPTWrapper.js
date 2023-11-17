const LanguageModelInterface = require('./LanguageModelInterface');
const { OpenAIAPI } = require('some-openai-library');

// This class provides a wrapper around GPT Model
// It extends LanguageModelInterface and implements a method to generate sentences
class GPTWrapper extends LanguageModelInterface {
    constructor() {
        super();
        this.api = new OpenAIAPI({ apiKey: process.env.OPENAI_API_KEY });
    }

    // Generates a sentence based on the provided input prompt
    async generateSentence(input) {
        const response = await this.api.generate({
            prompt: input,
            maxTokens: 50,
        });
        return response.choices[0].text.trim();
    }

}

module.exports = GPTWrapper;
