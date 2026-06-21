import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="topbar">
      <Link to={isAuthenticated ? '/dashboard' : '/auth'} className="brand">
        <span className="mark">✈</span> Wayfarer
      </Link>

      {isAuthenticated && (
        <div className="nav-tabs">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/trips/new" className={location.pathname === '/trips/new' ? 'active' : ''}>
            New trip
          </Link>
        </div>
      )}

      {isAuthenticated ? (
        <div className="user-chip">
          <span className="avatar">{initials || 'U'}</span>
          <span>{user?.name}</span>
          <button className="btn-logout" onClick={logout}>
            Log out
          </button>
        </div>
      ) : (
        <Link to="/auth" className="btn btn-ghost">
          Sign in
        </Link>
      )}
    </div>
  );
}
