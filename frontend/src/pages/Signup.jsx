import React, { useState, useContext } from "react";
import { GlobalContext } from '../contexts/GlobalContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    const formData = { username, password };
  
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        navigate('/resume-upload'); // Redirect to Resume Upload page
      } else if (response.status === 409) {
        alert("User already exists.");
      } else {
        const error = await response.json();
        alert(error.message || 'Signup failed.');
      }
    } catch (err) {
      alert(err.message || 'An unexpected error occurred during signup.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign up to Interview Prep</h1>
      <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input
          id="username"
          type="text"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4 mb-2">Password</label>
        <input
          id="password"
          type="password"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mt-4 mb-2">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
