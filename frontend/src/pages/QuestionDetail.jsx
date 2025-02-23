import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuestionDetail.css";

// Keep same as the questions list from PracticeQuestions.jsx
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

const QuestionDetail = () => {
  const { questionIndex } = useParams();
  const question = questions[questionIndex] || "Unknown Question";

  // State to hold the stream (for internal logic if needed)
  const [stream, setStream] = useState(null);
  // Use a ref to store the stream for cleanup
  const streamRef = useRef(null);

  // MediaRecorder instance and recorded chunks
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Recording state: "idle" | "recording" | "paused" | "finished"
  const [recordingState, setRecordingState] = useState("idle");

  // Reference to the video element showing the live camera feed
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize the camera stream only once on mount
    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream; // Store in ref for later cleanup
        setStream(userStream);

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (error) {
        console.error("Error accessing camera or microphone", error);
      }
    };

    initStream();

    // Cleanup: Stop the camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start recording
  const handleRecord = () => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setRecordedChunks([]); // reset any old recordings
    setRecordingState("recording");

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.start();
  };

  // Pause/Resume recording
  const handlePauseResume = () => {
    if (!mediaRecorder) return;

    if (recordingState === "recording") {
      mediaRecorder.pause();
      setRecordingState("paused");
    } else if (recordingState === "paused") {
      mediaRecorder.resume();
      setRecordingState("recording");
    }
  };

  // Finish recording and stop the camera stream
  const handleFinish = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecordingState("finished");

    // Stop the camera stream immediately
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // (Optional) Allow user to record again after finishing
  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setRecordingState("idle");
    // Reinitialize the camera stream if needed
    // For example, you could trigger a reload of the component or call initStream() again.
  };

  return (
    <div className="question-detail-container">
      <h2 className="question-heading">{question}</h2>

      <div className="video-container">
        {/* Live camera feed */}
        <video ref={videoRef} autoPlay muted className="camera-preview" />
      </div>

      <div className="controls-container">
        {recordingState === "idle" && (
          <button onClick={handleRecord}>Record</button>
        )}

        {recordingState === "recording" && (
          <>
            <button onClick={handlePauseResume}>Pause</button>
            <button onClick={handleFinish}>Finish</button>
          </>
        )}

        {recordingState === "paused" && (
          <>
            <button onClick={handlePauseResume}>Resume</button>
            <button onClick={handleFinish}>Finish</button>
          </>
        )}

        {recordingState === "finished" && (
          <>
            <p>Recording finished.</p>
            <button onClick={handleRecordAgain}>Record again</button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
