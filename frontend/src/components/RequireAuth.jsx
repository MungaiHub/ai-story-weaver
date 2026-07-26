import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}
