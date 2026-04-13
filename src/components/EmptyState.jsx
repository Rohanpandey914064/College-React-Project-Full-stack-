import React from 'react';

const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div>
      <h3 style={{ marginBottom: '8px', color: 'var(--txt-1)' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.9rem', maxWidth: '320px' }}>{description}</p>}
    </div>
    {action && <div style={{ marginTop: 'var(--sp-4)' }}>{action}</div>}
  </div>
);

export default EmptyState;
