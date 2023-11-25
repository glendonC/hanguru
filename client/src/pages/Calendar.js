import React from 'react';
import { Grid, Box, useColorModeValue } from '@chakra-ui/react';

const Calendar = ({ loginDates }) => {
  const monthDays = getMonthDays();
  const formattedLoginDates = loginDates.map(date => new Date(date).toISOString().split('T')[0]);
  const currentDate = new Date().toISOString().split('T')[0];

  const dayBg = useColorModeValue('gray.100', 'gray.700');
  const highlightedBg = useColorModeValue('green.200', 'green.700');
  const currentDayBg = useColorModeValue('blue.200', 'blue.700');

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
      {monthDays.map(day => (
        <Box
          key={day.dateString}
          p={3}
          bg={day.dateString === currentDate ? currentDayBg :
              formattedLoginDates.includes(day.dateString) ? highlightedBg : dayBg}
          borderRadius="md"
        >
          {day.day}
        </Box>
      ))}
    </Grid>
  );
};

function getMonthDays() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = new Date(year, month, i + 1);
    return {
      day: day.getDate(),
      dateString: day.toISOString().split('T')[0]
    };
  });
}

export default Calendar;
