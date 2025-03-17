import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MockInterview.css";

const MockInterview = () => {
  const location = useLocation();
  const { resume } = location.state || {};
  const questions = resume.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(240);
  const [recordingState, setRecordingState] = useState("idle");
  const [feedbacks, setFeedbacks] = useState([]);
  const [gradingInProgress, setGradingInProgress] = useState(false);  // Track grading status
  const [showFeedback, setShowFeedback] = useState(false);

  const videoRef = useRef(null);
  const playbackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = userStream;
        if (videoRef.current) videoRef.current.srcObject = userStream;
      } catch (error) {
        console.error("Error accessing camera or microphone", error);
      }
    };

    initStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentQuestionIndex]);

  const handleRecord = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = []; // Reset previous chunks
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      console.log("Recording stopped, chunks:", recordedChunksRef.current);
      if (recordedChunksRef.current.length > 0) {
        const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const formData = new FormData();
        formData.append("video", videoBlob);
        formData.append("question", questions[currentQuestionIndex]);
        formData.append("index", currentQuestionIndex);

        try {
          setGradingInProgress(true);  // Start grading
          const response = await fetch("http://127.0.0.1:5000/grade", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          
          setFeedbacks(prev => {
            const updated = [...prev];
            updated[currentQuestionIndex] = { question: questions[currentQuestionIndex], ...data };
            return updated;
          });
          console.log(data)
          console.log(feedbacks)
        } catch (error) {
          console.error("Error submitting video:", error);
        } finally {
          setGradingInProgress(false);  // Stop grading
        }
      }
    };

    recorder.start();
    setRecordingState("recording");
    setTimer(240);
    countdownIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 0) {
          clearInterval(countdownIntervalRef.current);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinish = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecordingState("finished");
    clearInterval(countdownIntervalRef.current);
  };

  const handleNext = () => {
    if (gradingInProgress) {
      console.warn("Grading is still in progress, please wait...");
      return;
    }
    console.log(feedbacks)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setRecordingState("idle");
      setTimer(240);
    }
  };

  const handleSubmitFeedback = () => {
    setShowFeedback(true);
  };

  return (
    <div className="question-detail-container">
      <h2>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</h2>

      <div className="video-container">
        {recordingState !== "finished" ? (
          <video ref={videoRef} autoPlay muted className="camera-preview" />
        ) : (
          recordedChunksRef.current.length > 0 && (
            <video
              ref={playbackRef}
              controls
              className="playback-preview"
              src={URL.createObjectURL(new Blob(recordedChunksRef.current, { type: "video/webm" }))}
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
          <button onClick={handleNext} disabled={gradingInProgress}>Next Question</button>
        )}
        {recordingState === "finished" && currentQuestionIndex === questions.length - 1 && (
          <button onClick={handleSubmitFeedback}>Submit Grade</button>
        )}
      </div>

      {showFeedback && feedbacks.length > 0 && (
        <div className="feedback-container">
          <h3>Interview Feedback</h3>
          {console.log(feedbacks)}
          {feedbacks.map((feedback, index) => (
            <div key={index}>
              <h4>Question {index + 1}: {feedback.question}</h4>
              {feedback.feedback && <p>Grade: {feedback.feedback}</p>}
              {feedback.transcript && <p>Transcript: {feedback.transcript}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockInterview;
