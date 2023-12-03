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
const authRoutes = require('./routes/auth');
const MongoStore = require('connect-mongo');
app.use(express.json()); 
// Configure middleware

app.use(cors({
  origin: ['https://glendonc.github.io', 'http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

                          
console.log("Session Secret: ", process.env.SESSION_SECRET);
console.log("Mongo URI: ", process.env.MONGO_URI)
app.use(session({
  secret: process.env.SESSION_SECRET || 'temporarySecretForTesting',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    //secure: process.env.NODE_ENV === 'production',
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session User:', req.user);
  console.log('Session Details:', req.session);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected to Hanguru Database'))
.catch(err => console.error(err));
app.get('/test-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "Authenticated", user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
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
