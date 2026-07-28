import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import StoryPage from './pages/StoryPage';
import GeneratePage from './pages/GeneratePage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
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
            <Route
              path="/how-it-works"
              element={
                <RequireAuth>
                  <HowItWorksPage />
                </RequireAuth>
              }
            />
            <Route
              path="/about"
              element={
                <RequireAuth>
                  <AboutPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
