import React, { useState, useEffect } from 'react';
import { Box, VStack, Select, Button, Text, CheckboxGroup, Checkbox, Stack } from '@chakra-ui/react';
import axios from 'axios';

const ExercisesPage = () => {
  const [vocabularySets, setVocabularySets] = useState([]);
  const [currentSet, setCurrentSet] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [generatedSentence, setGeneratedSentence] = useState('');
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

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
    if (selectedWords.length === 0) {
        return;
    }

    const prompt = `Create a sentence in Korean using the words ${selectedWords.join(', ')}: `;

    try {
        const response = await axios.post('http://localhost:8100/api/generate-sentence', { prompt });
        // Directly access the sentence from the response
        const sentence = response.data.sentence;
        setGeneratedSentence(sentence);
    } catch (error) {
        console.error('Error generating sentence:', error);
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
          <Select placeholder="Select set" onChange={(e) => handleSetSelection(e.target.value)}>
            {vocabularySets.map((set) => (
              <option key={set._id} value={set._id}>{set.setName}</option>
            ))}
          </Select>
          {setWords.map((word) => (
            <Checkbox 
              key={word._id} 
              isChecked={selectedWords.includes(word.korean)}
              onChange={() => handleWordSelection(word.korean)}
            >
              {word.korean}
            </Checkbox>
          ))}
          <Button colorScheme="blue" onClick={generateSentence} disabled={selectedWords.length === 0}>
            Generate Sentence
          </Button>
        {generatedSentence && <Text mt={2}>Generated Sentence (Korean): {generatedSentence}</Text>}
        <Button colorScheme="green" onClick={translateSentence} disabled={!generatedSentence}>
          Translate Sentence
        </Button>
        {translatedSentence && <Text mt={2}>Translated Sentence (English): {translatedSentence}</Text>}
      </VStack>
    </Box>
  );
}

export default ExercisesPage;
