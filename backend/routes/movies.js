const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Custom admin-added movies
router.get('/custom', async (req, res) => {
  try {
    const movies = await Movie.find({ isCustom: true }).sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/custom/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
