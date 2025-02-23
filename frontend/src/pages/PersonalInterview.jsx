import React from "react";
import { useNavigate } from "react-router-dom";
import "./PersonalInterview.css";

const PersonalInterview = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/mock-interview");
  };

  return (
    <div className="parent-container">

   
    <div className="startup-container">
      <h1 className="startup-heading">Welcome!</h1>
      <p className="startup-subheading">
        You will be asked a series of questions based on your resume. Each question will have a time limit of 4 minutes.
      </p>
      <button onClick={handleStart} className="startup-button">
        Start
      </button>
    </div>
    </div>
  );
};

export default PersonalInterview;
