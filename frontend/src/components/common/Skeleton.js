import React from 'react';

export const SkeletonCard = () => (
  <div className="movie-card">
    <div className="movie-card-poster">
      <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
    </div>
    <div className="skeleton" style={{ height: 12, marginBottom: 6, borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 10, width: '60%', borderRadius: 4 }} />
  </div>
);

export const SkeletonRow = ({ count = 6 }) => (
  <div className="scroll-row">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="movies-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
