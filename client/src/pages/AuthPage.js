import React, { useState } from 'react';

function AuthPage({ onLogin, showLogin, toggleAuthPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('Sending login request with:', { usernameOrEmail, password });
    try {
      const response = await fetch('http://localhost:8100/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      if (response.ok) {
        onLogin();
      } else {
        const errorData = await response.json();
  setError(errorData.message || 'Failed to log in');
      }
    } catch (err) {
      setError('Server error');
    }
  };
  

  const handleSignUp = async (event) => {
    console.log("handleSignUp called");
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8100/api/register', { // Updated URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }), // Make sure these fields match your backend expectations
      });
      if (response.ok) {
        setIsLogin(true);
      } else {
        setError('Failed to register');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  
  console.log('IsLogin State:', showLogin);
  return (
    <div>
      {showLogin ? (
        // Login Form
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
          <button type="button" onClick={(e) => { e.preventDefault(); toggleAuthPage(); }}>Switch to Sign Up</button>
        </form>
      ) : (
        // Sign Up Form
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={(e) => { e.preventDefault(); toggleAuthPage(); }}>Switch to Login</button>

        </form>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AuthPage;
