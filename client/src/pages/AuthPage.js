import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link as ChakraLink
} from '@chakra-ui/react';

/**
 * AuthPage Component
 * 
 * This component provides a user interface for authentication, allowing users to either log in or sign up.
 * 
 * Props:
 * - onLogin: Function called with user data upon successful login or registration.
 * - showLogin: Boolean to show login form initially.
 * - toggleAuthPage: Function to toggle between login and sign-up views.
 * 
 * State:
 * - isLogin: Boolean to toggle between login and sign-up forms.
 * - formFields: Object to manage input field values.
 * - error: State to hold any error messages during authentication.
 * 
 * Features:
 * - Dynamic form switching between login and sign-up.
 * - Input validation and error handling.
 * - Backend communication for user authentication.
 * 
 * Handlers:
 * - handleToggle: Toggles the form between login and sign-up modes.
 * - handleSubmit: Handles form submission and authentication response.
 * 
 * Error Handling:
 * - Displays error messages from server or network failures.
 */
function AuthPage({ onLogin, showLogin, toggleAuthPage }) {
  // State for input fields and error message
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';
  
  const handleToggle = () => {
    setIsLogin(!isLogin); // Toggle between login and sign-up
    toggleAuthPage(); // Call the provided toggle function
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
  
    const formData = isLogin
      ? { usernameOrEmail, password }
      : { username, email, password };
    try {
      const response = await fetch(`${apiUrl}/hanguru/api/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('Login/Register successful:', userData);
    
        // Handle user data
        if (userData.streak !== undefined) {
          localStorage.setItem('loginStreak', userData.streak);
        }
        if (userData.user && userData.user.loginDates) {
          localStorage.setItem('loginDates', JSON.stringify(userData.user.loginDates));
        }
        onLogin(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to authenticate');
        console.error('Login/Register error:', errorData);
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        console.error('Error response:', err.response);
      }
      setError('Server error');
    }
  };
  
  // Render the component UI
  return (
    <Container centerContent>
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {showLogin ? (
              <>
                <FormControl id="usernameOrEmail">
                  <FormLabel>Username or Email</FormLabel>
                  <Input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
              </>
            )}
            {error && <Text color="red.500">{error}</Text>}
            <Button type="submit" colorScheme="blue" width="full">
              {showLogin ? 'Login' : 'Sign Up'}
            </Button>
            <ChakraLink color="blue.500" onClick={handleToggle}>
              {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </ChakraLink>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default AuthPage;
