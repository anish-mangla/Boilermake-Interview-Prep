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
  console.log(resume)

  // Initialize the video stream when a question is shown
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

    // Cleanup when the component unmounts or question changes
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [currentQuestionIndex]);

  const handleRecord = () => {
    console.log("Recording started...");
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current);
    setMediaRecorder(recorder);
    setRecordingState("recording");

    // Reset recordedChunks at start of recording
    setRecordedChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        // Append the chunk to the recordedChunks array
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };

    recorder.start();
    console.log("MediaRecorder started");

    // Start the 4-minute timer
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
    console.log("Recording finished...");
    if (!mediaRecorder) return;

    // Stop the recorder (this will trigger the onstop event if set)
    mediaRecorder.stop();

    // When recording stops, process the recorded chunks
    // Note: In this example, we assume that all the chunks are ready in recordedChunks.
    if (recordedChunks.length > 0) {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoBlobURL = URL.createObjectURL(videoBlob);
      console.log("Recorded video URL:", videoBlobURL);

      // Prepare formData for the /grade endpoint
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
        // Store the feedback (assuming the response contains "grade" and/or "transcript")
        setFeedbacks((prevFeedbacks) => {
          const newFeedbacks = [...prevFeedbacks];
          newFeedbacks[currentQuestionIndex] = {
            question: questions[currentQuestionIndex],
            ...data,
          };
          return newFeedbacks;
        });
        console.log(
          `Feedback received for question ${currentQuestionIndex + 1}:`,
          data
        );
      } catch (error) {
        console.error("Error submitting video for grading", error);
        alert("Failed to submit video for grading.");
      }
    }

    // Change state to finished and stop the timer and stream
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
    console.log("Moving to next question...");
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);
    formData.append("question", questions[currentQuestionIndex]);
    formData.append("index", currentQuestionIndex + 1);
    const response = await fetch("http://127.0.0.1:5000/grade", {
      method: "POST",
      body: formData,
    });
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
    // When all questions are done, display the collected feedback
    setShowFeedback(true);
  const handleGrade = async () => {
   console.log("Display")
   console.log("Moving to next question...");
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);
    formData.append("question", questions[currentQuestionIndex]);
    formData.append("index", currentQuestionIndex + 1);
    const response = await fetch("http://127.0.0.1:5000/grade", {
      method: "POST",
      body: formData,
    });
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
              src={URL.createObjectURL(
                new Blob(recordedChunks, { type: "video/webm" })
              )}
            />
          )
        )}
      </div>

      <div className="controls-container">
        {recordingState === "idle" && (
          <button onClick={handleRecord}>Record</button>
        )}

        {recordingState === "recording" && (
          <>
            <p>
              Time left: {Math.floor(timer / 60)}:
              {String(timer % 60).padStart(2, "0")}
            </p>
            <button onClick={handleFinish}>Finish</button>
          </>
        )}

        {recordingState === "finished" &&
          currentQuestionIndex < questions.length - 1 && (
            <button onClick={handleNext}>Next Question</button>
          )}

        {recordingState === "finished" &&
          currentQuestionIndex === questions.length - 1 && (
            <button onClick={handleSubmitFeedback}>Submit Grade</button>
          )}
      </div>

      {showFeedback && (
        <div className="feedback-container">
          <h3>Interview Feedback</h3>
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <h4>
                Question {index + 1}: {feedback.question}
              </h4>
              {feedback.grade && <p>Grade: {feedback.grade}</p>}
              {feedback.transcript && (
                <div>
                  <h5>Transcript:</h5>
                  <p>{feedback.transcript}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockInterview;