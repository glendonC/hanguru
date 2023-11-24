import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast
} from '@chakra-ui/react';

function AccountSettingsPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8100/api/user/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: username }),
        credentials: 'include'
      });
  
      let message;
      if (response.headers.get("Content-Type").includes("application/json")) {
        const responseData = await response.json();
        message = responseData.message;
      } else {
        message = await response.text();
      }
  
      if (response.ok) {
        toast({
          title: "Username Updated",
          description: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(message || 'Failed to update username');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8100/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
        credentials: 'include'
      });
  
      let message;
      if (response.headers.get("Content-Type").includes("application/json")) {
        const responseData = await response.json();
        message = responseData.message;
      } else {
        message = await response.text();
      }
  
      if (response.ok) {
        toast({
          title: "Password Updated",
          description: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Heading as="h2" mb={6}>
        Account Settings
      </Heading>

      <VStack spacing={4}>
        {/* Profile Picture Update */}
        {/* Add a file input for profile picture with Chakra UI styling if needed */}

        {/* Username Update */}
        <FormControl as="fieldset">
          <FormLabel as="legend">Change Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="New Username"
          />
          <Button mt={4} colorScheme="blue" onClick={handleUsernameChange}>
            Update Username
          </Button>
        </FormControl>

        {/* Password Update */}
        <FormControl as="fieldset">
          <FormLabel as="legend">Change Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <Button mt={4} colorScheme="blue" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default AccountSettingsPage;
