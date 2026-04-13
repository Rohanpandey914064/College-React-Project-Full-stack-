import React from 'react';

const StatCard = ({ icon, value, label, color = 'var(--clr-indigo)', colorLight }) => {
  const bgLight = colorLight ?? `${color}1e`;

  return (
    <div className="card stat-card">
      <div
        className="stat-card-icon"
        style={{ background: bgLight, color }}
      >
        {icon}
      </div>
      <div>
        <div className="stat-card-value" style={{ color }}>
          {value}
        </div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
