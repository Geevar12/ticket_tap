import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import { movies, events } from '../data/mockData';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  // Show first 6 for each section
  const nowShowingMovies = movies.slice(0, 6);
  const upcomingMovies = movies.slice(6, 12);
  const nearbyEvents = events.slice(0, 3);

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
              <MovieCard key={movie.id} movie={movie} />
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
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Events Near You</h2>
          <div className="carousel">
            {nearbyEvents.map(event => (
              <MovieCard key={event.id} movie={event} type="event" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;