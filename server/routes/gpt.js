const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate-sentence', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: req.body.prompt }
            ],
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        const assistantMessage = response.data.choices[0].message.content;
        res.json({ sentence: assistantMessage });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Error generating sentence');
    }
});

module.exports = router;
