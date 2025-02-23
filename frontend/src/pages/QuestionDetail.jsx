import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuestionDetail.css";

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

  const [stream, setStream] = useState(null);
  const streamRef = useRef(null);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const [recordingState, setRecordingState] = useState("idle");

  const videoRef = useRef(null);
  const playbackRef = useRef(null);

  useEffect(() => {
    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream;
        setStream(userStream);

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (error) {
        console.error("Error accessing camera or microphone", error);
      }
    };

    initStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
      }
    };
  }, []);

  const handleRecord = () => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setRecordedChunks([]);
    setRecordingState("recording");

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.start();
  };

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

  const handleFinish = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecordingState("finished");

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setRecordingState("idle");

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = userStream;
        setStream(userStream);

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (error) {
        console.error("Error accessing camera or microphone", error);
      }
    };

    initStream();
  };

  const handleGrade = async () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);
    formData.append("question", question);

    try {
      const response = await fetch("http://127.0.0.1:5000/grade", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(`Grade received: ${data.grade}`);
    } catch (error) {
      console.error("Error submitting video for grading", error);
      alert("Failed to submit video for grading.");
    }
  };

  return (
    <div className="question-detail-container">
      <h2 className="question-heading">{question}</h2>

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
            <button onClick={handleGrade}>Grade</button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
