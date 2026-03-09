import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPopularPeople, getProfile } from '../services/tmdb';

const PeoplePage = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  const fetchPeople = async (pg) => {
    setLoading(true);
    try {
      const res = await getPopularPeople(pg);
      setPeople(prev => pg === 1 ? res.data.results : [...prev, ...res.data.results]);
      setHasMore(pg < res.data.total_pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPeople(1); }, []);
  useEffect(() => { if (page > 1) fetchPeople(page); }, [page]);

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
        <h1 className="page-title">People</h1>
        <p className="page-subtitle">Actors, directors & creators</p>
      </div>
      <div style={{ padding: '0 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 24 }}>
        {people.map(person => (
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
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              {person.known_for?.slice(0, 1).map(k => k.title || k.name).join(', ')}
            </div>
          </Link>
        ))}
      </div>
      <div ref={loaderRef} style={{ padding: 40, textAlign: 'center' }}>
        {loading && <div className="spinner" style={{ margin: '0 auto' }} />}
      </div>
    </div>
  );
};

export default PeoplePage;
