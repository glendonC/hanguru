import React, { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

/**
 * HomePage Component
 * 
 * This component serves as the home page of Hanguru
 * 
 * State Management:
 * - showEnglish: Toggles between the English and Korean versions of the welcome message
 * - mottoIndex: Controls which motto is currently displayed
 * 
 * Features:
 * - Alternating welcome messages in English and Korean
 * - Rotating display of different mottos related to language learning
 * 
 * The component uses React's useState and useEffect hooks for managing state and side effects
 * It employs framer motion for animating the entrance and exit of text elements
 * 
 * Animation and State Management:
 * - The welcome message and mottos are animated using Framer Motion to smoothly transition in and out
 * - The useEffect hook is used to set intervals for alternating between English and Korean messages, changing mottos, and displaying different quotes
 * - These intervals are cleared on component unmount to prevent memory leaks
 * 
 */

function HomePage() {
  const [showEnglish, setShowEnglish] = useState(true);
  const [mottoIndex, setMottoIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const mottos = [
    "Master Korean, One Word at a Time",
    "Embark on Your Korean Language Journey with Confidence",
    "Learning Korean Made Fun and Interactive",
  ];

  const quotes = [
    "Language is the road map of a culture. It tells you where its people come from and where they are going.",
    "One language sets you in a corridor for life. Two languages open every door along the way.",
    "Learning another language is not only learning different words for the same things but learning another way to think about things.",
  ];

  useEffect(() => {
    const languageInterval = setInterval(() => {
      setShowEnglish(prev => !prev);
    }, 3000);

    const mottoInterval = setInterval(() => {
      setMottoIndex(prev => (prev + 1) % mottos.length);
    }, 5000);

    return () => {
      clearInterval(languageInterval);
      clearInterval(mottoInterval);
    };
  }, []);

  return (
    <Box p={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        key={showEnglish ? "english" : "korean"}
      >
        <Heading as="h1" size="4xl" textAlign="center" mb={4}>
          {showEnglish ? "Welcome to Hanguru" : "한구루에 오신 것을 환영합니다"}
        </Heading>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        key={mottoIndex}
      >
        <Text fontSize="xl" textAlign="center" mb={3}>
          {mottos[mottoIndex]}
        </Text>
      </motion.div>
      <Text fontSize="md" textAlign="center" maxWidth="600px">
        {quotes[quoteIndex]}
      </Text>
    </Box>
  );
}

export default HomePage;
