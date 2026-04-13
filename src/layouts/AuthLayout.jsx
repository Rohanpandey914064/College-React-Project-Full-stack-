import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

const AuthLayout = ({ children }) => (
  <div className="auth-layout">
    {/* Background gradient orbs */}
    <div
      className="auth-bg-orb"
      style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        top: -150, right: -150,
      }}
    />
    <div
      className="auth-bg-orb"
      style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
        bottom: -100, left: -100,
      }}
    />

    {/* Theme toggle in corner */}
    <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 10 }}>
      <ThemeToggle />
    </div>

    {/* Content */}
    <div className="auth-card">
      {children}
    </div>
  </div>
);

export default AuthLayout;
