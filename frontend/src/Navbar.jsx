// src/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "./contexts/GlobalContext";
import "./Navbar.css";
import logo from "./assets/logo.png"; // Ensure your logo is in the correct directory

const Navbar = () => {
  const { user, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      {/* Logo and Title */}
      <div className="navbar-brand">
        <Link to="/" className="logo-link">
          <img src={logo} alt="InterVue Logo" className="logo-img" />
        </Link>
        <h1 className="navbar-title"><strong>InterVue</strong></h1>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
