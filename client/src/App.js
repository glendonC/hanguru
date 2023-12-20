import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AnimatedCursor from './components/AnimatedCursor';
import Layout from './Layout';

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
      <AnimatedCursor />
      <Layout 
        isLoggedIn={isLoggedIn} 
        user={user} 
        setLoggedIn={setLoggedIn}
        handleLogin={handleLogin}
        showLogin={showLogin}
        toggleAuthPage={toggleAuthPage}
      />
    </Router>
  );
}

export default App;
