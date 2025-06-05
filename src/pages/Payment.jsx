import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;
  const [paytmStep, setPaytmStep] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="container" style={{padding: 40, textAlign: 'center'}}>
        <h2>No booking found.</h2>
        <button className="btn btn-primary" onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  // Step 1: Show payment summary and "Proceed to Paytm"
  if (!paytmStep) {
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
          <button
            className="btn btn-primary"
            style={{width: '100%', fontSize: 17}}
            onClick={() => setPaytmStep(true)}
          >
            Proceed to Paytm
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Simulated Paytm page
  return (
    <div className="container" style={{padding: 40, maxWidth: 400, margin: '0 auto', textAlign: 'center'}}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px #00baf2aa',
        padding: 32,
        marginBottom: 24,
        border: '2px solid #00baf2'
      }}>
        <img
          src="https://images.seeklogo.com/logo-png/30/1/paytm-logo-png_seeklogo-305549.png"
          alt="Paytm"
          style={{width: 120, marginBottom: 18}}
        />
        <h3 style={{color: '#00baf2', marginBottom: 18}}>Pay with Paytm</h3>
        <div style={{fontSize: 20, fontWeight: 700, marginBottom: 18}}>
          Amount: <span style={{color: '#2d7a2d'}}>₹{booking.totalPrice}</span>
        </div>
        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            fontSize: 18,
            background: 'linear-gradient(90deg, #00baf2 60%, #002970 100%)',
            border: 'none'
          }}
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            setTimeout(() => {
              navigate('/booking/confirmation', {
                state: {
                  ...booking,
                  paymentMethod: 'Paytm'
                }
              });
            }, 1500);
          }}
        >
          {processing ? 'Processing...' : `Pay ₹${booking.totalPrice} with Paytm`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
