import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('wayfarer_token'));
  const [initializing, setInitializing] = useState(true);

  // On first load, if a token is cached, verify it's still valid and
  // fetch the current user rather than trusting stale localStorage data.
  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        setToken(null);
        localStorage.removeItem('wayfarer_token');
      } finally {
        setInitializing(false);
      }
    }
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  if (error.response && error.response.status === 409) {
    alert("This email is already registered. Please try logging in or use a different email.");
  } else {
    // Handle other errors (500, 400, etc.)
    console.error("Registration failed", error);
  }
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
