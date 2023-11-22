import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  List,
  ListItem,
  ListIcon,
  Select,
  VStack,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
  Icon,
  Text
} from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';

import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

/**
 * AudioRecordingPage Component
 * 
 * This component provides a comprehensive interface for audio recording, managing vocabulary, 
 * and text-to-speech functionality
 *
 * State Management:
 * - It manages various states including recording status, audio URLs, media recorder, uploaded files,
 *   text complexity, generated text, selected voice, loading and error states, vocabulary sets, and 
 *   selected words
 * - It also maintains a reference to an audio object for playback control
 * 
 * Features:
 * - Vocabulary set and word selection for generating text
 * - Complexity level selection for the generated text
 * - Text-to-speech generation with voice selection
 * - Audio recording functionality using the MediaRecorder API
 * - Custom audio controls for playback, volume, and speed.
 * - Display and management of uploaded audio file
 * 
 * API Interaction:
 * - Communicates with backend APIs to fetch vocabulary sets, voices, and to handle text generation,
 *   speech synthesis, and audio file management
 * 
 * Handlers:
 * - Includes handlers for set and word selection, starting and stopping audio recording, uploading and 
 *   deleting audio files, playing and pausing audio, and adjusting volume and speed of playback
 * 
 * Effect Hooks:
 * - Utilizes useEffect hooks to fetch vocabulary sets and voices on component mount
 * - Updates the audio player reference when the speech audio URL changes
 * 
 * Error Handling:
 * - Implements error handling for API requests and displays appropriate messages.
 */
const AudioRecordingPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complexity, setComplexity] = useState('easy');

  const [generatedText, setGeneratedText] = useState('');
  const [speechAudioUrl, setSpeechAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [vocabularySets, setVocabularySets] = useState([]);
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);

  const [audioRef, setAudioRef] = useState(new Audio());

  // Effect hook for updating audio player source
  useEffect(() => {
    if (speechAudioUrl) {
      const newAudio = new Audio(speechAudioUrl);
      setAudioRef(newAudio);
    }
  }, [speechAudioUrl]);

  // Effect hook for fetching vocabulary sets
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

  // Effect hook for fetching available voices
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('http://localhost:8100/api/text-to-speech/voices');
        setVoices(response.data.voices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  const handleSetSelection = async (setId) => {
    setSelectedWords([]);
    try {
      const response = await axios.get(`http://localhost:8100/api/vocabulary/set/${setId}/items`);
      setSetWords(response.data);
    } catch (error) {
      console.error('Error fetching words from set:', error);
    }
  };

  const handleWordSelection = (word) => {
    setSelectedWords(prevSelectedWords =>
      prevSelectedWords.includes(word) ? prevSelectedWords.filter(w => w !== word) : [...prevSelectedWords, word]
    );
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks = [];

    recorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks = [];
      uploadAudio(audioBlob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio-recording.wav');

    try {
      const response = await fetch('http://localhost:8100/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFiles([...uploadedFiles, data.fileName]);
        console.log('Upload successful:', data.message);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteAudio = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8100/api/upload/delete/${fileName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter(file => file !== fileName));
        console.log('Audio deleted successfully');
      } else {
        console.error('Failed to delete audio');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlay = () => {
    audioRef.play();
  };
  
  const handlePause = () => {
    audioRef.pause();
  };
  
  const handleVolumeChange = (val) => {
    const newVolume = parseFloat(val);
    if (!isNaN(newVolume)) {
      audioRef.volume = newVolume;
    }
  };
  
  
  
  const handleSpeedChange = (val) => {
    audioRef.playbackRate = parseFloat(val);
  };
  

  const fetchSpeechAudio = async (text) => {
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8100/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });
  
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setSpeechAudioUrl(audioUrl);
      } else {
        console.error('Failed to generate speech');
        setError('Failed to generate speech');
        setSpeechAudioUrl('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating speech');
      setSpeechAudioUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const generateText = async () => {
    try {
      const response = await fetch('http://localhost:8100/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocab: selectedWords.join(', '), complexity }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedText(data.text);
        fetchSpeechAudio(data.text);
      } else {
        console.error('Failed to generate text');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVoiceChange = async (newVoice) => {
    setSelectedVoice(newVoice);
    if (generatedText) {
      await fetchSpeechAudio(generatedText);
    }
  };
  

  return (
    <VStack spacing={6} align="stretch">
      {/* Vocabulary and Complexity Selection */}
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
  
      <Box>
        <Select placeholder="Select Complexity" onChange={e => setComplexity(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </Box>
  
      {/* Generate and Display Text Section */}
      <Box>
        <Button colorScheme="teal" onClick={generateText}>Generate Text</Button>
        {generatedText && (
          <Box mt={4}>
            <p>{generatedText}</p>
            {speechAudioUrl && <audio src={speechAudioUrl} controls aria-label="Generated Speech" />}
          </Box>
        )}
      </Box>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <Select placeholder="Select Voice" onChange={e => handleVoiceChange(e.target.value)}>
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>{voice.name}</option>
        ))}
      </Select>


      {/* Custom Audio Controls */}
      <HStack spacing={4} alignItems="center">
        <Button onClick={handlePlay}>Play</Button>
        <Button onClick={handlePause}>Pause</Button>

        <VStack align="start">
          <Text>Volume</Text>
          <Slider defaultValue={1} min={0} max={1} step={0.1} onChange={handleVolumeChange}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </VStack>

        <VStack align="start">
          <Text>Speed</Text>
          <Slider defaultValue={1} min={0.5} max={2} step={0.1} onChange={handleSpeedChange}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </VStack>
      </HStack>

      {/* Audio Recording Section */}
      <Box>
        <Button colorScheme="blue" onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {audioURL && <audio src={audioURL} controls aria-label="Recorded Audio" />}
      </Box>
  
      {/* Uploaded Files List */}
      <List spacing={3}>
        {uploadedFiles.map((file, index) => (
          <ListItem key={index} d="flex" alignItems="center" justifyContent="space-between">
            <Box flex="1">{file}</Box>
            <Button colorScheme="red" size="sm" onClick={() => deleteAudio(file)}>
              <ListIcon as={DeleteIcon} color="red.500" />
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
  
  
};

export default AudioRecordingPage;
