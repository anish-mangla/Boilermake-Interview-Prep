import React, { useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext"; 
import "./UploadResume.css";

const UploadResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useContext(GlobalContext); // ✅ Get the logged-in user

  const handleFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && file.type !== "application/pdf") {
      alert("❌ Only PDF files are allowed.");
      console.error("❌ Invalid file type:", file.type);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file before uploading.");
      console.error("❌ No file selected");
      return;
    }

    if (!user || !user.email) {
      alert("⚠️ User information missing. Please log in again.");
      console.error("⚠️ No user email found");
      return;
    }

    console.log("📤 Uploading file:", selectedFile);
    console.log("📧 Sending email:", user.email);

    const formData = new FormData();
    formData.append("email", user.email); // ✅ Send email automatically
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📜 Response Data:", data);

      if (response.ok) {
        alert("✅ Resume updated successfully!");
      } else {
        console.error("❌ Server Error:", data.message);
        alert(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("⚠️ Fetch Error:", err);
      alert("An error occurred while updating the resume.");
    }
  };

  return (
    <div className="upload-resume-container">
      <h2 className="upload-resume-heading">Upload Your Resume</h2>
      <p className="upload-resume-subtitle">
        Drag and drop your PDF resume or click to upload
      </p>

      <div
        className="upload-drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];

          if (file && file.type !== "application/pdf") {
            alert("❌ Only PDF files are allowed.");
            console.error("❌ Invalid file type:", file.type);
            setSelectedFile(null);
            return;
          }

          setSelectedFile(file);
        }}
      >
        <input
          type="file"
          id="resumeFile"
          className="file-input"
          accept="application/pdf"
          onChange={handleFileSelect}
        />
        <label htmlFor="resumeFile" className="drop-area-label">
          {selectedFile ? <span>{selectedFile.name}</span> : <span>Drop your PDF resume here or click to upload</span>}
        </label>
      </div>

      <button className="upload-resume-button" onClick={handleUpload}>
        Upload Now
      </button>
    </div>
  );
};

export default UploadResume;
