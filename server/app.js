// Import required packages
require('dotenv').config();
const express = require('express');        // Web framework for Node.js
const mongoose = require('mongoose');      // MongoDB object modeling tool
const passport = require('passport');      // Middleware for handling user authentication
const session = require('express-session');// Middleware for handling sessions
const cors = require('cors');              // Middleware for enabling Cross-Origin Resource Sharing
const app = express();
require('./passport-config')(passport);
const translateRoutes = require('./routes/translate');
const vocabularyRoutes = require('./routes/vocabulary');
const uploadRoutes = require('./routes/upload');
const gptRoute = require('./routes/gpt');
const bcrypt = require('bcryptjs');


// Configure middleware
app.use(express.json());                   // Parse JSON request bodies
app.use(cors());                           // Enable Cross-Origin Resource Sharing
app.use(session({ 
  secret: process.env.SESSION_SECRET,       // Secret key for session management
  resave: false,                            // Don't save session if unmodified
  saveUninitialized: false                  // Don't create session until something is stored
}));
app.use(passport.initialize());             // Initialize Passport for user authentication
app.use(passport.session());                // Enable session support for Passport

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected to Hanguru Database'))
.catch(err => console.error(err));

console.log("Key: " +process.env.OPENAI_API_KEY);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.use('/api', translateRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api', gptRoute);
app.use('/api/upload', uploadRoutes);


// Define the port to listen on
const PORT = process.env.PORT || 8100;

// Start the server and listen on the specified port
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server is running on port '+PORT);
});
