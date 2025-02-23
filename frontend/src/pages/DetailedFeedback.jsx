import React from "react";
import { useLocation } from "react-router-dom";
import "./DetailedFeedback.css";

const DetailedFeedback = () => {
  // We passed data via navigate("/feedback", { state: { feedbackData: data } });
  const location = useLocation();
  const { feedbackData } = location.state || {};

  if (!feedbackData) {
    return <div>No feedback data found.</div>;
  }

  // Extract the needed parts
  const {
    index,
    question,
    transcript,
    feedback
  } = feedbackData;

  if (!feedback || feedback.error) {
    return (
      <div>
        <h2>Feedback Error</h2>
        <p>{feedback?.error || "Unknown error"}</p>
      </div>
    );
  }

  const { raw_feedback, structured_feedback } = feedback;
  const { descriptions, total_score } = structured_feedback || {};

  return (
    <div className="detailed-feedback-container">
      <h2>Feedback for Question #{index}</h2>
      <h3>{question}</h3>

      <div className="transcript-section">
        <h4>Transcript:</h4>
        <p>{transcript}</p>
      </div>

      {descriptions && (
        <div className="categories-section">
          {Object.keys(descriptions).map((category) => {
            const { score, description } = descriptions[category];
            return (
              <div key={category} className="category-feedback">
                <h4>{category}</h4>
                <p><strong>Score:</strong> {score}/10</p>
                <p><strong>Feedback:</strong> {description}</p>
              </div>
            );
          })}
        </div>
      )}

      {typeof total_score === "number" && (
        <p className="final-score">Final Score: {total_score}/40</p>
      )}

      {/* Raw feedback if you want to show the entire text from GPT */}
      {/* <pre className="raw-feedback">{raw_feedback}</pre> */}
    </div>
  );
};

export default DetailedFeedback;
