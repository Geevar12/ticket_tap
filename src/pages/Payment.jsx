import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;
  const [method, setMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="container" style={{padding: 40, textAlign: 'center'}}>
        <h2>No booking found.</h2>
        <button className="btn btn-primary" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  const handlePay = e => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      navigate('/booking/confirmation', {
        state: {
          ...booking,
          paymentMethod: method
        }
      });
    }, 1200);
  };

  return (
    <div className="container" style={{padding: 40, maxWidth: 500, margin: '0 auto', textAlign: 'center'}}>
      <h2 style={{marginBottom: 24, color: '#2d7a2d'}}>Payment</h2>
      <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(44,62,80,0.07)', padding: 28, marginBottom: 24}}>
        <div style={{marginBottom: 18, fontWeight: 600, fontSize: 18}}>
          <span style={{color: '#f84464'}}>🎬 {booking.movieName}</span>
        </div>
        <div style={{marginBottom: 10}}><strong>Theatre:</strong> {booking.theatreName}</div>
        <div style={{marginBottom: 10}}><strong>Showtime:</strong> {booking.showtime}</div>
        <div style={{marginBottom: 10}}><strong>Seats:</strong> {booking.selectedSeats.join(', ')}</div>
        <div style={{marginBottom: 18}}><strong>Total:</strong> ₹{booking.totalPrice}</div>
        <form onSubmit={handlePay}>
          <div style={{marginBottom: 18, textAlign: 'left'}}>
            <label style={{fontWeight: 600, marginBottom: 6, display: 'block'}}>Select Payment Method:</label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              style={{padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, width: '100%'}}
            >
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
              <option>Wallet</option>
              <option>Cash at Counter</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={processing} style={{width: '100%', fontSize: 17}}>
            {processing ? 'Processing...' : 'Pay & Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
