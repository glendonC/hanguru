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
    <iframe 
      src="/auth/auth.html"
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Authentication Page"
    ></iframe>
  );
}

export default AuthPage;
