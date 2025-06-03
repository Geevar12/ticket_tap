import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

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
              </div>
              <p className="movie-genre-large">{movie.genre}</p>
              <p className="movie-description">{movie.description}</p>
              
              <div className="movie-cast">
                <h3>Cast</h3>
                <p>{movie.cast}</p>
              </div>
              
              <Link 
                to={`/booking/movie/${movie._id || movie.id}`} 
                className="btn btn-primary book-now-btn"
              >
                Book Tickets - ₹{movie.price}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="showtimes-section">
        <div className="container">
          <h2>Show Times</h2>
          <div className="showtimes-grid">
            {(movie.showtimes || []).map((time, index) => (
              <Link 
                key={index}
                to={`/booking/movie/${movie._id || movie.id}`}
                className="showtime-btn"
              >
                {time}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;