import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies`)
      .then(res => res.json())
      .then(data => {
        // Try to match by _id or id
        const found = data.find(
          m => m._id === id || m.id?.toString() === id
        );
        setMovie(found || null);
      })
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) {
    return <div className="container">Movie not found</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-hero">
        <div className="container">
          <div className="movie-hero-content">
            <div className="movie-poster-large">
              <img src={movie.poster} alt={movie.title} />
            </div>
            
            <div className="movie-info-large">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="rating">⭐ {movie.rating}/10</span>
                <span className="duration">{movie.duration}</span>
                <span className="language">{movie.language}</span>
                {movie.releaseDate && (
                  <span className="release-date">Release: {movie.releaseDate}</span>
                )}
                {movie.director && (
                  <span className="director">Director: {movie.director}</span>
                )}
              </div>
              <p className="movie-genre-large">{movie.genre}</p>
              <p className="movie-description">{movie.description}</p>
              
              <div className="movie-cast">
                <h3>Cast</h3>
                <p>{movie.cast}</p>
              </div>
              
              <button
                className="btn btn-primary book-now-btn"
                onClick={e => {
                  e.preventDefault();
                  setShowDateModal(true);
                }}
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Date selection modal */}
      {showDateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Date</h3>
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{marginBottom: 16, padding: 8, fontSize: 16, width: '100%'}}
            >
              <option value="">-- Select a date --</option>
              {(() => {
                // Find next Tuesday from today
                const today = new Date();
                const dayOfWeek = today.getDay();
                const daysUntilTuesday = (9 - dayOfWeek) % 7 || 7;
                const nextTuesday = new Date(today);
                nextTuesday.setDate(today.getDate() + daysUntilTuesday);
                const dateStr = nextTuesday.toISOString().split('T')[0];
                return (
                  <option key={dateStr} value={dateStr}>
                    {nextTuesday.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </option>
                );
              })()}
            </select>
            <div>
              <button
                className="btn btn-primary"
                disabled={!selectedDate}
                onClick={() => {
                  setShowDateModal(false);
                  navigate(`/booking/movie/${movie._id || movie.id}`, { state: { selectedDate } });
                }}
                style={{marginRight: 12}}
              >
                Proceed
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;