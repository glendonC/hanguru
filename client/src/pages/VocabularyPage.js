import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, HStack, Select, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';

const VocabularyPage = () => {
  const [koreanWord, setKoreanWord] = useState('');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const [currentSet, setCurrentSet] = useState('');
  const [newSetName, setNewSetName] = useState('');
  const [vocabularySets, setVocabularySets] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://localhost:8100/api/vocabulary/sets');
        setVocabularySets(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Unable to fetch vocabulary sets.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchSets();
  }, []);


  const getCurrentSetName = () => {
    const currentSetObj = vocabularySets.find(set => set._id === currentSet);
    return currentSetObj ? currentSetObj.setName : 'No set selected';
  };

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
          english: englishDefinition,
          set: currentSet || null
        });
        toast({
          title: 'Success',
          description: 'Vocabulary added successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setKoreanWord('');
        setEnglishDefinition('');
        setCurrentSet('');
        setNewSetName('');
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

  const handleAddSet = async () => {
    if (!newSetName) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a name for the new set.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8100/api/vocabulary/set/add', { name: newSetName });
      setVocabularySets([...vocabularySets, response.data]);
      setCurrentSet(response.data._id);
      setNewSetName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add new set.',
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
        <Select placeholder="Select set" value={currentSet} onChange={(e) => setCurrentSet(e.target.value)}>
          {vocabularySets.map((set) => (
            <option key={set._id} value={set._id}>{set.setName}</option>
          ))}
        </Select>
        <Text>Currently selected set: {getCurrentSetName()}</Text> {}

        <HStack spacing={3}>
          <Input 
            placeholder="New set name" 
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
          />
          <Button onClick={handleAddSet}>Create New Set</Button>
        </HStack>
        <Button colorScheme="blue" onClick={handleAddVocabulary}>
          Add to Vocabulary
        </Button>
        {}
      </VStack>
    </Box>
  );
}

export default VocabularyPage;
