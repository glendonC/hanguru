import React, { useState } from 'react';
import { Button, Box, List, ListItem, ListIcon, Audio, VStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const AudioRecordingPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Button colorScheme="blue" onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </Box>
  
      {audioURL && (
        <Box>
          <audio src={audioURL} controls />
        </Box>
      )}
  
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
