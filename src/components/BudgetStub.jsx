import React from 'react';

export default function BudgetStub({ budget }) {
  if (!budget) return null;

  return (
    <div className="stub">
      <div className="stub-head">
        <div>
          <div className="eyebrow" style={{ color: '#D7D2C2' }}>
            Total estimated
          </div>
          <div className="stub-total">${budget.total ?? 0}</div>
        </div>
        <div style={{ fontSize: 24 }}>🧾</div>
      </div>
      <div className="stub-perf"></div>
      <div className="stub-lines">
        <div className="stub-line">
          <span>Transport</span>
          <b>${budget.transport ?? 0}</b>
        </div>
        <div className="stub-line">
          <span>Accommodation</span>
          <b>${budget.accommodation ?? 0}</b>
        </div>
        <div className="stub-line">
          <span>Food</span>
          <b>${budget.food ?? 0}</b>
        </div>
        <div className="stub-line">
          <span>Activities</span>
          <b>${budget.activities ?? 0}</b>
        </div>
      </div>
    </div>
  );
}
