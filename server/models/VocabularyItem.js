const mongoose = require('mongoose');

const vocabularyItemSchema = new mongoose.Schema({
  korean: String,
  english: String,
});

module.exports = mongoose.model('VocabularyItem', vocabularyItemSchema);
