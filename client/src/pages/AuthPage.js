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
  Link as ChakraLink,
  useToast
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
 * - usernameOrEmail: State to manage the username or email input value for login.
 * - username: State to manage the username input value for registration.
 * - email: State to manage the email input value for registration.
 * - password: State to manage the password input value for both login and registration.
 * - error: State to hold any error messages during the authentication process.
 * 
 * Features:
 * - Dynamic form that switches between login and sign-up based on the user's choice.
 * - Form input validation and error handling.
 * - Communicates with a backend server for user authentication.
 * 
 * Handlers:
 * - handleToggle: Toggles the form between login and sign-up modes.
 * - handleSubmit: Submits the form data for authentication and handles the response.
 * 
 * Error Handling:
 * - Displays error messages received from the server or on network failure.
*/
function AuthPage({ onLogin, showLogin, toggleAuthPage }) {
  // State for input fields and error message
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';
  
  /**
   * handleToggle
   * Toggles the component between login and sign-up forms.
   * It switches the 'isLogin' state and calls the 'toggleAuthPage' prop function for additional actions.
  */
  const handleToggle = () => {
    setIsLogin(!isLogin); // Toggle between login and sign-up
    toggleAuthPage(); // Call the provided toggle function
  };

  /**
   * handleSubmit
   * Handles the form submission for either login or registration.
   * It prevents the default form submission event, constructs the appropriate request based on the current form state,
   * and communicates with the backend server for authentication.
   * Upon successful authentication, it calls the 'onLogin' prop function with the user data.
   * It also handles setting local storage items for user-specific data and displays any errors encountered during the process.
   * 
   * @param {Event} event - The form submission event.
  */
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
        toast({
          title: 'Error',
          description: errorData.message || JSON.stringify(errorData),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });        
        console.error('Login/Register error:', errorData);
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'Server Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
