import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Hide navbar on login page
  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/home" className="nav-logo">
          <span className="nav-logo-text">TicketTap</span>
        </Link>
        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/movies" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Movies
          </Link>
          <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Events
          </Link>
          <Link to="/logout" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Logout
          </Link>
        </div>
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;