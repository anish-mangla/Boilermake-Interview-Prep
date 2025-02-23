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
  const location = useLocation(); // Get the state passed from PersonalInterview
  const { resume, user } = location.state || {}; // Destructure resume and user from state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(240); // 4 minutes in seconds
  const [recordingState, setRecordingState] = useState("idle");
  const [responsesMap, setResponsesMap] = useState({}); // Map of questions to videos
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const videoRef = useRef(null);
  const playbackRef = useRef(null); // Ref for the playback video element
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const streamRef = useRef(null); // Ref to store the stream
  console.log(resume)

  // Initialize the video stream only when a question is clicked
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

    // Cleanup the stream when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [currentQuestionIndex]); // Init stream when current question changes

  const handleRecord = () => {
    console.log("Recording started...");
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current);
    setMediaRecorder(recorder);
    setRecordingState("recording");

    // Reset recordedChunks to empty at the start of a new recording
    setRecordedChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log("Data available:", event.data); // Debugging line

        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        console.log("In finish")
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoBlobURL = URL.createObjectURL(videoBlob);

      // Map current question to its video URL
      setResponsesMap((prevMap) => ({
        ...prevMap,
        [questions[currentQuestionIndex]]: { videoBlobURL, recordedChunks },
      }));
      console.log("Recorded video URL:", videoBlobURL);
      }
    };

    recorder.start();
    console.log("MediaRecorder started");

    // Start the 4-minute timer when recording starts
    setTimer(240); // Reset timer to 4 minutes (240 seconds)
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          handleFinish(); // Finish when time runs out
        }
        return prevTime - 1;
      });
    }, 1000);
    setCountdownInterval(countdown);
  };

  const handleFinish = () => {
    console.log("Recording finished...");
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecordingState("finished");

    // Create the video Blob URL and save it for playback
    if (recordedChunks.length > 0) {
        console.log("In finish")
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoBlobURL = URL.createObjectURL(videoBlob);

      // Map current question to its video URL
      setResponsesMap((prevMap) => ({
        ...prevMap,
        [questions[currentQuestionIndex]]: { videoBlobURL, recordedChunks },
      }));
      console.log("Recorded video URL:", videoBlobURL);
    }

    // Stop the video and audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear interval and reset timer for next question
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordingState("idle");
      setRecordedChunks([]);
      setTimer(240); // Reset timer for the next question

      // Clear interval and reset countdown
      if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
      }
    }
  };

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
          // Live camera preview while recording
          <video ref={videoRef} autoPlay muted className="camera-preview" />
        ) : (
          recordedChunks.length > 0 && (
            // Show playback of recorded video after recording is finished
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
            <p>Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
            <button onClick={handleFinish}>Finish</button>
          </>
        )}

        {recordingState === "finished" && currentQuestionIndex === questions.length - 1 && (
          <>
            <button onClick={handleGrade}>Submit Grade</button>
          </>
        )}

        {recordingState === "finished" && currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNext}>Next Question</button>
        )}
      </div>
    </div>
  );
};

export default MockInterview;