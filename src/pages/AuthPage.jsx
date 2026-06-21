import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const result =
      mode === 'signin'
        ? await login(cleanEmail, password)
        : await register(cleanName, cleanEmail, password);

    setSubmitting(false);

    if (result?.ok) {
      navigate('/dashboard');
    } else {
      setError(result?.message || 'Something went wrong');
    }
  }

  return (
    <div className="screen">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="eyebrow">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </div>

          <h1 style={{ margin: '6px 0 26px', fontSize: 24 }}>
            {mode === 'signin' ? 'Sign in to Wayfarer' : 'Join Wayfarer'}
          </h1>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
              style={{ marginTop: 10 }}
            >
              {submitting
                ? 'Please wait…'
                : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'signin' ? (
              <>
                New to Wayfarer?{' '}
                <button type="button" onClick={() => switchMode('signup')}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}