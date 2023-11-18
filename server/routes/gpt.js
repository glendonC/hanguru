const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate-sentence', async (req, res) => {
    const { vocab } = req.body;
    const prompt = `Create a sentence in Korean using the word '${vocab}' and apply the appropriate grammar conjugation. Then, provide the same sentence with a blank in place of the conjugated '${vocab}', the correct conjugated form of '${vocab}' as the answer, the grammar point used for this conjugation, and the English translation of the sentence.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const gptResponse = response.data.choices[0].message.content; 
        console.log("GPT Response:", gptResponse);
        
        const lines = gptResponse.split('\n').map(line => line.trim());
        const sentenceWithBlankIndex = lines.findIndex(line => line.startsWith('Blank:'));
        const correctAnswerIndex = lines.findIndex(line => line.startsWith('Answer:'));
        const grammarPointIndex = lines.findIndex(line => line.includes('Grammar point:'));
        const translationIndex = lines.findIndex(line => line.startsWith('English translation:'));
        
        const sentenceWithBlank = sentenceWithBlankIndex !== -1 ? lines[sentenceWithBlankIndex].split('Blank: ')[1] : 'No sentence with blank provided';
        const correctAnswer = correctAnswerIndex !== -1 ? lines[correctAnswerIndex].split('Answer: ')[1] : 'No correct answer provided';
        const grammarPoint = grammarPointIndex !== -1 ? lines[grammarPointIndex].split('Grammar point: ')[1] : 'No grammar point provided';
        const translation = translationIndex !== -1 ? lines[translationIndex].split('English translation: ')[1] : 'No translation available';
        
        res.json({
            sentenceWithBlank: sentenceWithBlank,
            correctAnswer: correctAnswer,
            grammarPoint: grammarPoint,
            translation: translation
        });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Error generating sentence');
    }
});


module.exports = router;
