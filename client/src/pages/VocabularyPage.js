import React, { useState } from 'react';
import { Box, Button, Input, VStack, HStack, useToast } from '@chakra-ui/react';
import axios from 'axios';

const VocabularyPage = () => {
  const [koreanWord, setKoreanWord] = useState('');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const toast = useToast();

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/translate', {
        text: koreanWord,
        sourceLang: 'ko',
        targetLang: 'en'
      });
      setEnglishDefinition(response.data.translation);
    } catch (error) {
      toast({
        title: 'Translation Error',
        description: 'Unable to translate word.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleAddVocabulary = async () => {
    if (!koreanWord || !englishDefinition) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both a Korean word and its English definition.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
        await axios.post('http://localhost:8100/api/vocabulary/add', {
          korean: koreanWord,
          english: englishDefinition
        });
        toast({
          title: 'Success',
          description: 'Vocabulary added successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        // Reset input fields or handle UI updates as needed
        setKoreanWord('');
        setEnglishDefinition('');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to add vocabulary.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
  };
  
  return (
    <Box p={5}>
      <VStack spacing={4}>
        <HStack spacing={3}>
          <Input 
            placeholder="Enter Korean word" 
            value={koreanWord}
            onChange={(e) => setKoreanWord(e.target.value)}
          />
          <Button onClick={handleTranslate}>Translate</Button>
        </HStack>
        <Input 
          placeholder="English Definition" 
          value={englishDefinition}
          onChange={(e) => setEnglishDefinition(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleAddVocabulary}>
          Add to Vocabulary
        </Button>
        {}
      </VStack>
    </Box>
  );
}

export default VocabularyPage;
