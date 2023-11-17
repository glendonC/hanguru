class LanguageModelInterface {
    async generateSentence(input) {
        throw new Error("generateSentence method not implemented");
    }

    async translate(text, sourceLang, targetLang) {
        throw new Error("translate method not implemented");
    }

    async checkGrammar(text) {
        throw new Error("checkGrammar method not implemented");
    }
}

module.exports = LanguageModelInterface;
