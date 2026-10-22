import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Route wrapper that ensures only authenticated users can access the route.
 * Redirects unauthenticated visitors to /login.
 */
export function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Route wrapper that ensures already authenticated users are redirected away
 * from public pages (like /login or /register) to /chat.
 */
export function PublicRoute({ children }) {
  const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
