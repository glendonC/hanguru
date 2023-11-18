const express = require('express');
const router = express.Router();
const VocabularyItem = require('../models/VocabularyItem');
const VocabularySet = require('../models/VocabularySet');

/**
 * POST /add
 * Adds a new vocabulary item to the database and optionally to a vocabulary set
 * 
 * Request body:
 * - korean: The Korean word or phrase
 * - english: The English translation
 * - set: The ID of the vocabulary set to which this item belongs
 * 
 * Response:
 * - On success: Returns the created VocabularyItem
 * - On error: Returns a 500 status with an error message
 */
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

/**
 * POST /add
 * Adds a new vocabulary item to the database and optionally to a vocabulary set
 * 
 * Request body:
 * - korean: The Korean word or phrase
 * - english: The English translation
 * - set: The ID of the vocabulary set to which this item belongs
 * 
 * Response:
 * - On success: Returns the created VocabularyItem
 * - On error: Returns a 500 status with an error message
 */
router.get('/sets', async (req, res) => {
    try {
      const sets = await VocabularySet.find({});
      res.json(sets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

/**
 * POST /set/add
 * Adds a new vocabulary set
 * 
 * Request body:
 * - name: The name of the new vocabulary set
 * 
 * Response:
 * - On success: Returns the created VocabularySet
 * - On error: Returns a 500 status with an error message
 */
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

/**
 * GET /set/:setId/items
 * Retrieves all vocabulary items within a specific set
 * 
 * URL params:
 * - setId: The ID of the vocabulary set
 * 
 * Response:
 * - On success: Returns an array of VocabularyItem objects belonging to the set
 * - On error: Returns a 500 status with an error message
 */
router.get('/set/:setId/items', async (req, res) => {
  try {
    const { setId } = req.params;
    const setWithItems = await VocabularySet.findById(setId).populate('items');
    res.json(setWithItems.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /item/edit/:itemId
 * Updates a specific vocabulary item
 * 
 * URL params:
 * - itemId: The ID of the vocabulary item to update
 * 
 * Request body:
 * - korean: Updated Korean word or phrase
 * - english: Updated English translation
 * 
 * Response:
 * - On success: Returns the updated VocabularyItem
 * - On error: Returns a 500 status with an error message
 */
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

/**
 * DELETE /item/delete/:itemId
 * Deletes a specific vocabulary item and removes it from any sets it belongs to
 * 
 * URL params:
 * - itemId: The ID of the vocabulary item to delete
 * 
 * Response:
 * - On success: Returns a success message
 * - On error: Returns a 500 status with an error message
 */
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
