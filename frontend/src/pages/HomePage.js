import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getTrending, getPopularMovies, getPopularTV, getPopularPeople,
  getMovieDetails, getPoster, getBackdrop, getProfile
} from '../services/tmdb';
import MovieCard from '../components/movie/MovieCard';
import TrailerModal from '../components/movie/TrailerModal';
import { SkeletonRow } from '../components/common/Skeleton';

const HomePage = () => {
  const [heroes, setHeroes] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerTitle, setTrailerTitle] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendRes, movRes, tvRes, peopleRes] = await Promise.all([
          getTrending('all', 'week'),
          getPopularMovies(),
          getPopularTV(),
          getPopularPeople()
        ]);
        const heroItems = trendRes.data.results.filter(i => i.backdrop_path).slice(0, 5);
        setHeroes(heroItems);
        setTrending(trendRes.data.results);
        setPopularMovies(movRes.data.results);
        setPopularTV(tvRes.data.results);
        setPeople(peopleRes.data.results);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Auto-advance hero
  useEffect(() => {
    if (heroes.length === 0) return;
    const t = setTimeout(() => setHeroIndex(i => (i + 1) % heroes.length), 6000);
    return () => clearTimeout(t);
  }, [heroIndex, heroes.length]);

  const hero = heroes[heroIndex];

  const openTrailer = async (movie) => {
    setTrailerTitle(movie.title || movie.name);
    try {
      const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
      const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${BACKEND}/tmdb/${mediaType}/${movie.id}/videos`);
      const data = await res.json();
      const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailerKey(trailer?.key || null);
    } catch {
      setTrailerKey(null);
    }
  };

  return (
    <div>
      {/* ── Hero ── */}
      {hero ? (
        <div className="hero">
          <div
            className="hero-backdrop"
            style={{ backgroundImage: `url(${getBackdrop(hero.backdrop_path)})` }}
          />
          <div className="hero-content">
            <div className="hero-badge">
              🔥 {hero.media_type === 'tv' ? 'TV Show' : 'Movie'} of the Week
            </div>
            <h1 className="hero-title">{hero.title || hero.name}</h1>
            <div className="hero-meta">
              <span className="hero-rating">⭐ {hero.vote_average?.toFixed(1)}</span>
              <span>{(hero.release_date || hero.first_air_date || '').slice(0, 4)}</span>
              <span style={{ background: 'var(--bg-card)', padding: '2px 10px', borderRadius: 99, fontSize: 11 }}>
                {hero.media_type === 'tv' ? 'TV' : 'MOVIE'}
              </span>
            </div>
            <p className="hero-description">{hero.overview || 'No description available.'}</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => openTrailer(hero)}>
                ▶ Watch Trailer
              </button>
              <Link
                to={`/${hero.media_type === 'tv' ? 'tv' : 'movie'}/${hero.id}`}
                className="btn-secondary"
              >
                ℹ️ More Info
              </Link>
            </div>
          </div>
          <div className="hero-dots">
            {heroes.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ height: '90vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      )}

      {/* ── Trending ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Trending This Week</h2>
          <Link to="/movies" className="section-link">See All →</Link>
        </div>
        {loading ? <SkeletonRow count={8} /> : (
          <div className="scroll-row">
            {trending.slice(0, 20).map(item => (
              <MovieCard key={item.id} movie={item} mediaType={item.media_type || 'movie'} />
            ))}
          </div>
        )}
      </section>

      {/* ── Popular Movies ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Movies</h2>
          <Link to="/movies" className="section-link">See All →</Link>
        </div>
        {loading ? <SkeletonRow count={8} /> : (
          <div className="scroll-row">
            {popularMovies.slice(0, 20).map(item => (
              <MovieCard key={item.id} movie={item} mediaType="movie" />
            ))}
          </div>
        )}
      </section>

      {/* ── Popular TV ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular TV Shows</h2>
          <Link to="/tv" className="section-link">See All →</Link>
        </div>
        {loading ? <SkeletonRow count={8} /> : (
          <div className="scroll-row">
            {popularTV.slice(0, 20).map(item => (
              <MovieCard key={item.id} movie={item} mediaType="tv" />
            ))}
          </div>
        )}
      </section>

      {/* ── People ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular People</h2>
          <Link to="/people" className="section-link">See All →</Link>
        </div>
        <div className="scroll-row">
          {people.slice(0, 20).map(person => (
            <Link to={`/person/${person.id}`} key={person.id} className="person-card">
              <div className="person-avatar">
                <img
                  src={getProfile(person.profile_path)}
                  alt={person.name}
                  loading="lazy"
                  onError={e => { e.target.src = 'https://via.placeholder.com/185x278/111827/4a5568?text=No+Photo'; }}
                />
              </div>
              <div className="person-name">{person.name}</div>
              <div className="person-role">{person.known_for_department}</div>
            </Link>
          ))}
        </div>
      </section>

      {trailerKey !== undefined && trailerTitle && (
        <TrailerModal
          trailerKey={trailerKey}
          title={trailerTitle}
          onClose={() => { setTrailerKey(undefined); setTrailerTitle(''); }}
        />
      )}
    </div>
  );
};

export default HomePage;
