import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { movies } from '../data/mockData';
import './MovieListing.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MovieListing = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [tab, setTab] = useState('now-showing');
  const location = useLocation();
  const query = useQuery();

  useEffect(() => {
    const tabParam = query.get('tab');
    if (tabParam === 'upcoming') setTab('upcoming');
    else setTab('now-showing');
  }, [location.search]);

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance'];

  // Demo: first 6 are now showing, rest are upcoming
  const nowShowingMovies = movies.slice(0, 6);
  const upcomingMovies = movies.slice(6);

  let filteredMovies = tab === 'now-showing' ? nowShowingMovies : upcomingMovies;
  filteredMovies = selectedGenre === 'All'
    ? filteredMovies
    : filteredMovies.filter(movie => movie.genre.includes(selectedGenre));

  return (
    <div className="movie-listing">
      <div className="container">
        <div className="page-header">
          <h1>Movies</h1>
          <p>Discover and book tickets for the latest movies</p>
        </div>

        <div className="movie-tabs">
          <button
            className={`movie-tab-btn ${tab === 'now-showing' ? 'active' : ''}`}
            onClick={() => setTab('now-showing')}
          >
            Now Showing
          </button>
          <button
            className={`movie-tab-btn ${tab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setTab('upcoming')}
          >
            Upcoming Movies
          </button>
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