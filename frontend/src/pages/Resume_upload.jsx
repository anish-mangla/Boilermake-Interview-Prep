import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Resume uploaded successfully!");
        navigate("/results", { state: { extractedText: data.extracted_text } });
      } else {
        const error = await response.json();
        alert(error.message || "Upload failed.");
      }
    } catch (err) {
      alert(err.message || "An unexpected error occurred during upload.");
    }
    
    setUploading(false);
  };

  return (
    <div className="resume-upload-container">
      <h1 className="resume-upload-title">Upload Your Resume</h1>
      <form className="resume-upload-form" onSubmit={handleUpload}>
        <label htmlFor="resume" className="resume-upload-label">
          Select a PDF file:
        </label>
        <input
          id="resume"
          type="file"
          className="resume-upload-input"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" className="resume-upload-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
