import React, { useState, useEffect } from 'react';
import { Box, VStack, Select, Button, Text, Checkbox, Input } from '@chakra-ui/react';
import axios from 'axios';

/**
 * ExercisesPage Component
 * 
 * Provides an interactive interface for language learning exercises, focusing on vocabulary practice.
 *
 * State Management:
 * - vocabularySets: An array of vocabulary sets fetched from the server.
 * - setWords: An array of words from a selected vocabulary set.
 * - selectedWords: An array of user-selected words for question generation.
 * - userInput: A string storing the user's answer to the generated question.
 * - feedback: A string containing feedback on the user's answer.
 * - generatedQuestion: A string storing the question generated from the selected vocabulary.
 * - questionTranslation: A string containing the English translation of the generated question.
 * 
 * Features:
 * - Allows users to choose from different vocabulary sets.
 * - Enables the selection of individual vocabulary words for custom practice.
 * - Generates language exercises based on the selected vocabulary words.
 * - Provides an input field for user answers and offers feedback upon submission.
 * 
 * API Interaction:
 * - Fetches vocabulary sets and set items from a backend server.
 * - Interacts with the server to generate questions and check user answers for correctness and naturalness.
 * 
 * Handlers:
 * - handleSetSelection: Fetches words from a selected vocabulary set.
 * - handleWordSelection: Manages user selection of vocabulary words.
 * - generateQuestion: Generates a question based on selected vocabulary words.
 * - checkUserAnswer: Evaluates the user's answer and provides feedback.
 * 
 * Error Handling:
 * - Handles errors in API requests and displays appropriate error messages.
 */
const ExercisesPage = () => {
  const [vocabularySets, setVocabularySets] = useState([]);
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [questionTranslation, setQuestionTranslation] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';

  // Fetches the vocabulary sets when the component mounts
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/hanguru/api/vocabulary/sets`);
        setVocabularySets(response.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };
    fetchSets();
  }, []);

  /**
   * handleSetSelection
   * Fetches and sets words from a selected vocabulary set.
   * Clears the current selection of words before making a new request.
   * @param {string} setId - The ID of the selected vocabulary set.
  */
  const handleSetSelection = async (setId) => {
    setSelectedWords([]);
    try {
      const response = await axios.get(`${apiUrl}/hanguru/api/vocabulary/set/${setId}/items`);
      setSetWords(response.data);
    } catch (error) {
      console.error('Error fetching words from set:', error);
    }
  };

  /**
   * handleWordSelection
   * Toggles the selection of a word in the vocabulary set for generating questions.
   * Adds or removes the word from the selected words list.
   * @param {string} word - The word to be toggled in the selected words list.
  */
  const handleWordSelection = (word) => {
    setSelectedWords(prevSelectedWords =>
      prevSelectedWords.includes(word) ? prevSelectedWords.filter(w => w !== word) : [...prevSelectedWords, word]
    );
  };

  /**
   * generateQuestion
   * Generates a language exercise question based on the selected vocabulary words.
   * Sets the generated question and its English translation in the state.
   * Handles cases where no question is provided by the server.
  */
  const generateQuestion = async () => {
    try {
      const response = await axios.post(`${apiUrl}/hanguru/api/generate-sentence`, {
        vocab: selectedWords.join(', '),
      });
      setGeneratedQuestion(response.data.question || 'No question provided');
      setQuestionTranslation(response.data.translation || 'No translation available');
    } catch (error) {
      console.error('Error generating question', error);
    }
  };

  /**
   * checkUserAnswer
   * Submits the user's answer for evaluation.
   * Sets the feedback received from the server in the state.
   * Handles errors and sets appropriate feedback if there's an issue with the answer checking process.
  */
  const checkUserAnswer = async () => {
    try {
      const response = await axios.post(`${apiUrl}/hanguru/api/check-answer`, {
        userSentence: userInput,
        question: generatedQuestion,
        vocab: selectedWords.join(', ')
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error('Error checking answer:', error);
      setFeedback('Error checking answer.');
    }
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Select placeholder="Select set" onChange={e => handleSetSelection(e.target.value)}>
          {vocabularySets.map(set => (
            <option key={set._id} value={set._id}>{set.setName}</option>
          ))}
        </Select>

        {setWords.map(word => (
          <Checkbox key={word._id} isChecked={selectedWords.includes(word.korean)} onChange={() => handleWordSelection(word.korean)}>
            {word.korean}
          </Checkbox>
        ))}

        <Button colorScheme="blue" onClick={generateQuestion} disabled={selectedWords.length === 0}>
          Generate Question
        </Button>

        {generatedQuestion && (
          <>
            <Text mt={2}>Question (Korean): {generatedQuestion}</Text>
            <Text mt={2}>Translation (English): {questionTranslation}</Text>
            <Input placeholder="Type your answer here" value={userInput} onChange={e => setUserInput(e.target.value)} />
            <Button mt={2} colorScheme="teal" onClick={checkUserAnswer}>Get Feedback</Button>
            {feedback && <Text mt={2}>{feedback}</Text>}
          </>
        )}
      </VStack>
    </Box>
  );
}

export default ExercisesPage;
