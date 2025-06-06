import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, type = 'movie' }) => {
  const isUpcoming = movie.upcoming === "yes";
  return (
    <div className={`movie-card${isUpcoming ? ' no-hover' : ''}`}>
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        {!isUpcoming && (
          <div className="movie-overlay">
            <Link 
              to={`/${type === 'event' ? 'event' : 'movie'}/${movie._id || movie.id}`} 
              className="btn btn-primary movie-btn"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        {movie.rating && (
          <div className="movie-rating">
            <span>⭐ {movie.rating}/10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;