import React from 'react';
import { Link } from 'react-router-dom';

import background3 from '../../assets/landingImg/img-3.jpeg';
import background1 from '../../assets/landingImg/pexels-gustavo-fring-7447067.jpg';

// Tailwind


const App: React.FC = () => {
  return (
    <div className="landingPage">
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-4 md:p-6 bg-black bg-opacity-80 flex justify-between items-center z-50 shadow-lg">
        <div className="text-2xl md:text-4xl font-bold text-red-400">VR_DATING</div>
        <ul className="flex gap-4 md:gap-8">
          <li>
            <a href="#about" className="text-white hover:bg-red-400 transition-colors px-3 py-2 rounded">About</a>
          </li>
           <li>
            <Link to="/login" className="text-white hover:bg-red-400 transition-colors px-3 py-2 rounded">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center" style={{ backgroundImage: `url(${background1})` }}>
        <div className="text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Discover Meaningful Connections</h1>
          <p className="text-lg md:text-2xl mb-6 drop-shadow-lg">Join the best online dating platform today.</p>
          <Link to="/login" className="bg-red-400 hover:bg-red-500 transition-colors px-6 py-3 text-lg text-white rounded">Get Started</Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-100 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-700">Why Choose VR_DATING?</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Experience the best platform for safe, meaningful connections. Whether you're looking for a long-term relationship or new friendships, we make it easy to connect with like-minded people.
          </p>
          <p className="text-lg md:text-xl text-gray-600">
            Our platform is designed to ensure your safety and privacy while helping you find the perfect match. Join us today and start your journey towards love and companionship.
          </p>
        </div>
      </section>

      {/* Feature Section */}
      <section className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center" style={{ backgroundImage: `url(${background3})` }}>
        <div className="text-white px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Find Love. Make Memories.</h2>
          <p className="text-lg md:text-xl">Meet new people today and start your journey towards lasting relationships.</p>
        </div>
      </section>
    </div>
  );
};

export default App;
