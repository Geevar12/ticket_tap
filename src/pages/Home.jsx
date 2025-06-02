import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setMovies([]));
  }, []);

  // Show first 6 for each section
  const nowShowingMovies = movies.slice(0, 6);
  const upcomingMovies = movies.slice(6, 12);

  return (
    <div className="home">
      <HeroSection />

      <section className="section">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Now Showing</h2>
            <button
              className="btn btn-secondary section-viewall-btn"
              onClick={() => navigate('/movies?tab=now-showing')}
            >
              View All
            </button>
          </div>
          <div className="carousel">
            {nowShowingMovies.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Upcoming Movies</h2>
            <button
              className="btn btn-secondary section-viewall-btn"
              onClick={() => navigate('/movies?tab=upcoming')}
            >
              View All
            </button>
          </div>
          <div className="carousel">
            {upcomingMovies.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;