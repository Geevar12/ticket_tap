import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedIn'); // Actually clear login state
    setConfirmed(true);
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1200);
  };

  if (confirmed) {
    return (
      <div className="logout-page">
        <div className="logout-card">
          <h2>You have been logged out.</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logout-page">
      <div className="logout-card">
        <h2>Are you sure you want to logout?</h2>
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 28px',
              marginRight: 16,
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Yes, Logout
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 28px',
              background: '#8e44ad',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
