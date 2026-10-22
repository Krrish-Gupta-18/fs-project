import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';

function HomeRedirect() {
  const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');
  return <Navigate to={token ? '/chat' : '/login'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root URL: redirect to /login if unauthenticated, or /chat if logged in */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Authentication Routes: public only, redirect to /chat if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Chat Dashboard Routes: protected by authentication */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
