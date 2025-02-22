import React from "react";
import "./Home.css";
import heroImage from "../assets/heroImage.jpg"; 
import Home_image2 from "../assets/Home_image2.jpg"; 

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section with a fixed background image */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay to darken image a bit for contrast */}
        <div className="hero-overlay">
          <h1 className="hero-title">Unlocking Potential, Delivering Results</h1>
          <button
            className="hero-button"
            onClick={() => {
              // Smooth scroll to the About section
              document
                .getElementById("about-section")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-section" className="about-section">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are dedicated to empowering individuals and organizations...
            {/* Your about text */}
          </p>
          <p>
            With a focus on innovation, integrity, and collaboration...
            {/* More about text */}
          </p>
        </div>

        <div className="about-image">
          <img src={Home_image2} alt="Team discussing ideas" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Coaching</h3>
            <p>Tailored advice, actionable insights...</p>
          </div>
          <div className="feature-card">
            <h3>Advanced Analytics</h3>
            <p>Data-driven strategies that empower you...</p>
          </div>
          <div className="feature-card">
            <h3>Collaborative Community</h3>
            <p>Engage with peers and experts...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;