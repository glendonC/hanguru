import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import ExercisesPage from './pages/ExercisesPage';
import AudioRecordingPage from './pages/AudioRecordingPage';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const toggleAuthPage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route 
          path="/auth" 
          element={isLoggedIn ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} showLogin={showLogin} toggleAuthPage={toggleAuthPage} />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />} 
        />

        {/* New Routes */}
        <Route 
          path="/vocabulary" 
          element={isLoggedIn ? <VocabularyPage /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/exercises" 
          element={isLoggedIn ? <ExercisesPage /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/audio-recording" 
          element={isLoggedIn ? <AudioRecordingPage /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
