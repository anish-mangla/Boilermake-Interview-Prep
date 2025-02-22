import React, { useState } from "react";
import "./Signup.css"; // Import our custom CSS
import logo from "../assets/logo.png"; // Import the logo from assets

// We define the Signup component
const Signup = () => {
  // We store the signup fields in state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // This function handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    // Here, you can add signup logic, validation, etc.
    console.log("Signup submitted with:", {
      username,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="signup-container">
      {/* Logo section */}
      <div className="signup-logo">
        {/* Replace src with your actual logo path or an imported image */}
        <img
          src={logo}
          alt="Interview Prep Logo"
          className="logo-img"
        />
      </div>

      {/* Title */}
      <h1 className="signup-title">Sign up to Interview Prep</h1>

      {/* Form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        {/* Username field */}
        <label htmlFor="username" className="signup-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="signup-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />

        {/* Password field */}
        <label htmlFor="password" className="signup-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {/* Confirm Password field */}
        <label htmlFor="confirmPassword" className="signup-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="signup-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
        />

        {/* Sign Up button */}
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
