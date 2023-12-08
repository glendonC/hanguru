const express = require('express');
const Recording = require('../models/Recording');
const router = express.Router();

/**
 * GET /
 * Retrieves and lists all recordings from the database.
 * 
 * Response:
 * - On success: Returns an array of all recordings.
 * - On error: 500 status with an error message 'Error fetching recordings'.
 * 
 * This endpoint fetches and returns all the recording entries stored in the database.
*/
router.get('/', async (req, res) => {
  try {
    const recordings = await Recording.find({});
    res.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).send('Error fetching recordings');
  }
});

/**
 * GET /recordings/:id
 * Retrieves a specific recording by its ID.
 * 
 * Parameters:
 * - id: The unique identifier of the recording.
 * 
 * Response:
 * - On success: Returns the recording object.
 * - On not found: 404 status with message 'Recording not found'.
 * - On error: 500 status with message 'Error fetching recording'.
 * 
 * This endpoint fetches a single recording based on the provided ID.
*/
router.get('/recordings/:id', async (req, res) => {
    try {
      const recording = await Recording.findById(req.params.id);
      if (!recording) {
        return res.status(404).send('Recording not found');
      }
      res.json(recording);
    } catch (error) {
      console.error('Error fetching recording:', error);
      res.status(500).send('Error fetching recording');
    }
});

/**
 * DELETE /delete/:id
 * Deletes a specific recording from the database based on its ID.
 * 
 * Parameters:
 * - id: The unique identifier of the recording to be deleted.
 * 
 * Response:
 * - On success: Returns a confirmation message 'Recording deleted successfully'.
 * - On error: 500 status with message 'Error deleting recording'.
 * 
 * This endpoint removes a recording from the database. It is intended for managing recordings.
*/
router.delete('/delete/:id', async (req, res) => {
  try {
    const recordingId = req.params.id;
    await Recording.findByIdAndDelete(recordingId);
    res.json({ message: 'Recording deleted successfully' });
  } catch (error) {
    console.error('Error deleting recording:', error);
    res.status(500).send('Error deleting recording');
  }
});

module.exports = router;