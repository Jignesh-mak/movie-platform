import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPoster } from '../../services/tmdb';
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } from '../../store/slices/userSlice';

const MovieCard = ({ movie, mediaType = 'movie', showActions = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { favorites, watchlist } = useSelector(s => s.user);

  const id = movie.id || movie.movieId;
  const type = movie.media_type || mediaType;
  const title = movie.title || movie.name || 'Unknown';
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = movie.vote_average?.toFixed(1) || movie.rating?.toFixed(1) || '';
  const poster = movie.poster_path ? getPoster(movie.poster_path) : movie.poster || '/placeholder.jpg';

  const isFav = favorites.some(f => String(f.movieId) === String(id));
  const isInWatchlist = watchlist.some(w => String(w.movieId) === String(id));

  const handleClick = () => {
    navigate(`/${type === 'tv' ? 'tv' : 'movie'}/${id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const item = { movieId: String(id), title, poster, mediaType: type, rating: parseFloat(rating) || 0 };
    if (isFav) dispatch(removeFromFavorites(String(id)));
    else dispatch(addToFavorites(item));
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const item = { movieId: String(id), title, poster, mediaType: type, rating: parseFloat(rating) || 0 };
    if (isInWatchlist) dispatch(removeFromWatchlist(String(id)));
    else dispatch(addToWatchlist(item));
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card-poster">
        <img
          src={poster}
          alt={title}
          loading="lazy"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x450/111827/4a5568?text=No+Poster'; }}
        />
        {rating && (
          <div className="movie-card-rating">⭐ {rating}</div>
        )}
        {type === 'tv' && <div className="movie-card-badge">TV</div>}
        <div className="movie-card-overlay">
          <div className="movie-card-play">▶</div>
        </div>
        {showActions && user && (
          <div style={{ position: 'absolute', top: 8, right: rating ? 36 : 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          </div>
        )}
      </div>
      <div className="movie-card-title">{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="movie-card-year">{year}</span>
        {showActions && (
          <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
            <button
              style={{ fontSize: 12, padding: '2px 4px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8 }}
              onClick={handleFav}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? '❤️' : '🤍'}
            </button>
            <button
              style={{ fontSize: 12, padding: '2px 4px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8 }}
              onClick={handleWatchlist}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? '🔖' : '📌'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
