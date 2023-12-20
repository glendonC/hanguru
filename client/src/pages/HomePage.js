import React, { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

/**
 * HomePage Component
 * 
 * Serves as the landing page of Hanguru, providing an engaging and animated welcome experience.
 * 
 * State Management:
 * - showEnglish: Boolean state for toggling between English and Korean versions of the welcome message.
 * - mottoIndex: Integer state for cycling through different mottos related to language learning.
 * - quoteIndex: Integer state for displaying different language learning quotes.
 * 
 * Features:
 * - Displays a welcome message alternating between English and Korean.
 * - Shows a rotating selection of mottos and language learning quotes.
 * 
 * Animation and Transition:
 * - Utilizes Framer Motion for smooth animation of text elements (welcome message and mottos).
 * - Manages the entrance, visibility, and exit transitions of text elements for a dynamic user experience.
 * 
 * Effects and Lifecycle:
 * - Uses useEffect hook to set intervals for alternating messages and changing mottos.
 * - Clears intervals on component unmount to prevent memory leaks and ensure efficient resource usage.
 * 
 * Styling:
 * - Styles provided by Chakra UI for a responsive and accessible design.
 * - Flexible layout to center content vertically and horizontally on the page.
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
    <Box p={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="70vh">
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
