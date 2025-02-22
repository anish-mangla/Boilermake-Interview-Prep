import React, { useState } from "react";
import "./Login.css"; // Import our custom CSS
import logo from "../assets/logo.png"; // Import the logo from assets

// We define the Login component
const Login = () => {
  // We use React state to store form values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // This function handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Login submitted with:", { username, password });
    // Here you can add your authentication logic
  };

  return (
    <div className="login-container">
      {/* Logo section */}
      <div className="login-logo">
        {/* Replace src with your actual logo path or an imported image */}
        <img
          src={logo}
          alt="Interview Prep Logo"
          className="logo-img"
        />
        
      </div>

      {/* Title */}
      <h1 className="login-title">Sign in to Interview Prep</h1>

      {/* Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Username label & input */}
        <label htmlFor="username" className="login-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />

        {/* Password label & input row (with "Forgot Password?") */}
        <div className="password-label-row">
          <label htmlFor="password" className="login-label">
            Password
          </label>
          {/* The "Forgot Password?" link */}
          <a href="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {/* Sign In button */}
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
