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
 * This component provides a user interface for authentication, allowing users to either log in or sign up 
 *
 * Props:
 * - onLogin: A function that is called with the user data upon successful login or registration
 * - showLogin: A boolean indicating whether to show the login form initially
 * - toggleAuthPage: A function to toggle between the login and sign-up views
 * 
 * State Management:
 * - isLogin: Boolean state to toggle between login and sign-up forms
 * - usernameOrEmail, username, email, password: States to manage input field values
 * - error: State to hold any error messages during the authentication process
 * 
 * Features:
 * - Dynamic form that switches between login and sign-up based on the user's choice
 * - Form input validation and error handling
 * - Communicates with a backend server for user authentication
 * 
 * Handlers:
 * - handleToggle: Toggles the form between login and sign-up modes
 * - handleSubmit: Submits the form data for authentication and handles the response
 * 
 * Error Handling:
 * - Displays error messages received from the server or on network failure
 */
function AuthPage({ onLogin, showLogin, toggleAuthPage }) {
  // State for input fields and error message
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
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
      const response = await fetch(`/api/${endpoint}`, {
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
  
        // Session test immediately after successful login
        fetch('/api/test-session', {
          credentials: 'include'
        })
        .then(testResponse => testResponse.json())
        .then(testData => console.log('Session test after login:', testData))
        .catch(testError => console.error('Session test error:', testError));
  
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
