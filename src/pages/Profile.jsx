import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/EmptyState';
import quizData from '../data/quizData';
import { LogOut, User, Calendar, BarChart2, Target, Zap, BookOpen } from 'lucide-react';

const StatRow = ({ label, value, color = 'var(--txt-1)' }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 'var(--sp-3) 0',
    borderBottom: '1px solid var(--border)',
  }}>
    <span style={{ fontSize: '0.9rem', color: 'var(--txt-2)' }}>{label}</span>
    <span style={{ fontWeight: 700, color }}>{value}</span>
  </div>
);

const Profile = () => {
  const { user, stats, logout } = useAuth();
  const navigate                = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avgScore = stats.totalQuizzes > 0
    ? Math.round((stats.totalScore / (stats.totalQuestions || 1)) * 100)
    : 0;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}
      >
        {/* User card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', flexWrap: 'wrap' }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'var(--clr-indigo-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'var(--clr-indigo)',
            flexShrink: 0,
          }}>
            {user?.username?.[0]?.toUpperCase() ?? <User size={32} />}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 4 }}>{user?.username}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--txt-3)' }}>
              <Calendar size={13} />
              Joined {new Date(user?.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Overall stats */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <BarChart2 size={18} color="var(--clr-indigo)" /> Overall Stats
          </h3>
          <StatRow label="Total Quizzes Taken"  value={stats.totalQuizzes} />
          <StatRow label="Average Score"         value={`${avgScore}%`}       color="var(--clr-indigo)" />
          <StatRow label="Best Accuracy"         value={`${stats.bestAccuracy}%`} color="var(--clr-emerald)" />
          <StatRow label="Day Streak"            value={`${stats.streak} 🔥`} color="var(--clr-rose)" />
          <StatRow label="Last Played"           value={
            stats.lastPlayedDate
              ? new Date(stats.lastPlayedDate).toLocaleDateString()
              : '—'
          } />
        </div>

        {/* Category breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <BookOpen size={18} color="var(--clr-indigo)" /> Category Breakdown
          </h3>
          {Object.keys(stats.categoryStats ?? {}).length === 0 ? (
            <EmptyState
              icon="📊"
              title="No data yet"
              description="Complete quizzes to see your per-category performance."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {quizData.map((cat) => {
                const cs = stats.categoryStats?.[cat.name];
                if (!cs) return null;
                const catAcc = cs.totalQuestions > 0
                  ? Math.round((cs.totalScore / cs.totalQuestions) * 100)
                  : 0;
                return (
                  <div key={cat.id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                    padding: 'var(--sp-3) var(--sp-4)',
                    background: 'var(--bg-raised)',
                    borderRadius: 'var(--r-md)',
                    borderLeft: `3px solid ${cat.color}`,
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--txt-3)' }}>
                        {cs.quizzes} quiz{cs.quizzes > 1 ? 'zes' : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: cat.color }}>{catAcc}%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--txt-3)' }}>accuracy</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Profile;
