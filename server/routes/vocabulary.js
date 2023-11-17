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

router.get('/set/:setId/items', async (req, res) => {
  try {
    const { setId } = req.params;
    const setWithItems = await VocabularySet.findById(setId).populate('items');
    res.json(setWithItems.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/item/edit/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { korean, english } = req.body;
  try { 
    const updatedItem = await VocabularyItem.findByIdAndUpdate(itemId, { korean, english }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/item/delete/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    await VocabularySet.updateMany(
      { items: itemId }, 
      { $pull: { items: itemId } }
    );

    await VocabularyItem.deleteOne({ _id: itemId });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
