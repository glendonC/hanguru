const express = require('express');
const router = express.Router();
const GoogleTranslateWrapper = require('../languageModels/GoogleTranslateWrapper');
const googleTranslate = new GoogleTranslateWrapper(process.env.GOOGLE_API_KEY);

/**
 * POST /translate
 * Handles text translation requests using the Google Translate API.
 * 
 * Request body:
 * - text: String representing the text to be translated.
 * - sourceLang: Language code of the source text.
 * - targetLang: Language code of the target translation.
 * 
 * Response:
 * - On success: Returns a JSON object containing the 'translation' of the provided text.
 * - On error: Returns a 500 status with an error message.
 * 
 * Utilizes 'GoogleTranslateWrapper' to interface with the Google Translate API.
 * The 'translate' method of the GoogleTranslateWrapper instance is called to perform the translation.
*/
router.post('/translate', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;
    console.log(req.body);
    try {
        const translation = await googleTranslate.translate(text, sourceLang, targetLang);
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;