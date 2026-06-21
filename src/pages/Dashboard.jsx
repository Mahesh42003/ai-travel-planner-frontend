import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../api/client';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load your trips.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e, tripId) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this trip.'));
    }
  }

  return (
    <div className="screen">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Your itineraries</div>
          <h1 style={{ margin: '6px 0 0', fontSize: 26 }}>Dashboard</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
          + Plan a new trip
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="eyebrow">Loading your trips…</p>
      ) : (
        <div className="dash-grid">
          {trips.map((trip) => (
            <Link to={`/trips/${trip._id}`} className="pass" key={trip._id}>
              <div className="pass-top">
                <div className="pass-route">
                  <span>YOU</span>
                  <span className="dash"></span>
                  <span>{trip.destination}</span>
                </div>
                <div className="pass-meta">
                  <span>{trip.durationDays} days</span>
                  <span>{new Date(trip.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="pass-perf"></div>
              <div className="pass-bottom">
                <span className={`tag ${trip.budgetTier.toLowerCase()}`}>{trip.budgetTier} budget</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
                  ${trip.estimatedBudget?.total ?? 0}
                </span>
              </div>
              <button
                className="btn-logout"
                style={{ position: 'absolute', top: 12, right: 12 }}
                onClick={(e) => handleDelete(e, trip._id)}
              >
                Delete
              </button>
            </Link>
          ))}

          <div className="new-trip-card" onClick={() => navigate('/trips/new')}>
            <div className="plus">+</div>
            Start a new itinerary
          </div>
        </div>
      )}
    </div>
  );
}
