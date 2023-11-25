import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import ExercisesPage from './pages/ExercisesPage';
import AudioRecordingPage from './pages/AudioRecordingPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ProgressChecker from './pages/ProgressChecker';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUser(userData);
  };

  const toggleAuthPage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      {/* Show NavBar only when logged in */}
      {isLoggedIn && <NavBar user={user} />}

      <Routes>
        <Route 
          path="/auth" 
          element={!isLoggedIn ? <AuthPage onLogin={handleLogin} showLogin={showLogin} toggleAuthPage={toggleAuthPage} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/progress-checker" 
          element={isLoggedIn ? <ProgressChecker /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/account-settings" 
          element={isLoggedIn ? <AccountSettingsPage /> : <Navigate to="/auth" />} 
        />

        {/* Protected Routes */}
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
