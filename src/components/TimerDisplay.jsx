import React from 'react';
import { Clock } from 'lucide-react';

const fmt = (secs) => {
  if (secs == null || secs < 0) return '--:--';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const TimerDisplay = ({ seconds, totalSeconds }) => {
  const ratio   = totalSeconds > 0 ? seconds / totalSeconds : 1;
  const isWarn  = ratio <= 0.3 && ratio > 0.1;
  const isDanger = ratio <= 0.1;

  const cls = isDanger ? 'danger' : isWarn ? 'warn' : '';

  return (
    <div className={`timer-display ${cls}`}>
      <Clock size={15} />
      <span>{fmt(seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
