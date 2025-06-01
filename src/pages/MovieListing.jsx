import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { movies } from '../data/mockData';
import './MovieListing.css';

const MovieListing = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'];
  
  const filteredMovies = selectedGenre === 'All' 
    ? movies 
    : movies.filter(movie => movie.genre.includes(selectedGenre));

  return (
    <div className="movie-listing">
      <div className="container">
        <div className="page-header">
          <h1>Movies</h1>
          <p>Discover and book tickets for the latest movies</p>
        </div>
        
        <div className="filter-section">
          <h3>Filter by Genre:</h3>
          <div className="genre-buttons">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieListing;