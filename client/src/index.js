import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Get the div with the id of 'root'
const container = document.getElementById('root');

// Create a root.
const root = createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
