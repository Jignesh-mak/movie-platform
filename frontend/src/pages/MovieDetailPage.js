import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetails, getPoster, getBackdrop, getProfile } from '../services/tmdb';
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, addToHistory } from '../store/slices/userSlice';
import TrailerModal from '../components/movie/TrailerModal';
import MovieCard from '../components/movie/MovieCard';

const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { favorites, watchlist } = useSelector(s => s.user);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  const isFav = favorites.some(f => String(f.movieId) === String(id));
  const isInWatchlist = watchlist.some(w => String(w.movieId) === String(id));

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getMovieDetails(id);
        const data = res.data;
        setMovie(data);
        const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailerKey(trailer?.key || null);
        // Track history
        if (user) {
          dispatch(addToHistory({
            movieId: String(data.id),
            title: data.title,
            poster: data.poster_path ? getPoster(data.poster_path) : '',
            mediaType: 'movie',
            rating: data.vote_average
          }));
        }
      } catch (err) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]); // eslint-disable-line

  const toggleFav = () => {
    if (!user) return;
    const item = { movieId: String(movie.id), title: movie.title, poster: getPoster(movie.poster_path), mediaType: 'movie', rating: movie.vote_average };
    if (isFav) dispatch(removeFromFavorites(String(movie.id)));
    else dispatch(addToFavorites(item));
  };

  const toggleWatchlist = () => {
    if (!user) return;
    const item = { movieId: String(movie.id), title: movie.title, poster: getPoster(movie.poster_path), mediaType: 'movie', rating: movie.vote_average };
    if (isInWatchlist) dispatch(removeFromWatchlist(String(movie.id)));
    else dispatch(addToWatchlist(item));
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div className="empty-state"><div className="empty-state-icon">⚠️</div><div className="empty-state-title">{error}</div></div>;
  if (!movie) return null;

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const year = (movie.release_date || '').slice(0, 4);
  const directors = movie.credits?.crew?.filter(c => c.job === 'Director') || [];
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = movie.similar?.results?.slice(0, 12) || [];

  return (
    <div>
      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-backdrop" style={{ backgroundImage: `url(${getBackdrop(movie.backdrop_path)})` }} />
        <div className="detail-content">
          <div className="detail-poster">
            <img src={getPoster(movie.poster_path)} alt={movie.title}
              onError={e => { e.target.src = 'https://via.placeholder.com/300x450/111827/4a5568?text=No+Poster'; }} />
          </div>
          <div className="detail-info">
            <div className="detail-genres">
              {movie.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
            </div>
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-meta">
              <span className="detail-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>({movie.vote_count?.toLocaleString()} votes)</span>
              {year && <span>📅 {year}</span>}
              {runtime && <span>⏱ {runtime}</span>}
              {directors.length > 0 && <span>🎬 {directors.map(d => d.name).join(', ')}</span>}
            </div>
            <p className="detail-overview">{movie.overview || 'Description not available.'}</p>
            <div className="detail-actions">
              <button className="btn-primary" onClick={() => setShowTrailer(true)}>▶ Watch Trailer</button>
              {user && (
                <>
                  <button className={`btn-icon ${isFav ? 'active' : ''}`} onClick={toggleFav} title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                    {isFav ? '❤️' : '🤍'}
                  </button>
                  <button className={`btn-icon ${isInWatchlist ? 'active' : ''}`} onClick={toggleWatchlist} title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
                    {isInWatchlist ? '🔖' : '📌'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        {/* Cast */}
        {cast.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">Cast</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {cast.map(actor => (
                <Link to={`/person/${actor.id}`} key={actor.cast_id || actor.id} className="person-card">
                  <div className="person-avatar">
                    <img src={getProfile(actor.profile_path)} alt={actor.name} loading="lazy"
                      onError={e => { e.target.src = 'https://via.placeholder.com/185x278/111827/4a5568?text=No+Photo'; }} />
                  </div>
                  <div className="person-name">{actor.name}</div>
                  <div className="person-role">{actor.character}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Movie Info */}
        <div className="detail-section">
          <h2 className="detail-section-title">Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Status', value: movie.status },
              { label: 'Budget', value: movie.budget ? `$${movie.budget?.toLocaleString()}` : 'N/A' },
              { label: 'Revenue', value: movie.revenue ? `$${movie.revenue?.toLocaleString()}` : 'N/A' },
              { label: 'Language', value: movie.original_language?.toUpperCase() },
              { label: 'Country', value: movie.production_countries?.[0]?.name || 'N/A' },
              { label: 'Tagline', value: movie.tagline || 'N/A' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">Similar Movies</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {similar.map(m => <MovieCard key={m.id} movie={m} mediaType="movie" />)}
            </div>
          </div>
        )}
      </div>

      {showTrailer && (
        <TrailerModal trailerKey={trailerKey} title={movie.title} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
};

export default MovieDetailPage;
