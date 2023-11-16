import React, { useState } from 'react';

/**
 * AuthPage component for handling user authentication.
 * 
 * @param {Function} onLogin - Callback function to execute on successful login.
 * @param {boolean} showLogin - Boolean to determine whether to show the login form.
 * @param {Function} toggleAuthPage - Function to toggle between login and sign-up forms.
 */
function AuthPage({ onLogin, showLogin, toggleAuthPage }) {
  // State for input fields and error message
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  /**
   * Handles the login form submission.
   * 
   * @param {Event} event - The event object from form submission.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8100/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to log in');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server error');
    }
  };
  
  /**
   * Handles the sign-up form submission.
   * 
   * @param {Event} event - The event object from form submission.
  */
  const handleSignUp = async (event) => {
    console.log("handleSignUp called");
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8100/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
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

  
  // Render the component UI
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
