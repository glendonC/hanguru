const express = require('express');
const router = express.Router();
const VocabularyItem = require('../models/VocabularyItem');

router.post('/add', async (req, res) => {
  const { korean, english } = req.body;
  try {
    const newItem = new VocabularyItem({ korean, english });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
