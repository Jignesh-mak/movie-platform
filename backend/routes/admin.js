const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ─── USERS ──────────────────────────────────────────────────────────────────

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-password').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot ban admin' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── MOVIES ─────────────────────────────────────────────────────────────────

router.get('/movies', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const movies = await Movie.find().populate('addedBy', 'username').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
    const total = await Movie.countDocuments();
    res.json({ success: true, movies, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/movies', async (req, res) => {
  try {
    const { title, poster, description, movieId, releaseDate, trailerLink, genre, category, rating } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const movie = await Movie.create({
      title, poster, description, movieId, releaseDate, trailerLink,
      genre: Array.isArray(genre) ? genre : (genre ? [genre] : []),
      category: category || 'movie', rating: rating || 0,
      addedBy: req.user._id
    });
    res.status(201).json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── STATS ──────────────────────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, bannedUsers, totalMovies] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      Movie.countDocuments()
    ]);
    res.json({ success: true, stats: { totalUsers, bannedUsers, totalMovies, activeUsers: totalUsers - bannedUsers } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
