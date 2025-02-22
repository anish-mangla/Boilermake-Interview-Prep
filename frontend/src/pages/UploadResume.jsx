import React, { useState } from "react";
import "./UploadResume.css";

const UploadResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection (via click or drag)
  const handleFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  // Optional: handle form submission
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }
    // Here you can send the file to your server or API
    console.log("Uploading file:", selectedFile);
  };

  // Optional: handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
  };

  return (
    <div className="upload-resume-container">
      {/* Heading instead of a button */}
      <h2 className="upload-resume-heading">Upload Your Resume</h2>
      <p className="upload-resume-subtitle">
        Drag and drop your resume or click to upload
      </p>

      {/* Drag-and-drop area */}
      <div
        className="upload-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Hidden file input for clicks */}
        <input
          type="file"
          id="resumeFile"
          className="file-input"
          onChange={handleFileSelect}
        />
        <label htmlFor="resumeFile" className="drop-area-label">
          {selectedFile ? (
            <span>{selectedFile.name}</span>
          ) : (
            <span>Drop your resume here or click to upload</span>
          )}
        </label>
      </div>

      {/* Upload Button */}
      <button className="upload-resume-button" onClick={handleUpload}>
        Upload Now
      </button>
    </div>
  );
};

export default UploadResume;
