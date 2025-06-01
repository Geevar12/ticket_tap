import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { events } from '../data/mockData';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === parseInt(id));

  if (!event) {
    return <div className="container">Event not found</div>;
  }

  return (
    <div className="event-detail">
      <div className="event-hero">
        <div className="container">
          <div className="event-hero-content">
            <div className="event-poster-large">
              <img src={event.poster} alt={event.title} />
            </div>
            
            <div className="event-info-large">
              <h1>{event.title}</h1>
              <div className="event-meta">
                <span className="date">📅 {event.date}</span>
                <span className="venue">📍 {event.venue}</span>
              </div>
              <p className="event-genre-large">{event.genre}</p>
              <p className="event-description">{event.description}</p>
              
              <Link 
                to={`/booking/event/${event.id}`} 
                className="btn btn-primary book-now-btn"
              >
                Book Tickets - ₹{event.price}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="showtimes-section">
        <div className="container">
          <h2>Available Times</h2>
          <div className="showtimes-grid">
            {event.showtimes.map((time, index) => (
              <Link 
                key={index}
                to={`/booking/event/${event.id}`}
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

export default EventDetail;