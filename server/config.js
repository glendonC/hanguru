module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/hanguru',
  sessionSecret: process.env.SESSION_SECRET,
};
