import React from 'react';

export default function PackingList({ items, onToggle, onRegenerate, regenerating }) {
  return (
    <>
      <div className="section-label">
        <h2 style={{ fontSize: 16, margin: 0 }}>Packing checklist</h2>
        <span className="line"></span>
        <button className="icon-btn" title="Regenerate packing list" onClick={onRegenerate} disabled={regenerating}>
          ↻
        </button>
      </div>

      {!items || items.length === 0 ? (
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          No packing list yet.
        </p>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className={`packing-card ${item.isPacked ? 'packed' : ''}`}
            onClick={() => onToggle(item._id, !item.isPacked)}
          >
            <input type="checkbox" checked={item.isPacked} readOnly />
            <span className="item-name">{item.item}</span>
            <span className="cat">{item.category}</span>
          </div>
        ))
      )}
    </>
  );
}
