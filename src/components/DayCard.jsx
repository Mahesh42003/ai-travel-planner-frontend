import React, { useState } from 'react';

export default function DayCard({ day, busy, onAddActivity, onRemoveActivity, onDeleteDay, onRegenerateDay }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [regenHint, setRegenHint] = useState('');

  function submitAddActivity(e) {
    e.preventDefault();
    if (!newActivity.trim()) return;
    onAddActivity(day.dayNumber, { title: newActivity.trim() });
    setNewActivity('');
    setShowAddForm(false);
  }

  function submitRegenerate(e) {
    e.preventDefault();
    onRegenerateDay(day.dayNumber, regenHint.trim());
    setRegenHint('');
  }

  return (
    <div className="day-card" style={{ opacity: busy ? 0.5 : 1 }}>
      <div className="day-head">
        <div className="day-title">
          Day {day.dayNumber}
          {day.title ? ` — ${day.title}` : ''}
        </div>
        <div className="day-actions">
          <button
            className="icon-btn"
            title="Regenerate day"
            disabled={busy}
            onClick={() => onRegenerateDay(day.dayNumber, '')}
          >
            ↻
          </button>
          <button className="icon-btn" title="Delete day" disabled={busy} onClick={() => onDeleteDay(day.dayNumber)}>
            ✕
          </button>
        </div>
      </div>

      {day.activities.map((activity) => (
        <div className="activity" key={activity._id}>
          <div className="dot"></div>
          <div>
            {activity.title}
            {(activity.description || activity.estimatedCostUSD) && (
              <span className="meta">
                {activity.timeOfDay ? `${activity.timeOfDay} · ` : ''}
                {activity.estimatedCostUSD ? `$${activity.estimatedCostUSD}` : ''}
                {activity.description ? ` · ${activity.description}` : ''}
              </span>
            )}
          </div>
          <button className="remove" disabled={busy} onClick={() => onRemoveActivity(day.dayNumber, activity._id)}>
            remove
          </button>
        </div>
      ))}

      {showAddForm ? (
        <form className="add-activity-form" onSubmit={submitAddActivity}>
          <input
            type="text"
            autoFocus
            placeholder="e.g. Visit the night market"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <button type="submit" className="btn btn-dark" disabled={busy}>
            Add
          </button>
        </form>
      ) : (
        <button className="add-activity" onClick={() => setShowAddForm(true)} disabled={busy}>
          + Add activity
        </button>
      )}

      <form className="regen-row" onSubmit={submitRegenerate}>
        <input
          type="text"
          placeholder="Regenerate this day with more outdoor activities…"
          value={regenHint}
          onChange={(e) => setRegenHint(e.target.value)}
        />
        <button type="submit" className="btn btn-dark" disabled={busy}>
          Regenerate
        </button>
      </form>
    </div>
  );
}
