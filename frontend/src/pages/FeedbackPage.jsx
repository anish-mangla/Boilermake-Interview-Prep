import React, { useState, useEffect } from "react";

const FeedbackPage = ({ userId }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch feedback from Flask backend
    fetch("http://localhost:5000/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (!feedback) return <div className="text-center mt-10 text-white">No feedback found.</div>;

  return (
    <div className="feedback-container">
      {/* Total Score Box */}
      <div className="total-score-box">
        <h2>Total Score</h2>
        <p>{feedback.total_score} / 40</p>
      </div>

      {/* Feedback Sections */}
      <div className="feedback-grid">
        {Object.entries(feedback.descriptions).map(([category, details]) => (
          <div key={category} className="feedback-card">
            <h3>{category}</h3>
            <p className="description">{details.description}</p>
            <p className="score">Score: {details.score} / 10</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
