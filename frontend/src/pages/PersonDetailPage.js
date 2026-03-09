import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonDetails, getProfile, getPoster } from '../services/tmdb';
import MovieCard from '../components/movie/MovieCard';

const PersonDetailPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPersonDetails(id).then(res => setPerson(res.data)).catch(console.error).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!person) return <div className="empty-state"><div className="empty-state-title">Person not found</div></div>;

  const movieCredits = person.movie_credits?.cast?.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 20) || [];
  const tvCredits = person.tv_credits?.cast?.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 12) || [];
  const age = person.birthday ? Math.floor((new Date() - new Date(person.birthday)) / (365.25 * 24 * 3600 * 1000)) : null;

  return (
    <div>
      <div className="detail-hero" style={{ height: '50vh' }}>
        <div className="detail-backdrop" style={{ background: 'linear-gradient(135deg, #111827 0%, #1a2235 100%)' }} />
        <div className="detail-content" style={{ alignItems: 'center' }}>
          <div className="detail-poster" style={{ width: 160, aspectRatio: '1/1', borderRadius: '50%', border: '4px solid var(--accent)' }}>
            <img src={getProfile(person.profile_path, 'w300')} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              onError={e => { e.target.src = 'https://via.placeholder.com/300x300/111827/4a5568?text=No+Photo'; }} />
          </div>
          <div className="detail-info">
            <h1 className="detail-title">{person.name}</h1>
            <div className="detail-meta">
              <span>🎭 {person.known_for_department}</span>
              {person.birthday && <span>🎂 {person.birthday}{age ? ` (${age} years)` : ''}</span>}
              {person.place_of_birth && <span>📍 {person.place_of_birth}</span>}
            </div>
            {person.biography && (
              <p className="detail-overview" style={{ maxHeight: 120, overflow: 'hidden' }}>
                {person.biography}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">
        {movieCredits.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">Movies</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {movieCredits.map(m => <MovieCard key={m.id} movie={m} mediaType="movie" />)}
            </div>
          </div>
        )}
        {tvCredits.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title">TV Shows</h2>
            <div className="scroll-row" style={{ padding: 0 }}>
              {tvCredits.map(m => <MovieCard key={m.id} movie={m} mediaType="tv" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetailPage;
