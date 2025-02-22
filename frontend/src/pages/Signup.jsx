import React, { useState, useContext } from "react";
import "./Signup.css"; // Import our custom CSS
import { GlobalContext } from '../contexts/GlobalContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';


// We define the Signup component
const Signup = () => {
  // We store the signup fields in state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return; // Stop the function if passwords don't match
    }
  
    // Create the formData object
    const formData = { username, password };
  
    try {
    const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(formData),
    });
    console.log(response)
    if (response.ok) {
        console.log("ok")
        const data = await response.json();
        setUser(data);
        navigate('/dashboard');
    }
    else {
        const error = await response.json();
        alert(error.message || 'Signup failed.');
    }
    } catch (err) {
        alert(err.message || 'An unexpected error occurred during signup.');
    }
};

  return (
    <div className="signup-container">
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
