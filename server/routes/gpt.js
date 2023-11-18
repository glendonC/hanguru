const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate-sentence', async (req, res) => {
    const { vocab } = req.body;
    const prompt = `Create a question in Korean that prompts someone to write a sentence using the word '${vocab}'. Then provide its English translation in the following format: 'Korean Question: [Korean question] English Translation: [English translation].'`;
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
        
        let question = gptResponse.match(/Korean Question:\s*([^\n]+)/)?.[1].trim() || 'No question provided';
        let translation = gptResponse.match(/English Translation:\s*([^\n]+)/)?.[1].trim() || 'No translation available';
        
        console.log("Sending response:", { question, translation });

        res.json({
            question: question,
            translation: translation
        });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Error generating question');
    }
});

router.post('/check-answer', async (req, res) => {
    const { userSentence, question, vocab } = req.body;
    const prompt = `Check if the sentence '${userSentence}' correctly and naturally answers the question '${question}' and uses the word '${vocab}' appropriately. Provide feedback on the correctness and naturalness.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const feedback = response.data.choices[0].message.content;
        console.log("GPT Feedback:", feedback);

        res.json({ feedback });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Error checking answer');
    }
});


module.exports = router;
