import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('asw_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('asw_token'));

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('asw_token', data.token);
    localStorage.setItem('asw_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await authApi.register(username, email, password);
    localStorage.setItem('asw_token', data.token);
    localStorage.setItem('asw_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('asw_token');
    localStorage.removeItem('asw_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
