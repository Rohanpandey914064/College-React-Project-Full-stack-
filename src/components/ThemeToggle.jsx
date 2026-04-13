import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-thumb">
        <span style={{ fontSize: '11px', lineHeight: 1 }}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
