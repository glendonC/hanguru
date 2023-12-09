import React, { useState, useEffect, useRef } from 'react';
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
  Input,
  Text,
  Textarea,
  Container
} from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

/**
 * AudioRecordingPage Component
 *
 * This component provides an interface for text-to-speech synthesis, audio recording, 
 * and managing vocabulary. It interacts with a backend server for data processing and storage.
 *
 * State Management:
 * - Manages states for recording status, audio URLs, media recorder, and uploaded files.
 * - Handles text complexity, generated text, selected voice, and loading/error states.
 * - Maintains states for vocabulary sets, selected words, and audio-related controls.
 *
 * Features:
 * - Enables users to select vocabulary sets and individual words for text generation.
 * - Allows users to choose the complexity level for generated text.
 * - Offers text-to-speech functionality with voice selection.
 * - Provides audio recording using the MediaRecorder API.
 * - Custom audio controls for playback, volume, and speed.
 * - Supports uploading, playing, and deleting audio files.
 *
 * API Interaction:
 * - Fetches vocabulary sets and voices from backend APIs.
 * - Sends requests to backend for text generation, speech synthesis, and audio file management.
 *
 * Handlers:
 * - Handlers for set/word selection, recording controls, audio file upload/deletion, 
 *   and playback adjustments.
 *
 * Effect Hooks:
 * - Fetches vocabulary sets and voices on component mount.
 * - Updates audio source and fetches recordings as needed.
 * 
 * Error Handling:
 * - Implements error handling for API requests with appropriate user feedback.
*/
const AudioRecordingPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);

  const [speechAudioUrl, setSpeechAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [vocabularySets, setVocabularySets] = useState([]);
  const [setWords, setSetWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  const [voices, setVoices] = useState([]);

  const [audioRef, setAudioRef] = useState(new Audio());
  const [transcribedText, setTranscribedText] = useState('');
  const audioChunksRef = useRef([]);

  const [customRecordingName, setCustomRecordingName] = useState('');

  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isReadyToRecord, setIsReadyToRecord] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';

  // Effect hook to force users to fill requirements before recording
  useEffect(() => {
    const readyToRecord = vocabularySets.length > 0 && selectedWords.length > 0 && complexity !== null && selectedVoice !== null && generatedText !== null && generatedText !== '';
    setIsReadyToRecord(readyToRecord);
  }, [vocabularySets, selectedWords, complexity, selectedVoice, generatedText]);

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
        const response = await axios.get(`${apiUrl}/hanguru/api/vocabulary/sets`);
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
        const response = await axios.get(`${apiUrl}/hanguru/api/text-to-speech/voices`);
        setVoices(response.data.voices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  // Effect hook to fetch all recordings
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/hanguru/api/recordings`);
        setRecordings(response.data);
      } catch (error) {
        console.error('Error fetching recordings:', error);
      }
    };
  
    fetchRecordings();
  }, []);
  
  
  /**
   * handleSetSelection
   * Fetches and sets words from a selected vocabulary set.
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
    * Toggles the selection of a word in the vocabulary set.
    * @param {string} word - The word to be toggled in the selected words list.
  */
  const handleWordSelection = (word) => {
    setSelectedWords(prevSelectedWords =>
      prevSelectedWords.includes(word) ? prevSelectedWords.filter(w => w !== word) : [...prevSelectedWords, word]
    );
  };

  /**
   * startRecording
   * Starts audio recording using MediaRecorder API.
  */
  const startRecording = async () => {
    if (!isReadyToRecord) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunksRef.current = [];
  
    recorder.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };
  
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };


  /**
   * stopRecording
   * Stops the audio recording and processes the recorded audio data.
  */
  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      console.log("Generated Text at Recording Stop: ", generatedText);
      await uploadAudio(audioBlob, generatedText);
      await uploadAndTranscribeAudio(audioBlob);
      setCustomRecordingName('');
      audioChunksRef.current = [];
    };
  };
  
  /**
   * uploadAudio
   * Uploads the recorded audio to the server.
   * @param {Blob} audioBlob - The audio data to be uploaded.
  */
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    const fileName = customRecordingName ? `${customRecordingName}.wav` : 'audio-recording.wav';
    formData.append('file', audioBlob, fileName);
    formData.append('customRecordingName', customRecordingName);
    formData.append('associatedText', generatedText);
  
    try {
      const response = await axios.post(`${apiUrl}/hanguru/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status === 200) {
        const data = response.data;
        setUploadedFiles([...uploadedFiles, data.fileName]);
        console.log('Upload successful:', data.message);
      } else {
        console.error('Upload failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };
  
  /**
   * deleteAudio
   * Deletes an audio file from the server.
   * @param {string} customName - The custom name of the file to be deleted.
   */
  const deleteAudio = async (customName) => {
    try {
      const response = await fetch(`${apiUrl}/hanguru/api/upload/delete/${customName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter(file => file !== customName));
        console.log('Audio deleted successfully');
      } else {
        console.error('Failed to delete audio');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * handlePlay
   * Plays the audio from the current reference.
  */
  const handlePlay = () => {
    audioRef.play();
  };
  
  /**
   * handlePause
   * Pauses the audio playback.
  */
  const handlePause = () => {
    audioRef.pause();
  };
  
  /**
   * handleVolumeChange
   * Adjusts the playback volume of the audio.
   * @param {number} val - The new volume level.
  */
  const handleVolumeChange = (val) => {
    const newVolume = parseFloat(val);
    if (!isNaN(newVolume)) {
      audioRef.volume = newVolume;
    }
  };
  
  /**
   * handleSpeedChange
   * Adjusts the playback speed of the audio.
   * @param {number} val - The new playback speed.
  */
  const handleSpeedChange = (val) => {
    audioRef.playbackRate = parseFloat(val);
  };
  
  /**
   * fetchSpeechAudio
   * Fetches the speech audio for given text using the text-to-speech API.
   * @param {string} text - The text to be converted to speech.
  */
  const fetchSpeechAudio = async (text) => {
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${apiUrl}/hanguru/api/text-to-speech`, {
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

  /**
   * generateText
   * Generates text based on selected vocabulary and complexity.
  */
  const generateText = async () => {
    try {
      const response = await fetch(`${apiUrl}/hanguru/api/generate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocab: selectedWords.join(', '), complexity }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedText(data.text);
        fetchSpeechAudio(data.text);
        return data.text;
      } else {
        console.error('Failed to generate text');
        return '';
      }
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  };

  /**
   * handleVoiceChange
   * Changes the selected voice for text-to-speech and re-fetches audio if text is already generated.
   * @param {string} newVoice - The new voice to be used for speech synthesis.
  */
  const handleVoiceChange = async (newVoice) => {
    setSelectedVoice(newVoice);
    if (generatedText) {
      await fetchSpeechAudio(generatedText);
    }
  };

  /**
   * uploadAndTranscribeAudio
   * Uploads the audio for transcription and sets the transcribed text.
   * @param {Blob} audioBlob - The audio data to be transcribed.
  */
  const uploadAndTranscribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio-recording.wav');
  
    try {
      const response = await axios.post(`${apiUrl}/hanguru/api/speech-to-text/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data && response.data.transcription) {
        console.log('Transcription:', response.data.transcription);
        setTranscribedText(response.data.transcription); // Update the transcribed text state
      }
    } catch (error) {
      console.error('Error in transcription:', error);
    }
  };
  
  /**
   * handleRecordingNameChange
   * Updates the custom name for the recording.
   * @param {Event} e - The event object containing the updated name.
  */
  const handleRecordingNameChange = (e) => {
    setCustomRecordingName(e.target.value);
  };
  
  /**
   * handleRecordingSelection
   * Selects a recording from the list of available recordings.
   * @param {Event} e - The event object containing the selected recording ID.
  */
  const handleRecordingSelection = (e) => {
    const selectedId = e.target.value;
    const recording = recordings.find(rec => rec._id === selectedId);
    setSelectedRecording(recording);
  };

  /**
   * deleteSelectedRecording
   * Deletes the selected recording from the server and updates the state.
   * This function only proceeds if a recording is currently selected.
  */
  const deleteSelectedRecording = async () => {
    if (!selectedRecording) return;
  
    try {
      const response = await axios.delete(`${apiUrl}/hanguru/api/recordings/delete/${selectedRecording._id}`);
      if (response.status === 200) {
        setRecordings(recordings.filter(rec => rec._id !== selectedRecording._id));
        setSelectedRecording(null);
        console.log('Recording deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  /**
    * formatDate
    * Formats a date string into a more readable format.
    * @param {string} dateString - The date string to be formatted.
    * @returns {string} The formatted date string.
    * 
    * Example Format: 'January 1, 2020, 10:00 AM'
  */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
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
        <Button 
          colorScheme="blue" 
          onClick={recording ? stopRecording : startRecording} 
          isDisabled={!isReadyToRecord}
          _disabled={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'gray.400' }}
        >
        {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {audioURL && <audio src={audioURL} controls aria-label="Recorded Audio" />}
      </Box>

      <Input
          placeholder="Enter a name for your recording"
          value={customRecordingName}
          onChange={handleRecordingNameChange}
      />
      
      <Box>
        <Text mt={4} fontWeight="bold">Transcribed Text:</Text>
        <Textarea value={transcribedText} readOnly />
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

      <Select placeholder="Select a recording" onChange={handleRecordingSelection}>
      {recordings.map(rec => (
        <option key={rec._id} value={rec._id}>
          {rec.fileName} - Uploaded on: {formatDate(rec.uploadDate)}
        </option>
      ))}
      </Select>

      {selectedRecording && (
        <>
          <Text fontWeight="bold">Associated Text:</Text>
          <Text>{selectedRecording.associatedText}</Text>
          <Text>Uploaded on: {formatDate(selectedRecording.uploadDate)}</Text>
          <audio src={selectedRecording.audioUrl} controls />
          <Button colorScheme="red" onClick={deleteSelectedRecording}>Delete Recording</Button>
        </>
      )}
      </VStack>
    </Container>
  );
};

export default AudioRecordingPage;
