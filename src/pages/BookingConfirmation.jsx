import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  if (!booking) {
    return (
      <div className="container" style={{padding: 40, textAlign: 'center'}}>
        <h2>No booking found.</h2>
        <button className="btn btn-primary" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  return (
    <div className="container" style={{padding: 40, maxWidth: 500, margin: '0 auto', textAlign: 'center'}}>
      <h2 style={{marginBottom: 24, color: '#2d7a2d'}}>Booking Confirmed!</h2>
      <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', padding: 28, marginBottom: 24}}>
        <div style={{marginBottom: 12, fontWeight: 700, fontSize: 18}}>
          <span style={{color: '#f84464'}}>🎬 {booking.movieName}</span>
        </div>
        <div style={{marginBottom: 12}}><strong>Theatre:</strong> {booking.theatreName}</div>
        <div style={{marginBottom: 12}}><strong>Showtime:</strong> {booking.showtime}</div>
        <div style={{marginBottom: 12}}><strong>Seat Type:</strong> {booking.seatType} (₹{booking.seatTypePrice})</div>
        <div style={{marginBottom: 12}}><strong>Seats:</strong> {booking.selectedSeats.join(', ')}</div>
        <div style={{marginBottom: 12}}><strong>Total Paid:</strong> ₹{booking.totalPrice}</div>
        {booking.paymentMethod && (
          <div style={{marginBottom: 12}}><strong>Payment Method:</strong> {booking.paymentMethod}</div>
        )}
      </div>
      <button className="btn btn-primary" onClick={() => navigate('/home')}>Go to Home</button>
    </div>
  );
};

export default BookingConfirmation;
