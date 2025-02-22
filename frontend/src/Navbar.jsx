import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";


const Navbar = () => {
  return (
    // Using a semantic <nav> for the navbar container
    <nav className="navbar-container">

      {/* Link section */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/signup" className="nav-link">
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
