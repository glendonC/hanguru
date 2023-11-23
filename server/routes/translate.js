const express = require('express');
const router = express.Router();
const GoogleTranslateWrapper = require('../languageModels/GoogleTranslateWrapper');
const googleTranslate = new GoogleTranslateWrapper(process.env.GOOGLE_API_KEY);

/**
 * POST /translate
 * This endpoint handles requests for text translation
 * It utilizes the GoogleTranslateWrapper to interface with the Google Translate API
 * 
 * Request body:
 * - text: The text to be translated
 * - sourceLang: The language code of the source text
 * - targetLang: The language code of the target translation
 * 
 * Response:
 * - On success: Returns a JSON object containing the 'translation' of the provided text
 * - On error: Returns a 500 status with an error message
 * 
 * The translation is done by calling the 'translate' method of the GoogleTranslateWrapper instance
 * This method communicates with the Google Translate API to get the translated text
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