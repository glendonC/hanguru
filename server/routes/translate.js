const express = require('express');
const router = express.Router();
const GoogleTranslateWrapper = require('../languageModels/GoogleTranslateWrapper');
const googleTranslate = new GoogleTranslateWrapper(process.env.GOOGLE_API_KEY);

router.post('/translate', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;
    try {
        const translation = await googleTranslate.translate(text, sourceLang, targetLang);
        res.json({ translation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;