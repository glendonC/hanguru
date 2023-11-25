import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { Box, Text, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

function ProgressChecker() {
  const [loginDates, setLoginDates] = useState([]);
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    const mockLoginDates = ['2023-11-25', '2023-11-26', '2023-11-27'];
    setLoginDates(mockLoginDates);

    const mockLoginStreak = 3;
    setLoginStreak(mockLoginStreak);
  }, []);

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={4}>Progress Checker</Text>
      <Calendar loginDates={loginDates} />
      
      {}
      <Stat mt={5}>
        <StatLabel>Login Streak</StatLabel>
        <StatNumber>{loginStreak}</StatNumber>
        <StatHelpText>Consecutive Days</StatHelpText>
      </Stat>
    </Box>
  );
}

export default ProgressChecker;
