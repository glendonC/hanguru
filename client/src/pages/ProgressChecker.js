import React, { useState, useEffect } from 'react';
import { Box, Text, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import Calendar from './Calendar';

/**
 * ProgressChecker Component
 * 
 * Provides a visual representation of the user's progress in language learning, 
 * particularly focusing on their login streak and visualizing login dates on a calendar.
 * 
 * State Management:
 * - loginStreak: Stores the user's current login streak, fetched from local storage.
 * - loginDates: An array of dates representing the user's login history, also fetched from local storage.
 * 
 * Features:
 * - Displays a calendar component (Calendar) with marked login dates.
 * - Shows the user's login streak as a statistical number.
 * 
 * Effects and Lifecycle:
 * - On component mount, fetches login streak and dates from local storage and sets them in state.
 * - Handles parsing of dates and errors gracefully.
 * 
 * Styling:
 * - Uses Chakra UI components for styling and layout.
 * - Includes a Stat component to emphasize the login streak.
 * 
 * Dependency:
 * - Relies on the Calendar component to visualize login dates.
*/
function ProgressChecker() {
  const [loginStreak, setLoginStreak] = useState(0);
  const [loginDates, setLoginDates] = useState([]);

  useEffect(() => {
    const storedStreak = localStorage.getItem('loginStreak');
    if (storedStreak) {
      setLoginStreak(parseInt(storedStreak, 10));
    }

    const storedLoginDates = localStorage.getItem('loginDates');
    if (storedLoginDates && storedLoginDates !== "undefined") {
      try {
        const dates = JSON.parse(storedLoginDates);
        if (Array.isArray(dates)) {
          setLoginDates(dates);
        }
      } catch (error) {
        console.error('Error parsing login dates:', error);
      }
    } else {
      console.log('No login dates found in local storage');
    }
  }, []);

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={4}>Progress Checker</Text>
      <Calendar loginDates={loginDates} />
      
      <Stat mt={5}>
        <StatLabel>Login Streak</StatLabel>
        <StatNumber>{loginStreak}</StatNumber>
        <StatHelpText>Consecutive Days</StatHelpText>
      </Stat>
    </Box>
  );
}

export default ProgressChecker;
