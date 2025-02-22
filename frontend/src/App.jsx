// src/App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from './contexts/GlobalContext';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import ResumeUpload from './pages/Resume_upload';
import './App.css';

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
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
