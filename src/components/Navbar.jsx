import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { X, Menu, LayoutDashboard, Trophy, User } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { to: '/profile',     label: 'Profile',     Icon: User },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo — always goes to Home */}
          <div
            className="navbar-logo"
            onClick={() => navigate('/')}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            ⚡ Quiz<span className="logo-dot">Master</span>
          </div>

          {/* Desktop nav links */}
          <div className="navbar-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="navbar-actions">
            <ThemeToggle />

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <div className="avatar" title={user.username}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  title="Logout"
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setOpen(false)} />
          <div className="mobile-nav-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
              <div className="navbar-logo" style={{ cursor: 'default' }}>
                ⚡ Quiz<span className="logo-dot">Master</span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setOpen(false)}
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {NAV_LINKS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <Icon size={16} /> {label}
                </span>
              </NavLink>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-6)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <ThemeToggle />
                <span style={{ fontSize: '0.85rem', color: 'var(--txt-2)' }}>Toggle theme</span>
              </div>
              {user && (
                <button className="btn btn-danger btn-block" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
