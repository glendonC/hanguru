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
const textToSpeechRoute = require('./routes/textToSpeechRoute');
const userSettingsRoutes = require('./routes/userSettings');
const speechToTextRoute = require('./routes/speechToTextRoute');
const recordingRoutes = require('./routes/recording');
const usersRoutes = require('./routes/users');
const dbPool = require('./db/database');


const bcrypt = require('bcryptjs');

const MongoStore = require('connect-mongo');

// Configure middleware
app.use(express.json());            // Parse JSON request bodies
const corsOptions = {
  origin: 'http://localhost:3001', // Client's origin
  credentials: true // To allow sending cookies or authentication headers
};
app.use(cors(corsOptions));  // Enable Cross-Origin Resource Sharing
                          
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(passport.initialize());             // Initialize Passport for user authentication
app.use(passport.session());                // Enable session support for Passport

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected to Hanguru Database'))
.catch(err => console.error(err));

app.get('/example', async (req, res) => {
  try {
    const [rows, fields] = await dbPool.query('SELECT * FROM your_table');
    res.json(rows);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.use('/api', translateRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api', gptRoute);
app.use('/api/upload', uploadRoutes);
app.use('/api', textToSpeechRoute);
app.use('/api/user', userSettingsRoutes);
app.use('/api/speech-to-text', speechToTextRoute);
app.use('/api/recordings', recordingRoutes);
app.use('/api/users', usersRoutes);

// Define the port to listen on
const PORT = process.env.PORT || 8100;

// Start the server and listen on the specified port
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server is running on port '+PORT);
});
