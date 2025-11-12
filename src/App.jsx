import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';
import EditorPage from './components/EditorPage';
import AdminPortal from './components/AdminPortal';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPage from './components/DebugPage';
import { AuthProvider } from './contexts/AuthContext'; // Add this import
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider> {/* Add this wrapper */}
        <Router>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </Router>
      </AuthProvider> {/* Close the wrapper */}
    </ErrorBoundary>
  );
}

export default App;
