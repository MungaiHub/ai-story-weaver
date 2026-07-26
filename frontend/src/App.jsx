import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import StoryPage from './pages/StoryPage';
import GeneratePage from './pages/GeneratePage';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/generate"
              element={
                <RequireAuth>
                  <GeneratePage />
                </RequireAuth>
              }
            />
            <Route
              path="/story/:storyId"
              element={
                <RequireAuth>
                  <StoryPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
