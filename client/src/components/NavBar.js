import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image
} from '@chakra-ui/react';

import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

/**
 * NavBar Component
 * 
 * This component provides a responsive navigation bar for the application.
 * 
 * Props:
 * - user: An object containing user information (e.g., username, profile picture).
 * 
 * State:
 * - profilePictureUrl: URL of the user's profile picture.
 * 
 * Behavior:
 * - Displays navigation links.
 * - Handles toggling between light and dark mode.
 * - Manages the responsive menu for smaller screens.
 * - Provides user account interaction such as logout and account settings.
 * 
 * Navigation:
 * - Uses react-router-dom for navigation without reloading the page.
 * 
 * Styling:
 * - Uses Chakra UI for styling components.
 * - Utilizes styled components for custom link styling.
*/
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Vocabulary', path: '/vocabulary' },
  { name: 'Exercises', path: '/exercises' },
  { name: 'Audio Recording', path: '/audio-recording' },
];

const StyledLink = styled(Link)`
  position: relative;
  text-decoration: none;
  font-weight: 800;
  color: gray.500;
  text-transform: uppercase;
  margin: 0 10px;
  padding: 8px 16px;
  transition: all .3s ease-in-out;
  display: inline-block;
  background-color: transparent;
  z-index: 1;

  &:hover {
    color: #91640F;
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
    height: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 1px;
    background: #F1C40F;
    transition: all .3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    z-index: -1;
  }
`;

// Handle navigation links
const NavLink = ({ children, to }) => {
  return (
    <StyledLink to={to}>
      {children}
    </StyledLink>
  );
};




export default function NavBar({ user, setLoggedIn }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';
  
  // Fetches and set the user's profile picture URL
  useEffect(() => {
    if (user?.user?.profilePicture) {
      const profilePictureId = user.user.profilePicture;
      fetch(`${apiUrl}/hanguru/api/profiles/profile-pictures/${profilePictureId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok');
          }
        })
        .then((data) => {
          setProfilePictureUrl(data.imageUrl);
        })        
        .catch((error) => {
          console.error('Error fetching signed URL for profile picture:', error);
        });
    }
  }, [user]);

  // Handle user logout
  const handleLogout = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8100';
    try {
      const response = await fetch(`${apiUrl}/hanguru/api/logout`, { 
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setLoggedIn(false);
        navigate('/auth');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  /**
   * handleAccountSettingsClick
   * Navigates the user to the account settings page.
  */
  const handleAccountSettingsClick = () => {
    navigate('/account-settings');
  };

  /**
   * handleProgressCheckerClick
   * Navigates the user to the progress checker page.
  */
  const handleProgressCheckerClick = () => {
    navigate('/progress-checker');
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image src={logo} alt="Logo" boxSize="50px" />
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path}>{link.name}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            {/* Profile Icon and Dropdown Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  {...(profilePictureUrl && { src: profilePictureUrl })}
                />
              </MenuButton>
              <MenuList>
                <Center>
                <Avatar
                  size={'sm'}
                  {...(profilePictureUrl && { src: profilePictureUrl })}
                />
                </Center>
                <Center>
                    <p>{user?.user?.username || 'Guest'}</p>
                </Center>
                <MenuDivider />
                <MenuItem onClick={handleProgressCheckerClick}>Progress Checker</MenuItem>
                <MenuItem onClick={handleAccountSettingsClick}>Account Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path}>{link.name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
