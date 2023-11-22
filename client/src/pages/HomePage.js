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

/**
 * HomePage Component
 * 
 * This component serves as the home page of the application and includes functionality
 * for translating text from English to Korean
 * 
 * State Management:
 * - textToTranslate: Stores the text input by the user that needs to be translated
 * - translation: Stores the translated text received from the server
 * 
 * Features:
 * - Text input for the user to enter text in English
 * - Button to initiate the translation process
 * - Display area for the translated text in Korean
 * - Toast notifications for error handling
 * 
 * The component communicates with a backend server for translation through an API endpoint
 * ('http://localhost:8100/api/translate').
 * 
 * The translation process is triggered by the 'handleTranslation' function, which sends
 * the user's input to the server and updates the translation state with the response
 * 
 * Error Handling:
 * - In case of an error during the API request, a toast notification is displayed
 *   with an error message
 */
function HomePage() {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translation, setTranslation] = useState('');
  const toast = useToast();

  const handleTranslation = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/translate', {
        text: textToTranslate,
        sourceLang: 'en',
        targetLang: 'kor'
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
          <FormLabel>Korean:</FormLabel>
          <Textarea 
            value={textToTranslate}
            onChange={(e) => setTextToTranslate(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleTranslation}>
          Translate
        </Button>
        <FormControl>
          <FormLabel>English:</FormLabel>
          <Textarea isReadOnly value={translation} />
        </FormControl>
      </VStack>
    </Box>
  );
}

export default HomePage;
