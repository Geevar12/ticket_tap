import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]); // If you have events in backend, fetch similarly

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setMovies([]));
    // Optionally fetch events if needed
  }, []);

  // Show first 6 for each section
  const nowShowingMovies = movies.filter(m => m.upcoming !== "yes").slice(0, 6);
  const upcomingMovies = movies.filter(m => m.upcoming === "yes").slice(0, 6);

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

      {/* Events section can be restored if you fetch events */}
      {/* <section className="section">
        <div className="container">
          <h2 className="section-title">Events Near You</h2>
          <div className="carousel">
            {events.slice(0, 3).map(event => (
              <MovieCard key={event._id || event.id} movie={event} type="event" />
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;