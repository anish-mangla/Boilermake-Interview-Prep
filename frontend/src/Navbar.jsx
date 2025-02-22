import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";

// Uncomment and adjust this if you have a logo file 
// import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      {/* Logo section on the left */}
      <div className="navbar-logo">
        {/* If you have a logo file, use <img src={logo} alt="Logo" /> */}
        {/* or you can simply use text if you prefer */}
        <Link to="/" className="logo-link">
          {/*  */}
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Link section on the right */}
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
