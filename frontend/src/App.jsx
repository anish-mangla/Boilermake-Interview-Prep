// src/App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from './contexts/GlobalContext';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UploadResume from './pages/UploadResume';
import PracticeQuestions from "./pages/PracticeQuestions";
import QuestionDetail from "./pages/QuestionDetail";
import ReviewPerformance from './pages/ReviewPerformance';
import PersonalInterview from "./pages/PersonalInterview";
import DetailedFeedback from './pages/DetailedFeedback';

import './App.css';
import MockInterview from './pages/MockInterview';

function App() {
  return (
    <GlobalProvider> 
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          {/* NEW: Upload Resume route */}
          <Route path="/upload-resume" element={<UploadResume />} />
          <Route path="/practice-questions" element={<PracticeQuestions />} />
          <Route path="/personal-interview" element={<PersonalInterview />} />
          <Route path="/mock-interview" element={<MockInterview />} />

          {/* Notice the dynamic URL segment :questionIndex */}
        <Route path="/practice-questions/:questionIndex" element={<QuestionDetail />} />
        <Route path="/review-performance" element={<ReviewPerformance />} />

        <Route path="/feedback" element={<DetailedFeedback />} />

        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
