const express = require('express');
const Recording = require('../models/Recording');
const router = express.Router();

// Lists all recordings
router.get('/', async (req, res) => {
  try {
    const recordings = await Recording.find({});
    res.json(recordings);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res.status(500).send('Error fetching recordings');
  }
});

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