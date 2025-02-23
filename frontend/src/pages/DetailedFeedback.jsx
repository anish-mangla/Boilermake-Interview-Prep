import React from "react";
import { useLocation } from "react-router-dom";
import "./DetailedFeedback.css";

const DetailedFeedback = () => {
  const location = useLocation();
  // We passed data via: navigate("/feedback", { state: { feedbackData: data } });
  const { feedbackData } = location.state || {};

  if (!feedbackData) {
    return (
      <div className="detailed-feedback-container">
        <h2>No feedback data found</h2>
      </div>
    );
  }

  const { index, feedback, question, transcript } = feedbackData;
  const descriptions = feedback?.descriptions || {};
  const totalScore = feedback?.total_score;

  return (
    <div className="detailed-feedback-container">
      <h2>Feedback for Question #{index}</h2>
      <h3>{question}</h3>

      <div className="transcript-section">
        <h4>Transcript:</h4>
        <p>{transcript || "No transcript available."}</p>
      </div>

      <div className="feedback-section">
        <h4>AI Feedback:</h4>
        {typeof feedback === "string" ? (
          <pre className="raw-feedback">{feedback}</pre>
        ) : (
          <p>No AI feedback available.</p>
        )}
      </div>

    </div>
  );
};

export default DetailedFeedback;
