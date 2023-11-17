const mongoose = require('mongoose');

const vocabularySetSchema = new mongoose.Schema({
  setName: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VocabularyItem' }],
});

module.exports = mongoose.model('VocabularySet', vocabularySetSchema);
