const express = require('express');
const router = express.Router();
const VocabularyItem = require('../models/VocabularyItem');
const VocabularySet = require('../models/VocabularySet');

router.post('/add', async (req, res) => {
  const { korean, english, set } = req.body;
  try {
    const newItem = new VocabularyItem({ korean, english, set });
    await newItem.save();

    if (set) {
      await VocabularySet.findByIdAndUpdate(set, { $push: { items: newItem._id } });
    }

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/sets', async (req, res) => {
    try {
      const sets = await VocabularySet.find({});
      res.json(sets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post('/set/add', async (req, res) => {
    const { name } = req.body;
    try {
      const newSet = new VocabularySet({ setName: name });
      await newSet.save();
      res.status(201).json(newSet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;
