// App.jsx - UPDATED
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeProvider'; // ✅ Now this file exists
import DashboardPage from './components/DashboardPage';
import EditorPage from './components/EditorPage';
import AdminPortal from './components/AdminPortal';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPage from './components/DebugPage';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPassword from './components/ForgotPassword'; // ✅ Added import
import AuthCallback from './components/AuthCallback';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider> {/* ✅ Now ThemeProvider wraps everything */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Added route */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/debug" element={<DebugPage />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
