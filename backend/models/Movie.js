const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  poster: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Description not available'
  },
  movieId: {
    type: String,
    unique: true,
    sparse: true
  },
  releaseDate: {
    type: Date
  },
  trailerLink: {
    type: String,
    default: ''
  },
  genre: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['movie', 'tv', 'anime', 'documentary', 'other'],
    default: 'movie'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  isCustom: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
