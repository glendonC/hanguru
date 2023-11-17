const mongoose = require('mongoose');

const vocabularyItemSchema = new mongoose.Schema({
  korean: String,
  english: String,
  set: { type: mongoose.Schema.Types.ObjectId, ref: 'VocabularySet' },
});

module.exports = mongoose.model('VocabularyItem', vocabularyItemSchema);
