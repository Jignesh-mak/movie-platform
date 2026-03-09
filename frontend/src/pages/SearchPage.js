import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchMulti, getPoster, getProfile } from '../services/tmdb';
import MovieCard from '../components/movie/MovieCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import useDebounce from '../hooks/useDebounce';

const FILTERS = ['all', 'movie', 'tv', 'person'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setSearchParams({ q: debouncedQuery });
    const search = async () => {
      setLoading(true);
      try {
        const res = await searchMulti(debouncedQuery, 1);
        setResults(res.data.results || []);
        setHasMore(res.data.page < res.data.total_pages);
        setPage(1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    search();
  }, [debouncedQuery, filter]); // eslint-disable-line

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await searchMulti(debouncedQuery, nextPage);
      setResults(prev => [...prev, ...(res.data.results || [])]);
      setHasMore(nextPage < res.data.total_pages);
      setPage(nextPage);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? results : results.filter(r => r.media_type === filter);

  return (
    <div className="search-page">
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: 8 }}>Search</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>
        Find movies, TV shows, and actors
      </p>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search for movies, shows, people..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}
            onClick={() => { setQuery(''); setResults([]); }}
          >
            ✕
          </button>
        )}
      </div>

      <div className="search-filters">
        {FILTERS.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : f === 'tv' ? 'TV Shows' : 'People'}
          </button>
        ))}
      </div>

      {loading && results.length === 0 && <SkeletonGrid count={12} />}

      {!loading && results.length === 0 && debouncedQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <div className="empty-state-title">No results found</div>
          <p>Try searching for something else</p>
        </div>
      )}

      {!debouncedQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <div className="empty-state-title">Start Searching</div>
          <p>Type a movie, show, or person's name above</p>
        </div>
      )}

      <div className="movies-grid">
        {filtered.map((item, i) => {
          if (item.media_type === 'person') {
            return (
              <Link to={`/person/${item.id}`} key={item.id} className="person-card" style={{ width: '100%' }}>
                <div className="person-avatar" style={{ width: '80%', paddingBottom: '80%', height: 0, borderRadius: 'var(--radius)', position: 'relative', margin: '0 auto 8px' }}>
                  <img
                    src={getProfile(item.profile_path)}
                    alt={item.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/185x278/111827/4a5568?text=No+Photo'; }}
                  />
                </div>
                <div className="person-name">{item.name}</div>
                <div className="person-role">{item.known_for_department}</div>
              </Link>
            );
          }
          return <MovieCard key={`${item.id}-${i}`} movie={item} mediaType={item.media_type || 'movie'} />;
        })}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <button className="btn-secondary" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
