import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

function HomePage() {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translation, setTranslation] = useState('');
  const toast = useToast();

  const handleTranslation = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/translate', {
        text: textToTranslate,
        sourceLang: 'ko', // Assuming Korean to English translation
        targetLang: 'en'
      });
      setTranslation(response.data.translation);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to translate text.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Enter Text to Translate:</FormLabel>
          <Textarea 
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleTranslation}>
          Translate
        </Button>
        <FormControl>
          <FormLabel>Translation:</FormLabel>
          <Textarea isReadOnly value={translation} />
        </FormControl>
      </VStack>
    </Box>
  );
}

export default HomePage;
