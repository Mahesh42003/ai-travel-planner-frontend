import React from 'react';

function starsFor(rating) {
  const score = parseFloat(rating) || 0;
  const full = Math.round(score);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

export default function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="hotel-thumb"></div>
      <div>
        <div className="hotel-name">{hotel.name}</div>
        <div className="hotel-tier">
          {hotel.tier} {hotel.estimatedCostNightUSD ? `· $${hotel.estimatedCostNightUSD}/night` : ''}
        </div>
      </div>
      <div className="stars">{starsFor(hotel.rating)}</div>
    </div>
  );
}
