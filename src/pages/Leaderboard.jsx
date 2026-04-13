import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../utils/storage';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import quizData from '../data/quizData';

const CATEGORIES = ['All', ...quizData.map((c) => c.name)];

const fmtTime = (secs) => {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const rankClass = (i) => {
  if (i === 0) return 'gold';
  if (i === 1) return 'silver';
  if (i === 2) return 'bronze';
  return '';
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const all = getLeaderboard();
  const entries = (filter === 'All'
    ? all
    : all.filter((e) => e.category === filter)
  )
    .slice()
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
    .slice(0, 50);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Header */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
            <Trophy size={22} color="var(--clr-amber)" />
            <h1 style={{ fontSize: '1.6rem' }}>Leaderboard</h1>
          </div>
          <p>Top quiz attempts sorted by score and accuracy.</p>
        </div>

        {/* Category filter */}
        <div
          style={{
            display: 'flex', gap: 'var(--sp-2)',
            flexWrap: 'wrap', marginBottom: 'var(--sp-5)',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="No attempts yet"
            description="Complete a quiz to see your scores here."
            action={
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Start a Quiz
              </button>
            }
          />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr key={entry.attemptId ?? i}>
                      <td>
                        <span className={`rank-badge ${rankClass(i)}`}>
                          {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'var(--clr-indigo-dim)', color: 'var(--clr-indigo)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                          }}>
                            {entry.username?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span style={{ fontWeight: 600 }}>{entry.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className="pill">{entry.category}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--clr-indigo)' }}>
                          {entry.score}/{entry.total}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 600,
                          color: entry.accuracy >= 70 ? 'var(--clr-emerald)' : entry.accuracy >= 50 ? 'var(--clr-amber)' : 'var(--clr-rose)',
                        }}>
                          {entry.accuracy}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--txt-2)', fontSize: '0.85rem' }}>
                        {fmtTime(entry.timeTaken)}
                      </td>
                      <td style={{ color: 'var(--txt-3)', fontSize: '0.82rem' }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Leaderboard;
