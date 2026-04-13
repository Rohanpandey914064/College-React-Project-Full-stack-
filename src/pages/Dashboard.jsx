import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../utils/storage';
import DashboardLayout from '../layouts/DashboardLayout';
import { BarChart2, Target, Zap, BookOpen } from 'lucide-react';
import quizData from '../data/quizData';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
};

const StatCard = ({ icon, value, label, color, bg }) => (
  <div className="card stat-card">
    <div
      className="stat-icon"
      style={{ background: bg, color }}
    >
      {icon}
    </div>
    <div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, stats } = useAuth();
  const leaderboard = getLeaderboard();

  const avgScore = stats.totalQuestions > 0
    ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
    : 0;

  // Recent 5 attempts (own entries)
  const myAttempts = leaderboard
    .filter((e) => e.username === user?.username)
    .slice(-5)
    .reverse();

  const STATS = [
    {
      icon: <BookOpen size={17} />, value: stats.totalQuizzes,
      label: 'Quizzes Taken',
      color: 'var(--clr-indigo)', bg: 'var(--clr-indigo-dim)',
    },
    {
      icon: <BarChart2 size={17} />, value: `${avgScore}%`,
      label: 'Avg Score',
      color: 'var(--clr-emerald)', bg: 'rgba(14,159,110,0.1)',
    },
    {
      icon: <Target size={17} />, value: `${stats.bestAccuracy}%`,
      label: 'Best Accuracy',
      color: 'var(--clr-amber)', bg: 'rgba(217,119,6,0.1)',
    },
    {
      icon: <Zap size={17} />, value: `${stats.streak}🔥`,
      label: 'Day Streak',
      color: 'var(--clr-rose)', bg: 'rgba(224,32,80,0.1)',
    },
  ];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show">

        {/* Greeting */}
        <motion.div variants={fadeUp} style={{ paddingTop: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--txt-3)', marginBottom: 'var(--sp-2)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)' }}>
            {greeting()}, <span style={{ color: 'var(--clr-indigo)' }}>{user?.username}</span> 👋
          </h1>
          <p style={{ marginTop: 'var(--sp-2)' }}>Here's how you're doing.</p>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={fadeUp}>
          <div className="section-title">Your Stats</div>
          <div className="grid-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </motion.div>

        {/* Per-category breakdown */}
        {Object.keys(stats.categoryStats ?? {}).length > 0 && (
          <motion.div variants={fadeUp} style={{ marginTop: 'var(--sp-10)' }}>
            <div className="section-title">Category Breakdown</div>
            <div className="grid-4">
              {quizData.map((cat) => {
                const cs = stats.categoryStats?.[cat.name];
                if (!cs) return null;
                const acc = cs.totalQuestions > 0
                  ? Math.round((cs.totalScore / cs.totalQuestions) * 100) : 0;
                return (
                  <div
                    key={cat.id}
                    className="card"
                    style={{ borderTop: `3px solid ${cat.color}` }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-3)' }}>{cat.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{cat.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--txt-3)', marginBottom: 'var(--sp-3)' }}>
                      {cs.quizzes} quiz{cs.quizzes > 1 ? 'zes' : ''}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.4rem', color: cat.color }}>{acc}%</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>accuracy</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent attempts */}
        {myAttempts.length > 0 && (
          <motion.div variants={fadeUp} style={{ marginTop: 'var(--sp-10)' }}>
            <div className="section-title">Recent Attempts</div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="attempts-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Accuracy</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAttempts.map((a, i) => (
                      <tr key={a.attemptId ?? i}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{a.category}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--clr-indigo)' }}>
                            {a.score}/{a.total}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 600,
                            color: a.accuracy >= 70
                              ? 'var(--clr-emerald)'
                              : a.accuracy >= 50 ? 'var(--clr-amber)' : 'var(--clr-rose)',
                          }}>
                            {a.accuracy}%
                          </span>
                        </td>
                        <td style={{ color: 'var(--txt-3)', fontSize: '0.82rem' }}>
                          {new Date(a.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {stats.totalQuizzes === 0 && (
          <motion.div variants={fadeUp} style={{ marginTop: 'var(--sp-10)' }}>
            <div
              className="card"
              style={{ textAlign: 'center', padding: 'var(--sp-12)', borderStyle: 'dashed' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-4)', opacity: 0.4 }}>📊</div>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>No quizzes yet</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: 'var(--sp-5)' }}>
                Head to Home, pick a category and take your first quiz.
              </p>
              <a href="/" className="btn btn-primary">Go to Home</a>
            </div>
          </motion.div>
        )}

      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
