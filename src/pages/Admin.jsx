import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { movies as initialMovies, events as initialEvents } from '../data/mockData';
import './Admin.css';

const emptyMovie = {
  title: '',
  year: 2025,
  poster: '',
  genre: '',
  rating: '',
  duration: '',
  language: '',
  description: '',
  cast: '',
  price: '',
  seatPrices: [{ type: 'Regular', price: '' }, { type: 'Premium', price: '' }, { type: 'VIP', price: '' }],
  showtimes: ''
};

const emptyEvent = {
  title: '',
  poster: '',
  genre: '',
  date: '',
  venue: '',
  description: '',
  price: '',
  showtimes: ''
};

const Admin = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [section, setSection] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  // Keep events from mockData or implement similar fetch if needed
  // const [events, setEvents] = useState(initialEvents.map(e => ({ ...e })));
  const [events, setEvents] = useState([]);

  // Fetch movies from backend on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setMovies([]));
  }, []);

  // Movie form state
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState(emptyMovie);

  // Event form state
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState(emptyEvent);

  const handleAdminLogout = () => setShowConfirm(true);

  const confirmLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('isAdmin');
    navigate('/login', { replace: true });
  };

  // --- MOVIE CRUD ---
  const handleMovieInput = e => {
    const { name, value } = e.target;
    setMovieForm({ ...movieForm, [name]: value });
  };

  const handleSeatPriceChange = (idx, field, value) => {
    const updated = movieForm.seatPrices.map((sp, i) =>
      i === idx ? { ...sp, [field]: value } : sp
    );
    setMovieForm({ ...movieForm, seatPrices: updated });
  };

  const addSeatType = () => {
    setMovieForm({
      ...movieForm,
      seatPrices: [...movieForm.seatPrices, { type: '', price: '' }]
    });
  };

  const removeSeatType = idx => {
    setMovieForm({
      ...movieForm,
      seatPrices: movieForm.seatPrices.filter((_, i) => i !== idx)
    });
  };

  const startAddMovie = () => {
    setEditingMovie(null);
    setMovieForm(emptyMovie);
  };

  const startEditMovie = movie => {
    setEditingMovie(movie.id);
    setMovieForm({
      ...movie,
      showtimes: Array.isArray(movie.showtimes) ? movie.showtimes.join(', ') : movie.showtimes,
      seatPrices: movie.seatPrices
        ? movie.seatPrices.map(sp => ({ ...sp }))
        : [
            { type: 'Regular', price: movie.price || '' },
            { type: 'Premium', price: movie.price ? movie.price + 50 : '' },
            { type: 'VIP', price: movie.price ? movie.price + 100 : '' }
          ]
    });
  };

  const saveMovie = e => {
    e.preventDefault();
    const movieData = {
      ...movieForm,
      id: editingMovie ? editingMovie : Date.now(),
      year: Number(movieForm.year) || 2025,
      rating: Number(movieForm.rating) || '',
      price: Number(movieForm.price) || '',
      seatPrices: movieForm.seatPrices.map(sp => ({
        type: sp.type,
        price: Number(sp.price) || ''
      })),
      showtimes: movieForm.showtimes.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (editingMovie) {
      setMovies(movies.map(m => (m.id === editingMovie ? movieData : m)));
    } else {
      setMovies([...movies, movieData]);
    }
    setEditingMovie(null);
    setMovieForm(emptyMovie);
  };

  const deleteMovie = async id => {
    // Find the movie in state to get its _id (MongoDB id)
    const movie = movies.find(m => m.id === id || m._id === id);
    const mongoId = movie && (movie._id || movie.id);
    if (!mongoId) return;

    try {
      const res = await fetch(`http://localhost:3001/api/movies/${mongoId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMovies(movies.filter(m => (m._id || m.id) !== mongoId));
        if (editingMovie === id) {
          setEditingMovie(null);
          setMovieForm(emptyMovie);
        }
      } else {
        // Optionally handle error
        alert('Failed to delete movie from database.');
      }
    } catch {
      alert('Failed to delete movie from database.');
    }
  };

  // --- EVENT CRUD ---
  const handleEventInput = e => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const startAddEvent = () => {
    setEditingEvent(null);
    setEventForm(emptyEvent);
  };

  const startEditEvent = event => {
    setEditingEvent(event.id);
    setEventForm({
      ...event,
      showtimes: Array.isArray(event.showtimes) ? event.showtimes.join(', ') : event.showtimes
    });
  };

  const saveEvent = e => {
    e.preventDefault();
    const eventData = {
      ...eventForm,
      id: editingEvent ? editingEvent : Date.now(),
      price: Number(eventForm.price) || '',
      showtimes: eventForm.showtimes.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (editingEvent) {
      setEvents(events.map(ev => (ev.id === editingEvent ? eventData : ev)));
    } else {
      setEvents([...events, eventData]);
    }
    setEditingEvent(null);
    setEventForm(emptyEvent);
  };

  const deleteEvent = id => {
    setEvents(events.filter(e => e.id !== id));
    if (editingEvent === id) {
      setEditingEvent(null);
      setEventForm(emptyEvent);
    }
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>TicketTap</span>
        </div>
        <nav className="admin-nav">
          <button
            className={section === 'dashboard' ? 'active' : ''}
            onClick={() => setSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={section === 'movies' ? 'active' : ''}
            onClick={() => setSection('movies')}
          >
            Movies
          </button>
          <button
            className={section === 'events' ? 'active' : ''}
            onClick={() => setSection('events')}
          >
            Events
          </button>
          <button
            className="admin-logout-btn"
            onClick={handleAdminLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <h1>
            {section === 'dashboard' && 'Admin Dashboard'}
            {section === 'movies' && 'Manage Movies'}
            {section === 'events' && 'Manage Events'}
          </h1>
        </header>
        <div className="admin-content">
          {section === 'dashboard' && (
            <>
              <div className="admin-stats-row">
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Total Movies</span>
                  <span className="admin-stat-value">{movies.length}</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Total Events</span>
                  <span className="admin-stat-value">{events.length}</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Potential Revenue</span>
                  <span className="admin-stat-value">
                    ₹{movies.reduce((sum, m) => sum + (m.price || 0), 0) + events.reduce((sum, e) => sum + (e.price || 0), 0)}
                  </span>
                </div>
              </div>
              <div className="admin-section-title">Quick Glance</div>
              <div className="admin-glance-row">
                <div className="admin-glance-block">
                  <div className="admin-glance-title">Top Movies</div>
                  <ul>
                    {movies.slice(0, 3).map(m => (
                      <li key={m.id}>{m.title} <span className="admin-glance-badge">₹{m.price}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="admin-glance-block">
                  <div className="admin-glance-title">Upcoming Events</div>
                  <ul>
                    {events.slice(0, 3).map(e => (
                      <li key={e.id}>{e.title} <span className="admin-glance-badge">₹{e.price}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {section === 'movies' && (
            <>
              <div className="admin-section-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>All Movies</span>
                <button className="btn btn-primary" onClick={startAddMovie} style={{fontSize:'0.95rem'}}>Add Movie</button>
              </div>
              {(editingMovie !== null || movieForm.title) && (
                <form className="admin-edit-form" onSubmit={saveMovie}>
                  <div className="admin-form-row">
                    <input name="title" value={movieForm.title} onChange={handleMovieInput} placeholder="Title" required />
                    <input name="year" value={movieForm.year} onChange={handleMovieInput} placeholder="Year" type="number" min="1900" max="2100" />
                    <input name="genre" value={movieForm.genre} onChange={handleMovieInput} placeholder="Genre" />
                    <input name="rating" value={movieForm.rating} onChange={handleMovieInput} placeholder="Rating" type="number" step="0.1" />
                  </div>
                  <div className="admin-form-row">
                    <input name="duration" value={movieForm.duration} onChange={handleMovieInput} placeholder="Duration" />
                    <input name="language" value={movieForm.language} onChange={handleMovieInput} placeholder="Language" />
                    <input name="price" value={movieForm.price} onChange={handleMovieInput} placeholder="Default Price" type="number" />
                    <input name="poster" value={movieForm.poster} onChange={handleMovieInput} placeholder="Poster URL" />
                  </div>
                  <div className="admin-form-row">
                    <input name="cast" value={movieForm.cast} onChange={handleMovieInput} placeholder="Cast" />
                    <input name="showtimes" value={movieForm.showtimes} onChange={handleMovieInput} placeholder="Showtimes (comma separated)" />
                  </div>
                  <div className="admin-form-row" style={{flexDirection:'column',alignItems:'flex-start'}}>
                    <label style={{fontWeight:600,marginBottom:4}}>Seat Types & Prices:</label>
                    {movieForm.seatPrices.map((sp, idx) => (
                      <div key={idx} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                        <input
                          style={{width:120}}
                          value={sp.type}
                          onChange={e => handleSeatPriceChange(idx, 'type', e.target.value)}
                          placeholder="Type (e.g. Regular)"
                          required
                        />
                        <input
                          style={{width:100}}
                          type="number"
                          value={sp.price}
                          onChange={e => handleSeatPriceChange(idx, 'price', e.target.value)}
                          placeholder="Price"
                          required
                        />
                        {movieForm.seatPrices.length > 1 && (
                          <button type="button" className="btn btn-secondary" style={{padding:'4px 10px'}} onClick={() => removeSeatType(idx)}>Remove</button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" style={{fontSize:'0.9rem',marginTop:4}} onClick={addSeatType}>Add Seat Type</button>
                  </div>
                  <div className="admin-form-row">
                    <textarea name="description" value={movieForm.description} onChange={handleMovieInput} placeholder="Description" rows={2} />
                  </div>
                  <div className="admin-form-row" style={{justifyContent:'flex-end'}}>
                    <button className="btn btn-primary" type="submit" style={{marginRight:8}}>
                      {editingMovie ? 'Update' : 'Add'}
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={() => { setEditingMovie(null); setMovieForm(emptyMovie); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <div className="admin-list-grid">
                {movies.map(movie => (
                  <div className="admin-list-card" key={movie.id}>
                    <img src={movie.poster} alt={movie.title} className="admin-list-img" />
                    <div className="admin-list-info">
                      <h3>{movie.title}</h3>
                      <p>{movie.genre} | {movie.year}</p>
                      <span className="admin-badge">Default: ₹{movie.price}</span>
                      <div style={{margin:'6px 0'}}>
                        {movie.seatPrices && movie.seatPrices.map((sp, i) => (
                          <span key={i} style={{marginRight:8,fontSize:'0.95em',background:'#ececec',color:'#23272f',borderRadius:6,padding:'2px 8px'}}>
                            {sp.type}: ₹{sp.price}
                          </span>
                        ))}
                      </div>
                      <div style={{margin:'6px 0'}}>
                        <span style={{fontWeight:600}}>Showtimes:</span> {Array.isArray(movie.showtimes) ? movie.showtimes.join(', ') : movie.showtimes}
                      </div>
                      <div style={{marginTop:8}}>
                        <button className="btn btn-secondary" style={{fontSize:'0.85rem',marginRight:8}} onClick={() => startEditMovie(movie)}>Edit</button>
                        <button className="btn btn-primary" style={{fontSize:'0.85rem',background:'#e74c3c'}} onClick={() => deleteMovie(movie.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {section === 'events' && (
            <>
              <div className="admin-section-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>All Events</span>
                <button className="btn btn-primary" onClick={startAddEvent} style={{fontSize:'0.95rem'}}>Add Event</button>
              </div>
              {(editingEvent !== null || eventForm.title) && (
                <form className="admin-edit-form" onSubmit={saveEvent}>
                  <div className="admin-form-row">
                    <input name="title" value={eventForm.title} onChange={handleEventInput} placeholder="Title" required />
                    <input name="date" value={eventForm.date} onChange={handleEventInput} placeholder="Date" />
                    <input name="venue" value={eventForm.venue} onChange={handleEventInput} placeholder="Venue" />
                    <input name="genre" value={eventForm.genre} onChange={handleEventInput} placeholder="Genre" />
                  </div>
                  <div className="admin-form-row">
                    <input name="price" value={eventForm.price} onChange={handleEventInput} placeholder="Price" type="number" />
                    <input name="poster" value={eventForm.poster} onChange={handleEventInput} placeholder="Poster URL" />
                    <input name="showtimes" value={eventForm.showtimes} onChange={handleEventInput} placeholder="Showtimes (comma separated)" />
                  </div>
                  <div className="admin-form-row">
                    <textarea name="description" value={eventForm.description} onChange={handleEventInput} placeholder="Description" rows={2} />
                  </div>
                  <div className="admin-form-row" style={{justifyContent:'flex-end'}}>
                    <button className="btn btn-primary" type="submit" style={{marginRight:8}}>
                      {editingEvent ? 'Update' : 'Add'}
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={() => { setEditingEvent(null); setEventForm(emptyEvent); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <div className="admin-list-grid">
                {events.map(event => (
                  <div className="admin-list-card" key={event.id}>
                    <img src={event.poster} alt={event.title} className="admin-list-img" />
                    <div className="admin-list-info">
                      <h3>{event.title}</h3>
                      <p>{event.genre} | {event.date}</p>
                      <span className="admin-badge">₹{event.price}</span>
                      <div style={{marginTop:8}}>
                        <button className="btn btn-secondary" style={{fontSize:'0.85rem',marginRight:8}} onClick={() => startEditEvent(event)}>Edit</button>
                        <button className="btn btn-primary" style={{fontSize:'0.85rem',background:'#e74c3c'}} onClick={() => deleteEvent(event.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <footer className="admin-footer">
          <p>&copy; 2024 TicketTap Admin Panel</p>
        </footer>
      </div>
      {showConfirm && (
        <div className="admin-logout-confirm">
          <div className="admin-logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout as admin?</p>
            <button
              className="btn btn-primary"
              onClick={confirmLogout}
              style={{ marginRight: 12 }}
            >
              Yes, Logout
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
