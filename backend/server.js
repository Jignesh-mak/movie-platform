const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes   = require('./routes/auth');
const userRoutes   = require('./routes/user');
const movieRoutes  = require('./routes/movies');
const adminRoutes  = require('./routes/admin');
const tmdbRoutes   = require('./routes/tmdb');
const imageRoutes  = require('./routes/images');

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/image', imageRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'CinemaVerse API running — Fake TMDB mode' })
);

// -------- SERVE FRONTEND --------

const frontendPath = path.join(__dirname, "../frontend/build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// -------- ERROR HANDLER --------

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


// -------- DATABASE --------

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });

  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });