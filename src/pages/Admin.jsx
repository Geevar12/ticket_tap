import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Admin = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [section, setSection] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [bookings, setBookings] = useState([]);

  // Fetch movies and bookings from backend on mount and after changes
  const fetchMovies = () => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setMovies([]));
  };
  const fetchBookings = () => {
    fetch('http://localhost:3001/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(() => setBookings([]));
  };

  useEffect(() => {
    fetchMovies();
    fetchBookings();
  }, []);

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
    setEditingMovie(movie._id || movie.id); // Use _id if present
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

  // Add or update movie in MongoDB
  const saveMovie = async e => {
    e.preventDefault();
    const movieData = {
      ...movieForm,
      year: Number(movieForm.year) || 2025,
      rating: Number(movieForm.rating) || '',
      price: Number(movieForm.price) || '',
      seatPrices: movieForm.seatPrices.map(sp => ({
        type: sp.type,
        price: Number(sp.price) || ''
      })),
      showtimes: movieForm.showtimes.split(',').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingMovie) {
        // Remove _id from payload to avoid immutable field error in MongoDB
        const { _id, id, ...rest } = movieData;
        const res = await fetch(`http://localhost:3001/api/movies/${editingMovie}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest)
        });
        if (!res.ok) throw new Error('Failed to update movie');
      } else {
        // Add new movie
        const res = await fetch('http://localhost:3001/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData)
        });
        if (!res.ok) throw new Error('Failed to add movie');
      }
      setEditingMovie(null);
      setMovieForm(emptyMovie);
      fetchMovies();
    } catch {
      alert('Failed to save movie to database.');
    }
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
        if (editingMovie === mongoId) {
          setEditingMovie(null);
          setMovieForm(emptyMovie);
        }
        fetchMovies();
      } else {
        alert('Failed to delete movie from database.');
      }
    } catch {
      alert('Failed to delete movie from database.');
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
                  <span className="admin-stat-label">Total Bookings</span>
                  <span className="admin-stat-value">{bookings.length}</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Potential Revenue</span>
                  <span className="admin-stat-value">
                    ₹{movies.reduce((sum, m) => sum + (m.price || 0), 0)}
                  </span>
                </div>
              </div>
              <div className="admin-section-title">Recent Bookings</div>
              <div className="admin-glance-row">
                <div className="admin-glance-block" style={{flex: 1}}>
                  <div className="admin-glance-title">Latest Bookings</div>
                  <ul>
                    {bookings.slice(-5).reverse().map((b, i) => (
                      <li key={i}>
                        <span style={{fontWeight:600}}>{b.movieName}</span> - {b.selectedDate} - {b.selectedSeats.join(', ')} - ₹{b.totalPrice}
                      </li>
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
                  <div className="admin-list-card" key={movie._id || movie.id}>
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
                      {/* Show booked and available seats */}
                      <div style={{margin:'6px 0', fontSize:'0.95em'}}>
                        <span style={{fontWeight:600, color:'#e74c3c'}}>Booked Seats:</span>
                        <span style={{marginLeft:4}}>
                          {Array.isArray(movie.bookedSeats) && movie.bookedSeats.length > 0
                            ? movie.bookedSeats.join(', ')
                            : <span style={{color:'#888'}}>None</span>}
                        </span>
                      </div>
                      <div style={{margin:'6px 0', fontSize:'0.95em'}}>
                        <span style={{fontWeight:600, color:'#2d7a2d'}}>Available Seats:</span>
                        <span style={{marginLeft:4}}>
                          {Array.isArray(movie.availableSeats) && movie.availableSeats.length > 0
                            ? movie.availableSeats.join(', ')
                            : <span style={{color:'#888'}}>None</span>}
                        </span>
                      </div>
                      <div style={{marginTop:8}}>
                        <button className="btn btn-secondary" style={{fontSize:'0.85rem',marginRight:8}} onClick={() => startEditMovie(movie)}>Edit</button>
                        <button className="btn btn-primary" style={{fontSize:'0.85rem',background:'#e74c3c'}} onClick={() => deleteMovie(movie._id || movie.id)}>Delete</button>
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
