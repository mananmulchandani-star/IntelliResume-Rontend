// App.jsx - UPDATED WITH CONTACT PAGE
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import DashboardPage from './components/DashboardPage';
import EditorPage from './components/EditorPage';
import ContactPage from './components/ContactPage'; // ✅ ADDED CONTACT PAGE
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import PrivacyPage from './components/PrivacyPage';
import FaqPage from './components/FaqPage';
import AdminPortal from './components/AdminPortal';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPage from './components/DebugPage';
import Homepage from './components/Homepage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPassword from './components/ForgotPassword';
import AuthCallback from './components/AuthCallback';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<ContactPage />} /> {/* ✅ ADDED CONTACT PAGE */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/faq" element={<FaqPage />} />
              
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
