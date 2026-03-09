import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// User - Favorites
export const getFavorites = () => api.get('/user/favorites');
export const addFavorite = (data) => api.post('/user/favorites', data);
export const removeFavorite = (movieId) => api.delete(`/user/favorites/${movieId}`);

// User - History
export const getHistory = () => api.get('/user/history');
export const addHistory = (data) => api.post('/user/history', data);
export const removeHistory = (movieId) => api.delete(`/user/history/${movieId}`);

// User - Watchlist
export const getWatchlist = () => api.get('/user/watchlist');
export const addWatchlist = (data) => api.post('/user/watchlist', data);
export const removeWatchlist = (movieId) => api.delete(`/user/watchlist/${movieId}`);

// Admin - Users
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const banUser = (id) => api.patch(`/admin/users/${id}/ban`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminStats = () => api.get('/admin/stats');

// Admin - Movies
export const getAdminMovies = (params) => api.get('/admin/movies', { params });
export const createAdminMovie = (data) => api.post('/admin/movies', data);
export const updateAdminMovie = (id, data) => api.put(`/admin/movies/${id}`, data);
export const deleteAdminMovie = (id) => api.delete(`/admin/movies/${id}`);

export default api;
