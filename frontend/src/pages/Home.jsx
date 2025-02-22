import React from "react";
import "./Home.css";

// If your image is at: src/assets/heroImage.jpg
// import heroImage from "../assets/heroImage.jpg";
import heroImage from "../assets/heroImage.jpg"; // Replace with your actual image path
import Home_image2 from "../assets/Home_image2.jpg"; // Replace with your actual image path

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section with background image */}
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
            We are dedicated to empowering individuals and organizations with
            tailor-made solutions. From top-notch consulting to comprehensive
            hands-on assistance, our mission is to provide the tools and support
            necessary to thrive in a competitive environment.
          </p>
          <p>
            With a focus on innovation, integrity, and collaboration, our team
            continuously strives to deliver forward-thinking strategies that
            unlock new levels of potential. Let us work together to chart your
            path to success.
          </p>
        </div>

        <div className="about-image">
          {/* You can replace this with another image or a relevant photo */}
          <img
            src={Home_image2}
            alt="Team discussing ideas"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Coaching</h3>
            <p>
              Tailored advice, actionable insights, and one-on-one sessions to
              help you accelerate your growth.
            </p>
          </div>
          <div className="feature-card">
            <h3>Advanced Analytics</h3>
            <p>
              Data-driven strategies that empower you with a deeper
              understanding of your next steps.
            </p>
          </div>
          <div className="feature-card">
            <h3>Collaborative Community</h3>
            <p>
              Engage with peers and experts, building a network of ongoing
              support and inspiration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
