import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, getAdminMovies, banUser, deleteUser, createAdminMovie, updateAdminMovie, deleteAdminMovie } from '../services/api';

const VIEWS = ['Overview', 'Movies', 'Users', 'Add Movie'];

const AdminDashboard = () => {
  const [view, setView] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [movieForm, setMovieForm] = useState({
    title: '', poster: '', description: '', movieId: '',
    releaseDate: '', trailerLink: '', genre: '', category: 'movie', rating: ''
  });

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    if (view === 'Overview') getAdminStats().then(r => setStats(r.data.stats)).catch(() => {});
    if (view === 'Users') getAdminUsers().then(r => setUsers(r.data.users)).catch(() => {});
    if (view === 'Movies') getAdminMovies().then(r => setMovies(r.data.movies)).catch(() => {});
  }, [view]);

  const handleBan = async (id) => {
    await banUser(id);
    setUsers(u => u.map(user => user._id === id ? { ...user, isBanned: !user.isBanned } : user));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(u => u.filter(user => user._id !== id));
    notify('User deleted.');
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    await deleteAdminMovie(id);
    setMovies(m => m.filter(movie => movie._id !== id));
    notify('Movie deleted.');
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...movieForm, genre: movieForm.genre.split(',').map(g => g.trim()).filter(Boolean) };
      if (editMovie) {
        await updateAdminMovie(editMovie._id, payload);
        notify('Movie updated!');
        setView('Movies');
        setEditMovie(null);
      } else {
        await createAdminMovie(payload);
        notify('Movie added!');
      }
      setMovieForm({ title: '', poster: '', description: '', movieId: '', releaseDate: '', trailerLink: '', genre: '', category: 'movie', rating: '' });
    } catch (err) {
      notify('Error: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const startEdit = (movie) => {
    setEditMovie(movie);
    setMovieForm({
      title: movie.title || '', poster: movie.poster || '',
      description: movie.description || '', movieId: movie.movieId || '',
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : '',
      trailerLink: movie.trailerLink || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : '',
      category: movie.category || 'movie', rating: movie.rating || ''
    });
    setView('Add Movie');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">⚙️ ADMIN PANEL</div>
        {VIEWS.map(v => (
          <button key={v} className={`admin-nav-item ${view === v ? 'active' : ''}`} onClick={() => { setView(v); setEditMovie(null); }}>
            {v === 'Overview' ? '📊' : v === 'Movies' ? '🎬' : v === 'Users' ? '👥' : '➕'} {v}
          </button>
        ))}
      </aside>

      <div className="admin-main">
        {msg && <div className="alert alert-success" style={{ marginBottom: 20 }}>{msg}</div>}

        {/* Overview */}
        {view === 'Overview' && (
          <>
            <div className="admin-header">
              <h1>Dashboard</h1>
              <p>Platform overview and stats</p>
            </div>
            <div className="stats-grid">
              {stats ? [
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers, icon: '✅' },
                { label: 'Banned Users', value: stats.bannedUsers, icon: '🚫' },
                { label: 'Custom Movies', value: stats.totalMovies, icon: '🎬' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              )) : <div className="spinner" />}
            </div>
          </>
        )}

        {/* Users */}
        {view === 'Users' && (
          <>
            <div className="admin-header"><h1>Users</h1><p>Manage platform users</p></div>
            <div className="admin-table-wrap">
              <div className="admin-table-header">
                <span className="admin-table-title">All Users ({users.length})</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.username}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td><span className={`badge ${u.isBanned ? 'badge-banned' : 'badge-user'}`}>{u.isBanned ? 'Banned' : 'Active'}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className={`btn-sm ${u.isBanned ? 'btn-accent' : 'btn-warning'}`} onClick={() => handleBan(u._id)}>
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            {u.role !== 'admin' && (
                              <button className="btn-sm btn-danger" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Movies */}
        {view === 'Movies' && (
          <>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><h1>Movies</h1><p>Manage custom movie entries</p></div>
              <button className="btn-sm btn-accent" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => { setEditMovie(null); setView('Add Movie'); }}>+ Add Movie</button>
            </div>
            <div className="admin-table-wrap">
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Poster</th><th>Title</th><th>Category</th><th>Rating</th><th>Added</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {movies.map(m => (
                      <tr key={m._id}>
                        <td>
                          <img src={m.poster || 'https://via.placeholder.com/40x60/111827/4a5568?text=?'} alt={m.title}
                            style={{ width: 36, height: 54, objectFit: 'cover', borderRadius: 4 }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/40x60/111827/4a5568?text=?'; }} />
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</td>
                        <td><span className="badge badge-user">{m.category}</span></td>
                        <td>{m.rating || '—'}</td>
                        <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-sm btn-accent" onClick={() => startEdit(m)}>Edit</button>
                            <button className="btn-sm btn-danger" onClick={() => handleDeleteMovie(m._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {movies.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No movies added yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add/Edit Movie Form */}
        {view === 'Add Movie' && (
          <>
            <div className="admin-header">
              <h1>{editMovie ? 'Edit Movie' : 'Add Movie'}</h1>
              <p>{editMovie ? `Editing: ${editMovie.title}` : 'Add a new movie to the platform'}</p>
            </div>
            <div className="admin-form">
              <form onSubmit={handleMovieSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Movie Title *</label>
                    <input className="form-input" placeholder="e.g. Inception" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">TMDB Movie ID</label>
                    <input className="form-input" placeholder="e.g. 27205" value={movieForm.movieId} onChange={e => setMovieForm({ ...movieForm, movieId: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Poster Image URL</label>
                  <input className="form-input" placeholder="https://image.tmdb.org/t/p/..." value={movieForm.poster} onChange={e => setMovieForm({ ...movieForm, poster: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Movie description..." value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Release Date</label>
                    <input className="form-input" type="date" value={movieForm.releaseDate} onChange={e => setMovieForm({ ...movieForm, releaseDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating (0-10)</label>
                    <input className="form-input" type="number" min="0" max="10" step="0.1" placeholder="e.g. 8.5" value={movieForm.rating} onChange={e => setMovieForm({ ...movieForm, rating: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">YouTube Trailer Link</label>
                  <input className="form-input" placeholder="https://www.youtube.com/watch?v=..." value={movieForm.trailerLink} onChange={e => setMovieForm({ ...movieForm, trailerLink: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Genres (comma separated)</label>
                    <input className="form-input" placeholder="Action, Sci-Fi, Thriller" value={movieForm.genre} onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={movieForm.category} onChange={e => setMovieForm({ ...movieForm, category: e.target.value })}>
                      <option value="movie">Movie</option>
                      <option value="tv">TV Show</option>
                      <option value="anime">Anime</option>
                      <option value="documentary">Documentary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn-full" style={{ width: 'auto', padding: '12px 32px' }} disabled={loading}>
                    {loading ? 'Saving...' : (editMovie ? 'Update Movie' : 'Add Movie')}
                  </button>
                  {editMovie && (
                    <button type="button" className="btn-secondary" style={{ padding: '12px 24px', borderRadius: 8 }}
                      onClick={() => { setEditMovie(null); setView('Movies'); setMovieForm({ title: '', poster: '', description: '', movieId: '', releaseDate: '', trailerLink: '', genre: '', category: 'movie', rating: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
