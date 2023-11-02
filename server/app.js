// Import required packages
const express = require('express');        // Web framework for Node.js
const mongoose = require('mongoose');      // MongoDB object modeling tool
const passport = require('passport');      // Middleware for handling user authentication
const session = require('express-session');// Middleware for handling sessions
const cors = require('cors');              // Middleware for enabling Cross-Origin Resource Sharing
const app = express();

// Configure middleware
app.use(express.json());                   // Parse JSON request bodies
app.use(cors());                            // Enable Cross-Origin Resource Sharing
app.use(session({ 
  secret: 'your_secret_key',                // Secret key for session management
  resave: false,                            // Don't save session if unmodified
  saveUninitialized: false                  // Don't create session until something is stored
}));
app.use(passport.initialize());             // Initialize Passport for user authentication
app.use(passport.session());                // Enable session support for Passport

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
