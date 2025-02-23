import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../contexts/GlobalContext'; // Adjust path as needed
import "./PersonalInterview.css";

const PersonalInterview = () => {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    console.log(user)
    try {
      const response = await fetch("http://127.0.0.1:5000/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      const resume = await response.json();
      navigate("/mock-interview", { state: { resume, user } }); // Pass resume and user as state
    } catch (error) {
      console.error("Error fetching resume:", error);
      setLoading(false);
    }
  };

  return (
    <div className="parent-container">
      <div className="startup-container">
        <h1 className="startup-heading">Welcome, {user?.name || "Guest"}!</h1>
        <p className="startup-subheading">
          You will be asked a series of questions based on your resume. Each question will have a time limit of 4 minutes.
        </p>
        <button onClick={handleStart} className="startup-button" disabled={loading}>
          {loading ? "Loading..." : "Start"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInterview;
