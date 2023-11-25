import React, { useState, useEffect } from 'react';
import { Box, Text, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import Calendar from './Calendar';

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
