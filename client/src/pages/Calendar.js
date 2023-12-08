import React from 'react';
import { Grid, Box, useColorModeValue } from '@chakra-ui/react';

/**
 * Calendar Component
 * 
 * This component renders a calendar grid for the current month, highlighting specific dates.
 * 
 * Props:
 * - loginDates: An array of dates representing user login days which will be highlighted on the calendar.
 * 
 * Behavior:
 * - It displays all the days of the current month in a grid layout.
 * - Days are highlighted differently based on whether they are the current day, 
 *   a user login day, or a regular day.
 * 
 * Styling:
 * - Uses Chakra UI's useColorModeValue hook for responsive color modes.
 * - Different background colors are applied to current day, highlighted days, and regular days.
 * 
 * Helper Function:
 * - getMonthDays: A function to generate an array of days for the current month.
 * - Each day is represented as an object containing the day number and a string representation of the date.
*/
const Calendar = ({ loginDates }) => {
  const monthDays = getMonthDays();
  const formattedLoginDates = loginDates.map(date => new Date(date).toISOString().split('T')[0]);
  const currentDate = new Date().toISOString().split('T')[0];

  const dayBg = useColorModeValue('gray.100', 'gray.700');
  const highlightedBg = useColorModeValue('green.200', 'green.700');
  const currentDayBg = useColorModeValue('blue.200', 'blue.700');

  // Render a grid of days, highlighting current day and login days
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

// Helper function to generate an array of days for the current month
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
