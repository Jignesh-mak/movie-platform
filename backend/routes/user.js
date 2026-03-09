const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to build media item
const buildItem = (body) => ({
  movieId: String(body.movieId),
  title: body.title || 'Unknown',
  poster: body.poster || '',
  mediaType: body.mediaType || 'movie',
  rating: body.rating || 0
});

// ─── FAVORITES ──────────────────────────────────────────────────────────────

router.get('/favorites', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, favorites: user.favorites });
});

router.post('/favorites', protect, async (req, res) => {
  try {
    const item = buildItem(req.body);
    const user = await User.findById(req.user._id);
    const exists = user.favorites.find(f => f.movieId === item.movieId);
    if (exists) return res.status(400).json({ success: false, message: 'Already in favorites' });
    user.favorites.unshift({ ...item, addedAt: new Date() });
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/favorites/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(f => f.movieId !== req.params.movieId);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── WATCH HISTORY ──────────────────────────────────────────────────────────

router.get('/history', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, history: user.watchHistory });
});

router.post('/history', protect, async (req, res) => {
  try {
    const item = buildItem(req.body);
    const user = await User.findById(req.user._id);
    // Remove if already exists (to re-add at top)
    user.watchHistory = user.watchHistory.filter(h => h.movieId !== item.movieId);
    user.watchHistory.unshift({ ...item, watchedAt: new Date() });
    // Keep only last 50
    if (user.watchHistory.length > 50) user.watchHistory = user.watchHistory.slice(0, 50);
    await user.save();
    res.json({ success: true, history: user.watchHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/history/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchHistory = user.watchHistory.filter(h => h.movieId !== req.params.movieId);
    await user.save();
    res.json({ success: true, history: user.watchHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── WATCHLIST ──────────────────────────────────────────────────────────────

router.get('/watchlist', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, watchlist: user.watchlist });
});

router.post('/watchlist', protect, async (req, res) => {
  try {
    const item = buildItem(req.body);
    const user = await User.findById(req.user._id);
    const exists = user.watchlist.find(w => w.movieId === item.movieId);
    if (exists) return res.status(400).json({ success: false, message: 'Already in watchlist' });
    user.watchlist.unshift({ ...item, addedAt: new Date() });
    await user.save();
    res.json({ success: true, watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/watchlist/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter(w => w.movieId !== req.params.movieId);
    await user.save();
    res.json({ success: true, watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
