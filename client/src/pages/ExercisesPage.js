import React, { useState, useEffect } from 'react';
import { Box, VStack, Select, Button, Text, Checkbox, Input } from '@chakra-ui/react';
import axios from 'axios';

const ExercisesPage = () => {
  const [vocabularySets, setVocabularySets] = useState([]);
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [questionTranslation, setQuestionTranslation] = useState('');

  // Fetches the vocabulary sets when the component mounts
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://localhost:8100/api/vocabulary/sets');
        setVocabularySets(response.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };
    fetchSets();
  }, []);

  // Fetches words from a selected vocabulary set
  const handleSetSelection = async (setId) => {
    setSelectedWords([]);
    try {
      const response = await axios.get(`http://localhost:8100/api/vocabulary/set/${setId}/items`);
      setSetWords(response.data);
    } catch (error) {
      console.error('Error fetching words from set:', error);
    }
  };

  // Updates the selected words state based on user selection
  const handleWordSelection = (word) => {
    setSelectedWords(prevSelectedWords =>
      prevSelectedWords.includes(word) ? prevSelectedWords.filter(w => w !== word) : [...prevSelectedWords, word]
    );
  };

  // Generates a question using GPT-3 based on the selected words
  const generateQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/generate-sentence', {
        vocab: selectedWords.join(', '),
      });
      setGeneratedQuestion(response.data.question || 'No question provided');
      setQuestionTranslation(response.data.translation || 'No translation available');
    } catch (error) {
      console.error('Error generating question', error);
    }
  };

  // Checks the user's sentence for correctness and naturalness using GPT model in gpt.js
  const checkUserAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/check-answer', {
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
