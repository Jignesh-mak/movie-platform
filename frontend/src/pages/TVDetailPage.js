import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTVDetails, getPoster, getBackdrop, getProfile } from '../services/tmdb';
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, addToHistory } from '../store/slices/userSlice';
import TrailerModal from '../components/movie/TrailerModal';
import MovieCard from '../components/movie/MovieCard';

const TVDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { favorites, watchlist } = useSelector(s => s.user);

  const [show, setShow] = useState(null);
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
        const res = await getTVDetails(id);
        const data = res.data;
        setShow(data);
        const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailerKey(trailer?.key || null);
        if (user) {
          dispatch(addToHistory({
            movieId: String(data.id), title: data.name,
            poster: data.poster_path ? getPoster(data.poster_path) : '',
            mediaType: 'tv', rating: data.vote_average
          }));
        }
      } catch (err) { setError('Failed to load TV show details.'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]); // eslint-disable-line

  const toggleFav = () => {
    if (!user) return;
    const item = { movieId: String(show.id), title: show.name, poster: getPoster(show.poster_path), mediaType: 'tv', rating: show.vote_average };
    if (isFav) dispatch(removeFromFavorites(String(show.id)));
    else dispatch(addToFavorites(item));
  };

  const toggleWatchlist = () => {
    if (!user) return;
    const item = { movieId: String(show.id), title: show.name, poster: getPoster(show.poster_path), mediaType: 'tv', rating: show.vote_average };
    if (isInWatchlist) dispatch(removeFromWatchlist(String(show.id)));
    else dispatch(addToWatchlist(item));
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div className="empty-state"><div className="empty-state-icon">⚠️</div><div className="empty-state-title">{error}</div></div>;
  if (!show) return null;

  const year = (show.first_air_date || '').slice(0, 4);
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const similar = show.similar?.results?.slice(0, 12) || [];

  return (
    <div>
      <div className="detail-hero">
        <div className="detail-backdrop" style={{ backgroundImage: `url(${getBackdrop(show.backdrop_path)})` }} />
        <div className="detail-content">
          <div className="detail-poster">
            <img src={getPoster(show.poster_path)} alt={show.name}
              onError={e => { e.target.src = 'https://via.placeholder.com/300x450/111827/4a5568?text=No+Poster'; }} />
          </div>
          <div className="detail-info">
            <div className="detail-genres">
              {show.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
            </div>
            <h1 className="detail-title">{show.name}</h1>
            <div className="detail-meta">
              <span className="detail-rating">⭐ {show.vote_average?.toFixed(1)}</span>
              {year && <span>📅 {year}</span>}
              {show.number_of_seasons && <span>📺 {show.number_of_seasons} Seasons</span>}
              {show.number_of_episodes && <span>🎞 {show.number_of_episodes} Episodes</span>}
              <span style={{ background: 'var(--bg-card)', padding: '2px 10px', borderRadius: 99, fontSize: 11 }}>{show.status}</span>
            </div>
            <p className="detail-overview">{show.overview || 'Description not available.'}</p>
            <div className="detail-actions">
              <button className="btn-primary" onClick={() => setShowTrailer(true)}>▶ Watch Trailer</button>
              {user && (
                <>
                  <button className={`btn-icon ${isFav ? 'active' : ''}`} onClick={toggleFav}>{isFav ? '❤️' : '🤍'}</button>
                  <button className={`btn-icon ${isInWatchlist ? 'active' : ''}`} onClick={toggleWatchlist}>{isInWatchlist ? '🔖' : '📌'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        {cast.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">Cast</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {cast.map(actor => (
                <Link to={`/person/${actor.id}`} key={actor.id} className="person-card">
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

        {similar.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">Similar Shows</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {similar.map(m => <MovieCard key={m.id} movie={m} mediaType="tv" />)}
            </div>
          </div>
        )}
      </div>

      {showTrailer && <TrailerModal trailerKey={trailerKey} title={show.name} onClose={() => setShowTrailer(false)} />}
    </div>
  );
};

export default TVDetailPage;
