import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    // If no token is found in our context, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If a token is found, show the protected page content
  return children;
}

export default ProtectedRoute;