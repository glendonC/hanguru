# Hanguru: Korean Language Learning Web Application

## Introduction
Hanguru is an innovative web application designed to facilitate Korean language learning. It integrates various technologies, including AI and Google Cloud APIs, to offer a comprehensive and interactive learning experience.

## Features

### Vocab Page
- Create and edit personalized Korean vocab sets using Google Translation API.

### Exercise Page
- Practice with generated questions and receive feedback.

### Audio Recording
- Generate text for reading practice and record your own voice for review.

### Progress Checker
- Track your daily login consistency.

### User Account Management
- Register, login, and manage your profile and settings.

## Technologies Used

- **Backend**: Node.js with Express framework, Passport.js for authentication.
- **Frontend**: HTML, Chakra UI for responsive design.
- **Database**: MongoDB and Google Cloud.
- **AI/ML & Language Processing**: OpenAI and Google Cloud tools for Korean language processing.
- **Containerization**: Docker for deployment consistency.

## Environment Setup

### Dependencies
- Ensure Docker and MongoDB are installed.

### Environment Variables
Create an `.env` file in the server directory with the following:
```env
MONGO_URI=mongodb://mongo:27017/hanguru
SESSION_SECRET=<your_session_secret>
GOOGLE_API_KEY=<your_google_api_key>
OPENAI_API_KEY=<your_openai_api_key>
GCS_SERVICE_ACCOUNT=gcs-service-account.json
SPEECH_TO_TEXT_SERVICE_ACCOUNT=text-to-speech-service-account.json
GCS_BUCKET_NAME=hanguru-audio-bucket
PORT=8100
```

### Google Cloud Setup
- Obtain and configure the necessary service account JSON files

### Docker Network
- Create a network and connect all servers (GCP SQL Proxy, MongoDB, client, and server)
