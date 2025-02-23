import React from "react";
import "./ReviewPerformance.css";

const ReviewPerformance = () => {
  return (
    <div className="review-performance-container">
      <h1 className="review-title">Here are your latest Interview Grades</h1>

      {/* Placeholder for future performance summary */}
      <div className="performance-summary">
        <h2 className="summary-title">Performance Overview</h2>
        <p className="summary-text">Your latest interview results will be displayed here.</p>
      </div>

      {/* Placeholder for mock interview scores table */}
      <div className="performance-table-container">
        <h2 className="table-title">Recent Interview Scores</h2>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Feb 22, 2025</td>
              <td>A+</td>
            </tr>
            <tr>
              <td>Feb 18, 2025</td>
              <td>B</td>
            </tr>
            <tr>
              <td>Feb 15, 2025</td>
              <td>A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewPerformance;
