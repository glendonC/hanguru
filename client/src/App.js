import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import ExercisesPage from './pages/ExercisesPage';
import AudioRecordingPage from './pages/AudioRecordingPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ProgressChecker from './pages/ProgressChecker';
import AnimatedCursor from './components/AnimatedCursor';

import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Purpose from './pages/Purpose';
import Contact from './pages/Contact';



function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUser(userData);
  };

  // Toggle between showing login and signup on the Auth page
  const toggleAuthPage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <AnimatedCursor/>
        {/* Show NavBar only when logged in */}
          {isLoggedIn && <NavBar user={user} setLoggedIn={setLoggedIn} />
        }

      <Routes>
        {/* Authentication page route */}
        <Route 
          path="/auth" 
          element={!isLoggedIn ? <AuthPage onLogin={handleLogin} showLogin={showLogin} toggleAuthPage={toggleAuthPage} /> : <Navigate to="/" />} 
        />

        <Route path="/about" element={<About />} />
        <Route path="/purpose" element={<Purpose />} />
        <Route path="/contact" element={<Contact />} />

        {/* Home page route */}
        <Route 
          path="/" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />} 
        />

        {/* Dashboard route */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/dashboard" />} 
        />

        {/* Progress checker route */}
        <Route 
          path="/progress-checker" 
          element={isLoggedIn ? <ProgressChecker /> : <Navigate to="/auth" />} 
        />

        {/* Account settings route */}
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
