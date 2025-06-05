import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HERO_IMG = "https://4kwallpapers.com/images/walls/thumbs_3t/13940.jpg"; // Stylish cinema image

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Experience Movies Like Never Before</h1>
          <p>Book tickets for the latest blockbusters. Enjoy a seamless, secure and fast booking experience with Nova Cinemas.</p>
          <div className="hero-buttons">
            <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={HERO_IMG} alt="Cinema Experience" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;