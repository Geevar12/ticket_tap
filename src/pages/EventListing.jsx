import React from 'react';
import MovieCard from '../components/MovieCard';
import { events } from '../data/mockData';
import './EventListing.css';

const EventListing = () => {
  return (
    <div className="event-listing">
      <div className="container">
        <div className="page-header">
          <h1>Events</h1>
          <p>Discover exciting events happening near you</p>
        </div>
        
        <div className="events-grid">
          {events.map(event => (
            <MovieCard key={event.id} movie={event} type="event" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventListing;