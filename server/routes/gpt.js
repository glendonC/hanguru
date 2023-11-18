const express = require('express');
const router = express.Router();
const axios = require('axios');


/**
 * POST /generate-sentence
 * This endpoint generates a question in Korean based on the given vocabulary word(s) and provides its English translation.
 * It uses the OpenAI GPT-3.5-turbo model to generate the question
 * 
 * Request body:
 * - vocab: A string of comma-separated Korean vocabulary word(s)
 * 
 * Response:
 * - question: The generated question in Korean.
 * - translation: The English translation of the generated question.
 * 
 * If there's an error with the OpenAI API request, a 500 status code is sent with an error message
 */
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

/**
 * POST /check-answer
 * This endpoint checks if a user's sentence correctly and naturally answers the provided question and uses the specified 
 * vocabulary word(s) appropriately. It utilizes the OpenAI GPT-3.5-turbo model for evaluation
 * 
 * Request body:
 * - userSentence: The sentence written by the user in response to the question
 * - question: The question that the user is responding to
 * - vocab: The vocabulary word(s) that should be included in the user's sentence
 * 
 * Response:
 * - feedback: Feedback from GPT-3.5-turbo model on the correctness and naturalness of the user's sentence
 * 
 * In case of an error with the OpenAI API request, a 500 status code is sent with an error message
 */
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
