import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

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
      <Routes>
        <Route 
          path="/auth" 
          element={isLoggedIn ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} showLogin={showLogin} toggleAuthPage={toggleAuthPage} />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
