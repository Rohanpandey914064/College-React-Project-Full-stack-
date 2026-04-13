import React from 'react';

const ProgressBar = ({ current, total, label }) => {
  const pct = Math.round(((current) / total) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      {label !== false && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.78rem', color: 'var(--txt-2)', fontWeight: 500
        }}>
          <span>{label ?? `Question ${current} of ${total}`}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
