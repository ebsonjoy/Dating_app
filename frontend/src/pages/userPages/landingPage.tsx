import React from 'react';
import '../style/userStyle/landingPage.css'
import { Link } from "react-router-dom";

import background3 from '../../assets/landingImg/img-3.jpeg'; 
import background1 from '../../assets/landingImg/pexels-gustavo-fring-7447067.jpg';

const App: React.FC = () => {
  return (
    <div className="landingPage">
      <nav className="landingPage__navbar">
        <div className="landingPage__logo">VR_DATING</div>
        <ul className="landingPage__nav-links">
          <li><a href="#about">About</a></li>
          <Link to="/login">
          <li><a href="#login">Login</a></li>
        </Link>
          
        </ul>
      </nav>

      <section className="landingPage__section landingPage__section-hero"
               style={{ backgroundImage: `url(${background1})` }}>
        <div className="landingPage__hero-text">
          <h1>Discover Meaningful Connections</h1>
          <p>Join the best online dating platform today.</p>
          <Link to="/login">
          <a href="#signup" className="landingPage__cta-btn">Get Started</a>
        </Link>
        </div>
      </section>

      <section className="landingPage__section landingPage__section-info" id="about">
        <div className="landingPage__info-content">
          <h2>Why Choose VR_DATING?</h2>
          <p>
            Experience the best platform for safe, meaningful connections. Whether you're looking for a long-term relationship or new friendships, we make it easy to connect with like-minded people.
          </p>
          <p>
            Our platform is designed to ensure your safety and privacy while helping you find the perfect match. Join us today and start your journey towards love and companionship.
          </p>
        </div>
      </section>

      <section className="landingPage__section landingPage__section-feature"
               style={{ backgroundImage: `url(${background3})` }}>
        <div className="landingPage__feature-text">
          <h2>Find Love. Make Memories.</h2>
          <p>Meet new people today and start your journey towards lasting relationships.</p>
        </div>
      </section>
    </div>
  );
};

export default App;
