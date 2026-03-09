const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  favorites: [{
    movieId: { type: String, required: true },
    title: String,
    poster: String,
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    rating: Number,
    addedAt: { type: Date, default: Date.now }
  }],
  watchHistory: [{
    movieId: { type: String, required: true },
    title: String,
    poster: String,
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    rating: Number,
    watchedAt: { type: Date, default: Date.now }
  }],
  watchlist: [{
    movieId: { type: String, required: true },
    title: String,
    poster: String,
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    rating: Number,
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
