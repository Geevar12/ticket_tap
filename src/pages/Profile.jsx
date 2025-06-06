import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user') || 'default';
    const data = JSON.parse(localStorage.getItem(`bookings_${user}`) || '[]');
    setBookings(data.filter(b => b.status !== 'cancelled'));
  }, []);

  const handleCancel = (idx) => {
    setCancelId(idx);
  };

  const confirmCancel = async (idx) => {
    const user = localStorage.getItem('user') || 'default';
    const data = JSON.parse(localStorage.getItem(`bookings_${user}`) || '[]');
    const bookingToCancel = bookings[idx];
    // Update localStorage
    const updated = data.map(b =>
      b.bookingTime === bookingToCancel.bookingTime &&
      b.movieName === bookingToCancel.movieName &&
      b.selectedDate === bookingToCancel.selectedDate &&
      JSON.stringify(b.selectedSeats) === JSON.stringify(bookingToCancel.selectedSeats)
        ? { ...b, status: 'cancelled' }
        : b
    );
    localStorage.setItem(`bookings_${user}`, JSON.stringify(updated));
    setBookings(updated.filter(b => b.status !== 'cancelled'));
    setCancelId(null);

    // Backend: cancel booking and update seats
    try {
      // Fetch bookingId from backend (if stored), else skip backend update
      // Here, we assume bookingToCancel has a backend _id if you fetch bookings from backend for profile
      if (bookingToCancel._id && bookingToCancel.movieId && bookingToCancel.selectedSeats) {
        await fetch('http://localhost:3001/api/bookings/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: bookingToCancel._id,
            movieId: bookingToCancel.movieId,
            seats: bookingToCancel.selectedSeats
          })
        });
      }
    } catch (e) {
      // Optionally show error
    }
  };

  return (
    <div className="container" style={{padding: 40, maxWidth: 700, margin: '0 auto'}}>
      <h2 style={{marginBottom: 24, color: '#2d7a2d'}}>My Booked Shows</h2>
      {bookings.length === 0 ? (
        <div style={{textAlign: 'center', color: '#888'}}>No bookings found.</div>
      ) : (
        <div>
          {bookings.map((b, idx) => (
            <div key={b.bookingTime + b.movieName + b.selectedDate + b.selectedSeats.join(',')} style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 12px rgba(44,62,80,0.07)',
              padding: 24,
              marginBottom: 18,
              position: 'relative'
            }}>
              <div style={{fontWeight: 700, fontSize: 18, marginBottom: 8}}>
                🎬 {b.movieName}
              </div>
              <div><strong>Date:</strong> {b.selectedDate}</div>
              <div><strong>Theatre:</strong> {b.theatreName}</div>
              <div><strong>Showtime:</strong> {b.showtime}</div>
              <div><strong>Seat Type:</strong> {b.seatType} (₹{b.seatTypePrice})</div>
              <div><strong>Seats:</strong> {b.selectedSeats.join(', ')}</div>
              <div><strong>Total Paid:</strong> ₹{b.totalPrice}</div>
              <div><strong>Booked On:</strong> {new Date(b.bookingTime).toLocaleString()}</div>
              <button
                className="btn btn-primary"
                style={{marginTop: 14, background: '#e74c3c'}}
                onClick={() => handleCancel(idx)}
              >
                Cancel Booking
              </button>
              {cancelId === idx && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(44,62,80,0.13)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12
                }}>
                  <div style={{
                    background: '#fff',
                    padding: 24,
                    borderRadius: 10,
                    boxShadow: '0 2px 12px rgba(44,62,80,0.13)',
                    textAlign: 'center'
                  }}>
                    <div style={{marginBottom: 14}}>Are you sure you want to cancel this booking?</div>
                    <button className="btn btn-primary" style={{marginRight: 10, background: '#e74c3c'}} onClick={() => confirmCancel(idx)}>Yes, Cancel</button>
                    <button className="btn btn-secondary" onClick={() => setCancelId(null)}>No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
