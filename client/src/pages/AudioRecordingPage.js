import React, { useState } from 'react';

const AudioRecordingPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);

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

      // Here, you would upload the Blob to the server
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

    const response = await fetch('http://localhost:8100/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // Handle success - maybe display a success message to the user
      console.log('Upload successful:', data.message);
    } else {
      // Handle error - inform the user that the upload failed
      console.error('Upload failed');
    }
  };

  const deleteAudio = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8100/api/upload/delete/${fileName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Audio deleted successfully');
        // Update the state or UI to reflect the deletion
      } else {
        console.error('Failed to delete audio');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={() => deleteAudio('your-audio-file-name.wav')}>
        Delete Audio
      </button>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};

export default AudioRecordingPage;
