import React from "react";
import "./Home.css";
// Optional: import logo if you want a logo in your navbar
// import logo from "../assets/logo.png"; 

// Home component definition
const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar Section */}
      

      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Welcome to Interview Prep</h1>
        <p className="hero-subtitle">
          Practice your interviews with AI-driven sessions and real-time feedback
        </p>
        <button className="hero-button">Get Started</button>
      </header>

      {/* Features/Description Section */}
      <section className="features-section">
        <h2 className="features-title">Why Interview Prep?</h2>
        <p className="features-description">
          Our platform combines AI and advanced speech & facial analysis to 
          give you the most realistic mock interview experience possible.
        </p>

        {/* Feature List */}
        <ul className="feature-list">
          <li>AI-based interview questions tailored to your resume</li>
          <li>Speech & facial recognition to analyze performance</li>
          <li>Real-time feedback on your delivery and body language</li>
          <li>Personalized recommendations for improvement</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
