import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import { fetchFavorites, fetchHistory, fetchWatchlist } from './store/slices/userSlice';

import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import PeoplePage from './pages/PeoplePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TVDetailPage from './pages/TVDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { FavoritesPage, WatchHistoryPage, WatchlistPage } from './pages/UserListPages';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useSelector(s => s.auth);
  if (!initialized) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, initialized } = useSelector(s => s.auth);
  if (!initialized) return <div className="loading-screen"><div className="spinner" /></div>;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
      dispatch(fetchHistory());
      dispatch(fetchWatchlist());
    }
  }, [dispatch, user]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/tv/:id" element={<TVDetailPage />} />
            <Route path="/person/:id" element={<PersonDetailPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><WatchHistoryPage /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
