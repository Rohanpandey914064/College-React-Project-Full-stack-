import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { getResult } from '../utils/storage';
import MainLayout from '../layouts/MainLayout';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

const perfLabel = (pct) => {
  if (pct >= 90) return { text: 'Excellent! 🏆', color: 'var(--clr-indigo)' };
  if (pct >= 70) return { text: 'Good Job! 👍', color: 'var(--clr-emerald)' };
  if (pct >= 50) return { text: 'Keep Going! 💪', color: 'var(--clr-amber)' };
  return { text: 'Needs Practice 📚', color: 'var(--clr-rose)' };
};

const fmtTime = (secs) => {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

// SVG Score Ring
const ScoreRing = ({ pct, color }) => {
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="result-score-ring">
      <svg width={128} height={128} viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-raised)" strokeWidth={10} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="result-score-text">
        <span style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--txt-3)', fontWeight: 500 }}>SCORE</span>
      </div>
    </div>
  );
};

const Result = () => {
  const navigate   = useNavigate();
  const { saveScore } = useAuth();
  const result = getResult();

  useEffect(() => {
    if (!result) return;
    saveScore({
      attemptId: result.attemptId,
      category:  result.categoryName,
      score:     result.score,
      total:     result.totalQuestions,
      timeTaken: result.timeTaken,
    });

    const pct = Math.round((result.score / result.totalQuestions) * 100);
    if (pct >= 70) {
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: 'var(--sp-16)' }}>
          <h2>No recent quiz result found.</h2>
          <button className="btn btn-primary" style={{ marginTop: 'var(--sp-4)' }} onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  const pct    = Math.round((result.score / result.totalQuestions) * 100);
  const perf   = perfLabel(pct);
  const qs     = result.questions || [];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}
      >
        {/* Score Card */}
        <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-10)' }}>
          <div style={{ marginBottom: 'var(--sp-2)' }}>
            <Trophy size={28} color="var(--clr-amber)" style={{ margin: '0 auto var(--sp-3)' }} />
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-1)', color: perf.color }}>
              {perf.text}
            </h1>
            <p style={{ fontSize: '0.9rem' }}>
              {result.categoryName} Quiz
            </p>
          </div>

          <ScoreRing pct={pct} color={perf.color} />

          {/* Stats row */}
          <div
            style={{
              display: 'flex', justifyContent: 'center',
              gap: 'var(--sp-8)', marginTop: 'var(--sp-6)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--txt-1)' }}>
                {result.score}/{result.totalQuestions}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Correct
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--txt-1)' }}>
                {result.totalQuestions - result.score}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Wrong
              </div>
            </div>
            {result.timeTaken > 0 && (
              <>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--txt-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={18} /> {fmtTime(result.timeTaken)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Time Taken
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-3)', marginTop: 'var(--sp-8)', flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost"
              onClick={() => navigate(`/quiz-setup/${result.categoryId}`)}
            >
              <RotateCcw size={16} /> Retake
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              <Home size={16} /> Dashboard
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/leaderboard')}>
              View Leaderboard
            </button>
          </div>
        </div>

        {/* Detailed Review */}
        {qs.length > 0 && (
          <div>
            <div className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>
              Detailed Review
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {qs.map((q, idx) => {
                const userAns   = result.answers[idx];
                const isCorrect = userAns === q.answer;
                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      borderLeft: `4px solid ${isCorrect ? 'var(--clr-emerald)' : 'var(--clr-rose)'}`,
                      padding: 'var(--sp-5)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)', gap: 'var(--sp-3)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--txt-1)', flex: 1 }}>
                        <span style={{ color: 'var(--txt-3)', fontSize: '0.82rem', marginRight: 8 }}>Q{idx + 1}.</span>
                        {q.question}
                      </div>
                      {isCorrect
                        ? <CheckCircle2 size={20} color="var(--clr-emerald)" style={{ flexShrink: 0 }} />
                        : <XCircle     size={20} color="var(--clr-rose)" style={{ flexShrink: 0 }} />
                      }
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                      {q.options.map((opt, oi) => {
                        const isUserPick = opt === userAns;
                        const isRight    = opt === q.answer;
                        let bg    = 'transparent';
                        let color = 'var(--txt-2)';
                        let border = 'var(--border)';
                        if (isRight)    { bg = 'rgba(16,185,129,0.1)'; color = 'var(--clr-emerald)'; border = 'var(--clr-emerald)'; }
                        if (isUserPick && !isRight) { bg = 'rgba(244,63,94,0.1)'; color = 'var(--clr-rose)'; border = 'var(--clr-rose)'; }
                        return (
                          <div key={opt} style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                            padding: 'var(--sp-2) var(--sp-3)',
                            borderRadius: 'var(--r-sm)',
                            border: `1px solid ${border}`,
                            background: bg, color,
                            fontSize: '0.88rem',
                          }}>
                            <span style={{
                              minWidth: 22, height: 22, borderRadius: '50%',
                              background: isRight ? 'var(--clr-emerald)' : isUserPick ? 'var(--clr-rose)' : 'var(--bg-overlay)',
                              color: (isRight || isUserPick) ? '#fff' : 'var(--txt-3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                            }}>
                              {LETTERS[oi]}
                            </span>
                            {opt}
                            {isRight    && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600 }}>✓ Correct</span>}
                            {isUserPick && !isRight && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600 }}>✗ Your Pick</span>}
                          </div>
                        );
                      })}
                      {!userAns && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--txt-3)', marginTop: 4 }}>
                          Not attempted / Timed out
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Result;
