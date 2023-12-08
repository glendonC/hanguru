import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, HStack, Select, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';

/**
 * VocabularyPage Component
 * 
 * Manages vocabulary words and sets, allowing users to add new vocabulary words, create vocabulary sets, and edit or delete existing vocabulary.
 *
 * State Management:
 * - koreanWord, englishDefinition: States for managing the input of new vocabulary words and their English definitions.
 * - currentSet, newSetName: States for handling the current vocabulary set and the input for a new set name.
 * - vocabularySets: An array storing the list of vocabulary sets fetched from the server.
 * - selectedSetItems: An array holding the words in the currently selected vocabulary set.
 * - editingItem, editedKorean, editedEnglish: States for managing the editing process of a vocabulary word.
 * 
 * Features:
 * - Enables the addition of new vocabulary words to a selected set.
 * - Allows the creation of new vocabulary sets.
 * - Provides inline editing and deletion of vocabulary words.
 * - Includes a translation feature for Korean words to English.
 * - Displays vocabulary words in the selected set.
 * 
 * API Interaction:
 * - Communicates with the backend server for fetching, adding, editing, and deleting vocabulary words and sets.
 * 
 * Handlers:
 * - handleTranslate: Translates a Korean word to English using an API.
 * - handleAddVocabulary: Adds a new vocabulary word to the selected set.
 * - handleAddSet: Creates a new vocabulary set.
 * - handleSetSelection: Fetches and displays items from the selected set.
 * - handleEditItem: Initiates editing for a selected vocabulary word.
 * - submitEdit: Submits the edited vocabulary word to the server.
 * - handleDeleteItem: Deletes a selected vocabulary word from the server.
 * 
 * Error and Success Handling:
 * - Uses Chakra UI's useToast for displaying notifications related to errors and successful operations.
*/
const VocabularyPage = () => {
  // State to store inputs and fetched data
  const [koreanWord, setKoreanWord] = useState('');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const [currentSet, setCurrentSet] = useState('');
  const [newSetName, setNewSetName] = useState('');
  const [vocabularySets, setVocabularySets] = useState([]);
  const [selectedSetItems, setSelectedSetItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedKorean, setEditedKorean] = useState('');
  const [editedEnglish, setEditedEnglish] = useState('');

  // Toast for displaying messages
  const toast = useToast();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';

  // Fetches vocabulary sets on component mount
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/hanguru/api/vocabulary/sets`);
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

  /**
   * getCurrentSetName
   * Retrieves the name of the currently selected vocabulary set.
   * @returns {string} The name of the selected set or a default message if no set is selected.
  */
  const getCurrentSetName = () => {
    const currentSetObj = vocabularySets.find(set => set._id === currentSet);
    return currentSetObj ? currentSetObj.setName : 'No set selected';
  };

  /**
   * handleTranslate
   * Initiates the translation of a Korean word to English.
   * Updates the English definition state with the translated result.
  */
  const handleTranslate = async () => {
    try {
      const response = await axios.post(`${apiUrl}/hanguru/api/translate`, {
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

  /**
   * handleAddVocabulary
   * Adds a new vocabulary word to the selected set.
   * Validates the inputs and displays appropriate toast notifications for success or warnings.
  */
  const handleAddVocabulary = async () => {
    if (!currentSet) {
      toast({
        title: 'No Set Selected',
        description: 'Please select a set before adding vocabulary.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
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
        await axios.post(`${apiUrl}/hanguru/api/vocabulary/add`, {
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

  /**
   * handleAddSet
   * Creates a new vocabulary set with the given name.
   * Updates the list of vocabulary sets and selects the newly created set.
  */
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
      const response = await axios.post(`${apiUrl}/hanguru/api/vocabulary/set/add`, { name: newSetName });
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

  /**
   * handleSetSelection
   * Selects a vocabulary set and fetches its items from the server.
   * Updates the state with the fetched items and displays appropriate toast notifications.
   * @param {string} setId - The ID of the selected set.
  */
  const handleSetSelection = async (setId) => {
    console.log("Set ID: ", setId)
    if (!setId) {
      toast({
        title: 'Error',
        description: 'No set selected.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const response = await axios.get(`${apiUrl}/hanguru/api/vocabulary/set/${setId}/items`);
      setSelectedSetItems(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch set items.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  /**
   * handleEditItem
   * Prepares the editing of a vocabulary item by setting the item and its details into state.
   * @param {Object} item - The vocabulary item to be edited.
  */
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditedKorean(item.korean);
    setEditedEnglish(item.english);
  };

  /**
   * renderEditForm
   * Renders the inline form for editing a vocabulary item.
   * @returns {JSX.Element|null} The JSX element of the edit form or null if no item is being edited.
  */
  const renderEditForm = () => {
    if (!editingItem) return null;

    return (
      <Box>
        <HStack spacing={3}>
          <Input 
            value={editedKorean} 
            onChange={(e) => setEditedKorean(e.target.value)}
          />
          <Input 
            value={editedEnglish} 
            onChange={(e) => setEditedEnglish(e.target.value)}
          />
          <Button colorScheme="blue" onClick={() => submitEdit()}>Submit</Button>
          <Button colorScheme="red" onClick={() => setEditingItem(null)}>Cancel</Button>
        </HStack>
      </Box>
    );
  };

  /**
   * submitEdit
   * Submits the edited vocabulary item to the server and updates the state.
   * Displays appropriate toast notifications based on the result of the operation.
  */
  const submitEdit = async () => {
    try {
      const response = await axios.put(`${apiUrl}/hanguru/api/vocabulary/item/edit/${editingItem._id}`, {
        korean: editedKorean,
        english: editedEnglish
      });
  
      const updatedItems = selectedSetItems.map(item => 
        item._id === editingItem._id ? response.data : item
      );
      setSelectedSetItems(updatedItems);
  
      setEditingItem(null);
      setEditedKorean('');
      setEditedEnglish('');
  
      toast({
        title: 'Success',
        description: 'Vocabulary updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vocabulary.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  /**
   * handleDeleteItem
   * Deletes a selected vocabulary item from the server and updates the state.
   * Displays appropriate toast notifications based on the result of the operation.
   * @param {string} itemId - The ID of the item to be deleted.
  */
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`${apiUrl}/hanguru/api/vocabulary/item/delete/${itemId}`);
      setSelectedSetItems(selectedSetItems.filter(item => item._id !== itemId));
      toast({
        title: 'Success',
        description: 'Item deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Renders the main component UI
  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Box>
      <Text fontSize="lg" fontWeight="bold">Add New Vocabulary Word</Text>
      <Select 
        mt={2} 
        placeholder="Select set" 
        value={currentSet} 
        onChange={(e) => setCurrentSet(e.target.value)}
      >
        {vocabularySets.map((set) => (
          <option key={set._id} value={set._id}>{set.setName}</option>
        ))}
      </Select>
      <HStack spacing={3} mt={2}>
        <Input 
          placeholder="Enter Korean word" 
          value={koreanWord}
          onChange={(e) => setKoreanWord(e.target.value)}
          disabled={!currentSet}
        />
        <Button onClick={handleTranslate} disabled={!currentSet}>Translate</Button>
      </HStack>
      <Input 
        mt={2}
        placeholder="English Definition" 
        value={englishDefinition}
        onChange={(e) => setEnglishDefinition(e.target.value)}
        disabled={!currentSet}
      />
      <Button mt={2} colorScheme="blue" onClick={handleAddVocabulary} disabled={!currentSet}>
        Add to Vocabulary
      </Button>
    </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold">Vocabulary Sets</Text>
          <HStack spacing={3} mt={2}>
            <Input 
              placeholder="New set name" 
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
            />
            <Button onClick={handleAddSet}>Create New Set</Button>
          </HStack>
          <Select mt={2} placeholder="Select set" value={currentSet} onChange={(e) => setCurrentSet(e.target.value)}>
            {vocabularySets.map((set) => (
              <option key={set._id} value={set._id}>{set.setName}</option>
            ))}
          </Select>
          <Text mt={2}>Currently selected set: {getCurrentSetName()}</Text>
          <Select mt={2} placeholder="View set" onChange={(e) => handleSetSelection(e.target.value)}>
            {vocabularySets.map((set) => (
              <option key={set._id} value={set._id}>{set.setName}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold">Manage Vocabulary Words</Text>
          {selectedSetItems.map((item) => (
            <HStack key={item._id} spacing={3} mt={2}>
              <Text>{item.korean} - {item.english}</Text>
              <Button colorScheme="blue" size="sm" onClick={() => handleEditItem(item)}>Edit</Button>
              <Button colorScheme="red" size="sm" onClick={() => handleDeleteItem(item._id)}>Delete</Button>
            </HStack>
          ))}
          {renderEditForm()}
        </Box>
      </VStack>
    </Box>
  );
}

export default VocabularyPage;
