import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromFavorites, removeFromWatchlist, removeFromHistory } from '../store/slices/userSlice';

const MediaList = ({ items, onRemove, emptyIcon, emptyTitle, emptyText }) => {
  if (!items.length) return (
    <div className="empty-state">
      <div className="empty-state-icon">{emptyIcon}</div>
      <div className="empty-state-title">{emptyTitle}</div>
      <p>{emptyText}</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: 20 }}>Browse Content</Link>
    </div>
  );

  return (
    <div className="movies-grid">
      {items.map(item => (
        <div key={item.movieId} style={{ position: 'relative' }}>
          <Link to={`/${item.mediaType === 'tv' ? 'tv' : 'movie'}/${item.movieId}`}>
            <div className="movie-card" style={{ width: '100%' }}>
              <div className="movie-card-poster">
                <img
                  src={item.poster || 'https://via.placeholder.com/300x450/111827/4a5568?text=No+Poster'}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/300x450/111827/4a5568?text=No+Poster'; }}
                />
                {item.rating > 0 && <div className="movie-card-rating">⭐ {Number(item.rating).toFixed(1)}</div>}
                {item.mediaType === 'tv' && <div className="movie-card-badge">TV</div>}
              </div>
              <div className="movie-card-title">{item.title}</div>
            </div>
          </Link>
          <button
            onClick={() => onRemove(item.movieId)}
            style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'white', cursor: 'pointer', zIndex: 1 }}
          >
            ✕ Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector(s => s.user);
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">❤️ Favorites</h1>
        <p className="page-subtitle">{favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved</p>
      </div>
      <div style={{ padding: '0 5%' }}>
        <MediaList
          items={favorites}
          onRemove={id => dispatch(removeFromFavorites(id))}
          emptyIcon="💔" emptyTitle="No Favorites Yet"
          emptyText="Start adding movies and shows you love."
        />
      </div>
    </div>
  );
};

export const WatchHistoryPage = () => {
  const dispatch = useDispatch();
  const { history } = useSelector(s => s.user);
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🕐 Watch History</h1>
        <p className="page-subtitle">{history.length} title{history.length !== 1 ? 's' : ''} watched</p>
      </div>
      <div style={{ padding: '0 5%' }}>
        <MediaList
          items={history}
          onRemove={id => dispatch(removeFromHistory(id))}
          emptyIcon="📺" emptyTitle="No Watch History"
          emptyText="Movies and shows you view will appear here."
        />
      </div>
    </div>
  );
};

export const WatchlistPage = () => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector(s => s.user);
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔖 Watchlist</h1>
        <p className="page-subtitle">{watchlist.length} title{watchlist.length !== 1 ? 's' : ''} to watch</p>
      </div>
      <div style={{ padding: '0 5%' }}>
        <MediaList
          items={watchlist}
          onRemove={id => dispatch(removeFromWatchlist(id))}
          emptyIcon="📌" emptyTitle="Watchlist is Empty"
          emptyText="Save movies and shows to watch later."
        />
      </div>
    </div>
  );
};

export default FavoritesPage;
