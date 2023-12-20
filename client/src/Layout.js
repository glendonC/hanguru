import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ProgressChecker from './pages/ProgressChecker';
import AccountSettingsPage from './pages/AccountSettingsPage';
import About from './pages/About';
import Purpose from './pages/Purpose';
import Contact from './pages/Contact';
import VocabularyPage from './pages/VocabularyPage';
import ExercisesPage from './pages/ExercisesPage';
import AudioRecordingPage from './pages/AudioRecordingPage';

function Layout({ isLoggedIn, user, setLoggedIn, handleLogin, showLogin, toggleAuthPage }) {
  const location = useLocation();

  return (
    <>
      {isLoggedIn && <NavBar user={user} setLoggedIn={setLoggedIn} />}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/auth" 
              element={!isLoggedIn ? <AuthPage onLogin={handleLogin} showLogin={showLogin} toggleAuthPage={toggleAuthPage} /> : <Navigate to="/" />} 
            />
            <Route path="/about" element={<About />} />
            <Route path="/purpose" element={<Purpose />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/" 
              element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/progress-checker" 
              element={isLoggedIn ? <ProgressChecker /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/account-settings" 
              element={isLoggedIn ? <AccountSettingsPage /> : <Navigate to="/auth" />} 
            />
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
        </div>
      </div>
      {location.pathname !== '/auth' && <Footer />}
    </>
  );
}

export default Layout;
