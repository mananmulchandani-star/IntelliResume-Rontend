import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import the global providers
import { ResumeProvider } from "./context/ResumeContext";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import your AuthContext

// Import all your page components
import App from './App';
import HomePage from './components/HomePage';
import SignupPage from "./components/SignupPage";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/DashboardPage";
import EditorPage from "./components/EditorPage";

// Import the main CSS file
import './index.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/app" replace />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public-facing homepage */}
            <Route path="/" element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            } />

            {/* Standalone routes for authentication */}
            <Route path="/signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />
            <Route path="/auth" element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } />

            {/* Main application layout for logged-in users */}
            <Route path="/app" element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="editor" element={<EditorPage />} />
            </Route>

            {/* Catch all route - redirect to appropriate page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </AuthProvider>
  </React.StrictMode>
);