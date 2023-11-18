import React, { useState, useEffect } from 'react';
import { Box, VStack, Select, Button, Text, CheckboxGroup, Checkbox, Stack, Input } from '@chakra-ui/react';
import axios from 'axios';

const ExercisesPage = () => {
  const [vocabularySets, setVocabularySets] = useState([]);
  const [currentSet, setCurrentSet] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [generatedSentence, setGeneratedSentence] = useState('');
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  const [grammarPoint, setGrammarPoint] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');




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

  const handleSetSelection = async (setId) => {
    setSelectedWord('');
    setGeneratedSentence('');
    setTranslatedSentence('');
    setSelectedWords([]);
  

    try {
      const response = await axios.get(`http://localhost:8100/api/vocabulary/set/${setId}/items`);
      setSetWords(response.data);
    } catch (error) {
      console.error('Error fetching words from set:', error);
    }
  };

  const handleWordSelection = (word) => {
    setSelectedWords((prevSelectedWords) =>
      prevSelectedWords.includes(word)
        ? prevSelectedWords.filter(w => w !== word)
        : [...prevSelectedWords, word]
    );
  };

  const generateSentence = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/generate-sentence', {
          vocab: selectedWords,
      });

      setGeneratedSentence(response.data.sentenceWithBlank);
      setCorrectAnswer(response.data.correctAnswer);
      setTranslatedSentence(response.data.translation);
      setGrammarPoint(response.data.grammarPoint);
  } catch (error) {
      console.error('Error generating sentence', error);
  }
};


// Function to check user's input
const checkAnswer = () => {
  if (userInput.trim() === correctAnswer.trim()) {
      setFeedback('Correct! Well done.');
  } else {
      setFeedback('Incorrect. Try again.');
  }
};

  const translateSentence = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/translate', {
        text: generatedSentence,
        sourceLang: 'ko',
        targetLang: 'en'
      });

      const translation = response.data.translation;
      setTranslatedSentence(translation);
    } catch (error) {
      console.error('Error translating sentence:', error);
    }
  };

  return (
    <Box p={5}>
        <VStack spacing={4}>
            {/* Vocabulary set selection */}
            <Select placeholder="Select set" onChange={(e) => handleSetSelection(e.target.value)}>
                {vocabularySets.map((set) => (
                    <option key={set._id} value={set._id}>{set.setName}</option>
                ))}
            </Select>

            {/* Words selection */}
            {setWords.map((word) => (
                <Checkbox 
                    key={word._id} 
                    isChecked={selectedWords.includes(word.korean)}
                    onChange={() => handleWordSelection(word.korean)}
                >
                    {word.korean}
                </Checkbox>
            ))}

            {/* Generate sentence button */}
            <Button colorScheme="blue" onClick={generateSentence} disabled={selectedWords.length === 0}>
                Generate Sentence
            </Button>

            {/* Display generated sentence with a blank */}
            {generatedSentence && (
                <>
                    <Text mt={2}>Fill in the blank (Korean): {generatedSentence}</Text>
                    <Input 
                        placeholder="Type your answer here" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <Button mt={2} colorScheme="teal" onClick={checkAnswer}>Check Answer</Button>
                    <Button mt={2} colorScheme="orange" onClick={() => setFeedback(`The correct answer is: ${correctAnswer}`)}>See Answer</Button>
                    {feedback && <Text mt={2}>{feedback}</Text>}
                </>
            )}

{translatedSentence && <Text mt={2}>Translation (English): {translatedSentence}</Text>}
            {grammarPoint && <Text mt={2}>Grammar Point: {grammarPoint}</Text>}
        </VStack>
    </Box>
);



}

export default ExercisesPage;
