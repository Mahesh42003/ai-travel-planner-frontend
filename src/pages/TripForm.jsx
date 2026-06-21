import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractErrorMessage } from '../api/client';

const INTEREST_OPTIONS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nightlife', 'Nature'];
const BUDGET_OPTIONS = ['Low', 'Medium', 'High'];

export default function TripForm() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [budgetTier, setBudgetTier] = useState('Medium');
  const [interests, setInterests] = useState(['Food', 'Culture']);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  function toggleInterest(interest) {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    const days = Number(durationDays);
    if (!Number.isInteger(days) || days < 1 || days > 30) {
      setError('Number of days must be between 1 and 30.');
      return;
    }

    setGenerating(true);
    try {
      const { data } = await api.post('/trips', {
        destination: destination.trim(),
        durationDays: days,
        budgetTier,
        interests,
      });
      navigate(`/trips/${data._id}`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not generate your itinerary. Please try again.'));
      setGenerating(false);
    }
  }

  return (
    <div className="screen">
      <div className="form-shell">
        <div className="eyebrow">Step 1 of 1</div>
        <h1 style={{ margin: '6px 0 26px', fontSize: 24 }}>Tell us about the trip</h1>

        {error && <div className="error-banner">{error}</div>}
        {generating && (
          <div className="ai-banner">
            <span className="dotpulse"></span> AI agent is generating your itinerary, budget, and packing list…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row2">
            <div className="field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="e.g. Tokyo, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={generating}
              />
            </div>
            <div className="field">
              <label>Number of days</label>
              <input
                type="number"
                min={1}
                max={30}
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                disabled={generating}
              />
            </div>
          </div>

          <div className="field">
            <label>Budget type</label>
            <div className="budget-row">
              {BUDGET_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  className={`budget-opt ${budgetTier === opt ? 'selected' : ''}`}
                  onClick={() => !generating && setBudgetTier(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Interests</label>
            <div className="chip-group">
              {INTEREST_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  className={`chip ${interests.includes(opt) ? 'selected' : ''}`}
                  onClick={() => !generating && toggleInterest(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 10 }} disabled={generating}>
            {generating ? 'Generating…' : 'Generate itinerary →'}
          </button>
        </form>
      </div>
    </div>
  );
}
