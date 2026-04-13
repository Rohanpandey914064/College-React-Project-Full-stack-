import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import quizData from '../data/quizData';
import { useQuiz } from '../hooks/useQuiz';
import { saveResult } from '../utils/storage';
import Navbar from '../components/Navbar';
import { Flag, ChevronLeft, ChevronRight, CheckSquare, AlertTriangle, Clock, Infinity as InfinityIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const LETTERS = ['A', 'B', 'C', 'D'];

// Format seconds → MM:SS
const fmtTime = (secs) => {
  if (secs == null || secs < 0) return '--:--';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Determine timer CSS class
const timerClass = (secs, total) => {
  if (total == null) return '';
  const ratio = total > 0 ? secs / total : 1;
  if (ratio <= 0.1) return 'danger';
  if (ratio <= 0.3) return 'warn';
  return '';
};

// ── Submit confirmation modal ─────────────────────────────────────────────────
const SubmitModal = ({ answered, total, onConfirm, onCancel }) => {
  const left = total - answered;
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: 'var(--sp-4)' }}>🤔</div>
        <h3 style={{ marginBottom: 'var(--sp-3)' }}>Submit quiz?</h3>
        <p style={{ marginBottom: left > 0 ? 'var(--sp-2)' : 'var(--sp-6)', fontSize: '0.9rem' }}>
          You've answered <strong>{answered}</strong> of <strong>{total}</strong> questions.
        </p>
        {left > 0 && (
          <p style={{ color: 'var(--clr-amber)', fontSize: '0.85rem', marginBottom: 'var(--sp-6)' }}>
            {left} question{left > 1 ? 's' : ''} unanswered.
          </p>
        )}
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Continue</button>
          <button className="btn btn-primary" onClick={onConfirm}>Submit Now</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Quiz Component ───────────────────────────────────────────────────────
const Quiz = () => {
  const { categoryId } = useParams();
  const navigate       = useNavigate();
  const location       = useLocation();
  const [showModal, setShowModal] = useState(false);

  const category   = quizData.find((c) => c.id === parseInt(categoryId));
  const routeState = location.state || {};
  const config = {
    count:        routeState.count       ?? 10,
    duration:     routeState.duration    ?? null,
    difficulty:   routeState.difficulty  ?? 'all',
    attemptId:    routeState.attemptId   ?? `${categoryId}_${Date.now()}`,
    categoryId:   parseInt(categoryId),
    categoryName: category?.name ?? '',
  };

  const onComplete = ({ score, questions, selectedAnswers, timeTaken }) => {
    saveResult({
      attemptId:      config.attemptId,
      categoryId:     parseInt(categoryId),
      categoryName:   category?.name,
      score,
      totalQuestions: questions.length,
      timeTaken,
      answers:        selectedAnswers,
      questions,
    });
    navigate('/result');
  };

  const {
    questions, currentIndex, currentQuestion,
    selectedAnswers, flagged, timeLeft,
    answeredCount, progress,
    handleSelect, handleNext, handlePrev,
    handleFlag, goTo, finishQuiz,
  } = useQuiz(category?.questions ?? [], config, onComplete);

  if (!category) {
    return (
      <div className="app-root">
        <Navbar />
        <div style={{ textAlign: 'center', padding: 'var(--sp-16)' }}>
          <h2>Category not found</h2>
          <button className="btn btn-primary" style={{ marginTop: 'var(--sp-4)' }} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const isFlagged  = !!flagged[currentIndex];
  const isLast     = currentIndex === questions.length - 1;
  const pct        = Math.round(((currentIndex + 1) / questions.length) * 100);
  const cls        = config.duration != null ? timerClass(timeLeft, config.duration) : '';

  return (
    <div className="app-root">
      <Navbar />

      {/* Submit modal */}
      {showModal && (
        <SubmitModal
          answered={answeredCount}
          total={questions.length}
          onConfirm={finishQuiz}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* ── Sticky top bar ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar-left">
          {/* Category label */}
          <span style={{
            fontSize: '0.78rem', fontWeight: 700,
            color: 'var(--txt-3)', whiteSpace: 'nowrap',
          }}>
            {category.icon} {category.name}
          </span>

          {/* Progress */}
          <div className="progress-wrap">
            <div className="progress-label">
              {currentIndex + 1} / {questions.length}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Timer — ALWAYS VISIBLE */}
        {config.duration != null ? (
          <div className={`timer-chip ${cls}`}>
            <Clock size={14} />
            {fmtTime(timeLeft)}
          </div>
        ) : (
          <div className="no-timer-badge">
            <InfinityIcon size={13} /> Practice
          </div>
        )}
      </div>

      {/* ── Quiz content ── */}
      <div className="quiz-content page-enter">

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0,  opacity: 1 }}
            exit={{   x: -24, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="card">
              {/* Question number + flag btn */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 'var(--sp-5)',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--txt-3)' }}>
                  Question {currentIndex + 1}
                  {config.difficulty !== 'all' && (
                    <span className={`badge badge-${config.difficulty}`} style={{ marginLeft: 8 }}>
                      {config.difficulty}
                    </span>
                  )}
                </span>
                <button
                  className={`btn btn-sm ${isFlagged ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={handleFlag}
                  style={{ gap: 5 }}
                >
                  <Flag size={13} />
                  {isFlagged ? 'Flagged' : 'Flag'}
                </button>
              </div>

              {/* Question text */}
              <p className="question-text" style={{ marginBottom: 'var(--sp-6)' }}>
                {currentQuestion?.question}
              </p>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {currentQuestion?.options.map((opt, i) => {
                  const sel = selectedAnswers[currentIndex] === opt;
                  return (
                    <button
                      key={opt}
                      className={`option-btn${sel ? ' selected' : ''}`}
                      onClick={() => handleSelect(opt)}
                    >
                      <span className="opt-letter">{LETTERS[i]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question palette */}
        <div className="card card-flat" style={{ padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--sp-3)' }}>
            Question Palette · {answeredCount}/{questions.length} answered
          </div>
          <div className="qpalette">
            {questions.map((_, idx) => {
              const ans = selectedAnswers[idx] !== undefined;
              const flg = !!flagged[idx];
              const cur = idx === currentIndex;
              return (
                <button
                  key={idx}
                  className={`qpalette-btn${cur ? ' current' : ans ? ' answered' : flg ? ' flagged' : ''}`}
                  onClick={() => goTo(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="palette-legend">
            <span>🟦 Answered</span>
            <span>🟨 Flagged</span>
            <span>⬜ Unanswered</span>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="quiz-footer">
          <div className="quiz-footer-left">
            <button
              className="btn btn-ghost"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={17} /> Previous
            </button>
          </div>

          <div className="quiz-footer-right">
            {isLast ? (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <CheckSquare size={17} /> Submit Quiz
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                Next <ChevronRight size={17} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Quiz;
