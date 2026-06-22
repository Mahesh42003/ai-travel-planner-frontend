import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('wayfarer_token'));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        console.error('Session invalid:', err);
        setToken(null);
        setUser(null);
        localStorage.removeItem('wayfarer_token');
      } finally {
        setInitializing(false);
      }
    }
    bootstrap();
  }, []); // ← FIXED: empty array, runs once only

  function persistSession(data) {
    localStorage.setItem('wayfarer_token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persistSession(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: extractErrorMessage(err, 'Could not sign in.') };
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persistSession(data);
      return { ok: true };
    } catch (error) {
      let message = extractErrorMessage(error, 'Registration failed.');
      if (error?.response?.status === 409) {
        message = 'This email is already registered. Please log in instead.';
      }
      return { ok: false, message };
    }
  }

  function logout() {
    localStorage.removeItem('wayfarer_token');
    setToken(null);
    setUser(null);
  }

  const value = { user, token, isAuthenticated: Boolean(token), initializing, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}