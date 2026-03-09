import React, { useEffect } from 'react';

const TrailerModal = ({ trailerKey, title, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">🎬 {title} — Trailer</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {trailerKey ? (
          <div className="modal-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="trailer-unavailable">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎭</div>
            <div>Trailer for this movie is currently unavailable.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
