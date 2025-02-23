import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// If you have icon components (e.g., Font Awesome or Material icons), you can import them here
// import { FaUpload, FaQuestion, FaChalkboardTeacher, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleResumeClick = () => {
        navigate("/upload-resume");
    };
  return (
    <div className="dashboard-container">
      {/* Main heading (no button-like appearance) */}
      <h1 className="dashboard-heading">
        Welcome to your Interview Preparation Dashboard!
      </h1>

      {/* Subheading prompting the user */}
      <p className="dashboard-subheading">What would you like to do today?</p>

      {/* Action cards */}
      <div className="dashboard-actions">
        {/* 1. Upload & Analyze Resume */}
        <div className="dashboard-action-card" onClick={handleResumeClick} style={{ cursor: "pointer" }}>
          {/* <FaUpload className="action-icon" /> */} 
          {/* If you have an icon library, uncomment the line above and remove the placeholder below */}
          <div className="action-icon">📄</div>
          <p>Upload & Analyze Resume</p>
        </div>

        {/* 2. Practice Common Questions */}
        <div className="dashboard-action-card">
          {/* <FaQuestion className="action-icon" /> */}
          <div className="action-icon">❓</div>
          <p>Practice Common Questions</p>
        </div>

        {/* 3. Create Personalized Mock Interview */}
        <div className="dashboard-action-card">
          {/* <FaChalkboardTeacher className="action-icon" /> */}
          <div className="action-icon">🎤</div>
          <p>Create Personalized Mock Interview</p>
        </div>

        {/* 4. Review My Performance */}
        <div className="dashboard-action-card">
          {/* <FaChartLine className="action-icon" /> */}
          <div className="action-icon">📈</div>
          <p>Review My Performance</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
