import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getPopularTV, getTopRatedTV, getAiringTodayTV, getTVGenres, discoverTV } from '../services/tmdb';
import MovieCard from '../components/movie/MovieCard';
import { SkeletonGrid } from '../components/common/Skeleton';

const CATEGORIES = [
  { label: 'Popular', fn: getPopularTV },
  { label: 'Top Rated', fn: getTopRatedTV },
  { label: 'Airing Today', fn: getAiringTodayTV },
];

const TVShowsPage = () => {
  const [category, setCategory] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    getTVGenres().then(res => setGenres(res.data.genres)).catch(() => {});
  }, []);

  const fetchShows = useCallback(async (pg, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      let res;
      if (selectedGenre) {
        res = await discoverTV({ page: pg, with_genres: selectedGenre });
      } else {
        res = await CATEGORIES[category].fn(pg);
      }
      const results = res.data.results || [];
      setShows(prev => reset ? results : [...prev, ...results]);
      setHasMore(pg < res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [category, selectedGenre, loading]);

  useEffect(() => {
    setShows([]); setPage(1); setHasMore(true); setInitialLoad(true);
    fetchShows(1, true);
  }, [category, selectedGenre]); // eslint-disable-line

  useEffect(() => {
    if (page === 1) return;
    fetchShows(page);
  }, [page]); // eslint-disable-line

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) setPage(prev => prev + 1);
    });
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">TV Shows</h1>
        <p className="page-subtitle">Stream the best television from around the world</p>
      </div>

      <div style={{ padding: '0 5%', marginBottom: 24 }}>
        <div className="search-filters" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
          {CATEGORIES.map((cat, i) => (
            <button key={cat.label} className={`filter-btn ${category === i && !selectedGenre ? 'active' : ''}`}
              onClick={() => { setCategory(i); setSelectedGenre(null); }}>
              {cat.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {genres.map(g => (
            <button key={g.id}
              className={`filter-btn ${selectedGenre === g.id ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '6px 14px' }}
              onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}>
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {initialLoad ? <SkeletonGrid count={20} /> : (
        <div className="movies-grid">
          {shows.map((show, i) => <MovieCard key={`${show.id}-${i}`} movie={show} mediaType="tv" />)}
        </div>
      )}

      <div ref={loaderRef} style={{ padding: 40, textAlign: 'center' }}>
        {loading && !initialLoad && <div className="spinner" style={{ margin: '0 auto' }} />}
        {!hasMore && shows.length > 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>You've reached the end</p>}
      </div>
    </div>
  );
};

export default TVShowsPage;
