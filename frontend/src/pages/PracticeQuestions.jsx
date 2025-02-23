// File: src/pages/PracticeQuestions.jsx
import React from "react";
import { Link } from "react-router-dom"; // for navigation to detail pages later
import "./PracticeQuestions.css";
import { useNavigate } from 'react-router-dom';

// Hard-coded list of 20 common interview questions
const questions = [
  "Tell me about yourself.",
  "What are your strengths?",
  "What are your weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in 5 years?",
  "Why did you leave your last job?",
  "What can you bring to our company?",
  "Tell me about a time you faced a challenge at work.",
  "How do you handle stress and pressure?",
  "Describe a time when you worked in a team.",
  "What are your salary expectations?",
  "Why should we hire you?",
  "Tell me about a time you demonstrated leadership.",
  "What do you know about our company?",
  "Describe your ideal work environment.",
  "How do you prioritize your work?",
  "Tell me about a time you failed and how you handled it.",
  "What motivates you?",
  "How do you handle criticism?",
  "Do you have any questions for us?"
];

const PracticeQuestions = () => {
    const navigate = useNavigate();

    // When the user clicks on a question, navigate to the detail page
    const handleQuestionClick = (index) => {
        // We'll pass the question's index in the URL so we can retrieve the question later
        navigate(`/practice-questions/${index}`);
    };
    return (
        <div className="practice-questions-container">
          {/* Header for the page */}
      <h1 className="practice-questions-heading">
        Practice Common Interview Questions
      </h1>
          <div className="questions-list">
            {questions.map((question, index) => (
              <div
                key={index}
                className="question-item"
                onClick={() => handleQuestionClick(index)}
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      );
};

export default PracticeQuestions;
