import React from 'react';
import { Grid, Box, Text } from '@chakra-ui/react';

const Calendar = ({ loginDates }) => {
  const monthDays = getMonthDays();
  const formattedLoginDates = loginDates.map(date => date.split('T')[0]);

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
      {monthDays.map(day => (
        formattedLoginDates.includes(day.dateString) ?
          <Box key={day.dateString} p={3} bg="green.200" borderRadius="md">
            <Text>{day.day}</Text>
          </Box> :
          <Box key={day.dateString} p={3} bg="gray.100" borderRadius="md">
            <Text>{day.day}</Text>
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
