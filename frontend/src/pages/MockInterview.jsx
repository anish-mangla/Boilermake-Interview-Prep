import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MockInterview.css";
import { GlobalContext } from '../contexts/GlobalContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const questions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
  "Tell us about a challenge you faced and how you overcame it."
];

const MockInterview = () => {
  const location = useLocation();
  const { resume, user } = location.state || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(240); // 4 minutes in seconds
  const [recordingState, setRecordingState] = useState("idle");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]); // Stores feedback for each question
  const [showFeedback, setShowFeedback] = useState(false);
  
  const videoRef = useRef(null);
  const playbackRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const streamRef = useRef(null); // Ref to store the stream

  useEffect(() => {
    const initStream = async () => {
      if (!streamRef.current) {
        try {
          const userStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRef.current = userStream;
          if (videoRef.current && !videoRef.current.srcObject) {
            videoRef.current.srcObject = userStream;
          }
        } catch (error) {
          console.error("Error accessing camera or microphone", error);
        }
      }
    };

    initStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [currentQuestionIndex]);

  const handleRecord = () => {
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current);
    setMediaRecorder(recorder);
    setRecordingState("recording");
    setRecordedChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };

    recorder.start();
    setTimer(240);
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          handleFinish();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setCountdownInterval(countdown);
  };

  const handleFinish = async () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();

    if (recordedChunks.length > 0) {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", videoBlob);
      formData.append("question", questions[currentQuestionIndex]);
      formData.append("index", currentQuestionIndex);

      try {
        const response = await fetch("http://127.0.0.1:5000/grade", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setFeedbacks((prevFeedbacks) => {
          const newFeedbacks = [...prevFeedbacks];
          newFeedbacks[currentQuestionIndex] = {
            question: questions[currentQuestionIndex],
            ...data,
          };
          return newFeedbacks;
        });
      } catch (error) {
        console.error("Error submitting video for grading", error);
        alert("Failed to submit video for grading.");
      }
    }
    setRecordingState("finished");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordingState("idle");
      setRecordedChunks([]);
      setTimer(240);
      if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
      }
    }
  };

  const handleSubmitFeedback = () => {
    setShowFeedback(true);
  };

  return (
    <div className="question-detail-container">
      <h2 className="question-heading">
        Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}
      </h2>

      <div className="video-container">
        {recordingState !== "finished" ? (
          <video ref={videoRef} autoPlay muted className="camera-preview" />
        ) : (
          recordedChunks.length > 0 && (
            <video
              ref={playbackRef}
              controls
              className="playback-preview"
              src={URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))}
            />
          )
        )}
      </div>

      <div className="controls-container">
        {recordingState === "idle" && <button onClick={handleRecord}>Record</button>}
        {recordingState === "recording" && (
          <>
            <p>Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
            <button onClick={handleFinish}>Finish</button>
          </>
        )}
        {recordingState === "finished" && currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNext}>Next Question</button>
        )}
        {recordingState === "finished" && currentQuestionIndex === questions.length - 1 && (
          <button onClick={handleSubmitFeedback}>Submit Grade</button>
        )}
      </div>

      {showFeedback && (
        <div className="feedback-container">
          <h3>Interview Feedback</h3>
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <h4>Question {index + 1}: {feedback.question}</h4>
              {feedback.grade && <p>Grade: {feedback.grade}</p>}
              {feedback.transcript && <div><h5>Transcript:</h5><p>{feedback.transcript}</p></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockInterview;
