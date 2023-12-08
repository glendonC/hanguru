const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * POST /generate-sentence
 * Generates a question in Korean based on given vocabulary word(s) and provides an English translation.
 * Utilizes OpenAI's GPT-3.5-turbo model for generation.
 * 
 * Request body:
 * - vocab: A string of comma-separated Korean vocabulary word(s).
 * 
 * Response:
 * - question: The generated question in Korean.
 * - translation: The English translation of the question.
 * 
 * Error handling:
 * - Sends a 500 status code with an error message if there's an issue with the OpenAI API request.
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
 * Checks if a user's sentence correctly and naturally answers the provided question using specified vocabulary.
 * Uses OpenAI's GPT-3.5-turbo model for evaluation.
 * 
 * Request body:
 * - userSentence: The sentence written by the user.
 * - question: The question being responded to.
 * - vocab: The vocabulary word(s) expected in the user's sentence.
 * 
 * Response:
 * - feedback: Feedback from GPT-3.5-turbo on the correctness and naturalness of the sentence.
 * 
 * Error handling:
 * - Sends a 500 status code with an error message if there's an issue with the OpenAI API request.
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

/**
 * POST /generate-text
 * Generates a Korean sentence using a specified vocabulary word and desired complexity level.
 * Leverages OpenAI's GPT-3.5-turbo model for sentence creation.
 * 
 * Request body:
 * - vocab: The Korean vocabulary word to be included in the sentence.
 * - complexity: Desired complexity level ('easy', 'medium', 'hard') for the sentence.
 * 
 * Response:
 * - text: The generated sentence in Korean, or a default message if no sentence is generated.
 * 
 * Error handling:
 * - Sends a 500 status code with an error message if there's an issue with the OpenAI API request.
*/
router.post('/generate-text', async (req, res) => {
    const { vocab, complexity } = req.body;

    let complexityPhrase;
    switch (complexity) {
        case 'easy':
            complexityPhrase = 'Create a simple and easy to understand sentence';
            break;
        case 'medium':
            complexityPhrase = 'Create a moderately complex sentence';
            break;
        case 'hard':
            complexityPhrase = 'Create a complex and intricate sentence';
            break;
        default:
            complexityPhrase = 'Create a sentence';
    }

    const prompt = `${complexityPhrase} using the Korean vocabulary word '${vocab}'.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a bilingual assistant fluent in Korean and English." }, { role: "user", content: prompt }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const generatedText = response.data.choices[0].message.content.trim() || 'No text generated';

        res.json({ text: generatedText });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Error generating text');
    }
});

module.exports = router;