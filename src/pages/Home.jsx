import React from 'react';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import { movies, events } from '../data/mockData';
import './Home.css';

const Home = () => {
  const nowShowingMovies = movies.slice(0, 4);
  const upcomingMovies = movies.slice(2, 6);
  const nearbyEvents = events.slice(0, 3);

  return (
    <div className="home">
      <HeroSection />
      
      <section className="section">
        <div className="container">
          <h2 className="section-title">Now Showing</h2>
          <div className="carousel">
            {nowShowingMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Upcoming Movies</h2>
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