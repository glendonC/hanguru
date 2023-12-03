import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Grid,
  Image
} from '@chakra-ui/react';

function AccountSettingsPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [profilePictures, setProfilePictures] = useState([]);

  useEffect(() => {
    fetch('https://peaceful-retreat-31647-a23d2c8b232f.herokuapp.com/api/users/profile-pictures')
      .then((response) => response.json())
      .then((data) => {
        setProfilePictures(data);
      })
      .catch((error) => {
        console.error('Error fetching profile pictures:', error);
      });
  }, []);

  const handleProfilePictureChange = async (pictureId) => {
    console.log('Sending request to update profile picture', { selectedProfilePicture: pictureId });

    try {
      
      const response = await fetch('https://peaceful-retreat-31647-a23d2c8b232f.herokuapp.com/api/user/update-profile-picture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedProfilePicture: pictureId }),
        credentials: 'include',
      });
  
      if (response.ok) {
        setSelectedProfilePicture(pictureId);
  
        toast({
          title: 'Profile Picture Updated',
          description: 'Your profile picture has been updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Error status:', response.status, 'Error message:', response.statusText);
        throw new Error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://peaceful-retreat-31647-a23d2c8b232f.herokuapp.com/api/user/change-username', {
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
      const response = await fetch('https://peaceful-retreat-31647-a23d2c8b232f.herokuapp.com//api/user/change-password', {
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
        <FormControl>
          <FormLabel>Select Profile Picture</FormLabel>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {Array.isArray(profilePictures) && profilePictures.map((picture) => (
  <Image
    key={picture.id}
    src={picture.imageUrl}
    alt="Profile"
    onClick={() => handleProfilePictureChange(picture.id)}
    className={picture.id === selectedProfilePicture ? 'selected' : ''}
  />
))}

          </Grid>

        </FormControl>

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
