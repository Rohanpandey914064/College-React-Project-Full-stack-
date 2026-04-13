import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import quizData from '../data/quizData';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, Play } from 'lucide-react';

const COUNT_OPTIONS    = [5, 10, 15, 20, 50];
const TIMER_OPTIONS    = [
  { label: 'No Timer',   value: null },
  { label: '5 min',      value: 5 * 60 },
  { label: '10 min',     value: 10 * 60 },
  { label: '15 min',     value: 15 * 60 },
  { label: '30 min',     value: 30 * 60 },
];
const DIFFICULTY_OPTIONS = [
  { label: 'All',    value: 'all' },
  { label: 'Easy',   value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard',   value: 'hard' },
];

const OptionGrid = ({ options, selected, onSelect, getLabel, getValue }) => (
  <div className="grid-3" style={{ gap: 'var(--sp-3)' }}>
    {options.map((opt) => {
      const val = getValue ? getValue(opt) : opt;
      const lbl = getLabel ? getLabel(opt) : String(opt);
      return (
        <button
          key={lbl}
          className={`setup-option${selected === val ? ' active' : ''}`}
          onClick={() => onSelect(val)}
        >
          {lbl}
        </button>
      );
    })}
  </div>
);

const QuizSetup = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = quizData.find((c) => c.id === parseInt(categoryId));

  const [count,      setCount]      = useState(10);
  const [duration,   setDuration]   = useState(null);
  const [difficulty, setDifficulty] = useState('all');

  if (!category) {
    return (
      <MainLayout>
        <div style={{ padding: 'var(--sp-16)', textAlign: 'center' }}>
          <h2>Category not found</h2>
          <button className="btn btn-primary" style={{ marginTop: 'var(--sp-4)' }} onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  // Clamp count if pool too small after difficulty filter
  const poolSize = difficulty === 'all'
    ? category.questions.length
    : category.questions.filter((q) => q.difficulty === difficulty).length;
  const effectivePool = poolSize < count ? category.questions.length : poolSize;

  const handleStart = () => {
    const attemptId = `${categoryId}_${Date.now()}`;
    navigate(`/quiz/${categoryId}`, {
      state: { count: Math.min(count, effectivePool), duration, difficulty, attemptId },
    });
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ maxWidth: 700, margin: '0 auto' }}
      >
        {/* Back */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 'var(--sp-5)' }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} /> Dashboard
        </button>

        {/* Category hero */}
        <div
          className="card"
          style={{
            borderTop: `4px solid ${category.color}`,
            marginBottom: 'var(--sp-6)',
            display: 'flex', alignItems: 'center', gap: 'var(--sp-5)',
          }}
        >
          <div
            style={{
              width: 64, height: 64, flexShrink: 0,
              background: category.colorLight,
              borderRadius: 'var(--r-xl)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            {category.icon}
          </div>
          <div>
            <h2 style={{ marginBottom: 'var(--sp-1)' }}>{category.name}</h2>
            <p style={{ fontSize: '0.9rem' }}>{category.description}</p>
            <div style={{ marginTop: 'var(--sp-2)', fontSize: '0.8rem', color: 'var(--txt-3)' }}>
              {category.questions.length} total questions available
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>

          <div>
            <div className="section-title">Number of Questions</div>
            <div className="grid-3" style={{ gap: 'var(--sp-3)' }}>
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`setup-option${count === n ? ' active' : ''}`}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            {poolSize < count && poolSize > 0 && (
              <p style={{ marginTop: 'var(--sp-2)', fontSize: '0.8rem', color: 'var(--clr-amber)' }}>
                Only {poolSize} {difficulty} questions available — will use all of them.
              </p>
            )}
          </div>

          <div>
            <div className="section-title">Timer</div>
            <OptionGrid
              options={TIMER_OPTIONS}
              selected={duration}
              onSelect={setDuration}
              getLabel={(o) => o.label}
              getValue={(o) => o.value}
            />
          </div>

          <div>
            <div className="section-title">Difficulty</div>
            <OptionGrid
              options={DIFFICULTY_OPTIONS}
              selected={difficulty}
              onSelect={setDifficulty}
              getLabel={(o) => o.label}
              getValue={(o) => o.value}
            />
          </div>

          <button
            id="start-quiz-btn"
            className="btn btn-primary btn-lg btn-block"
            style={{ justifyContent: 'center', marginTop: 'var(--sp-2)' }}
            onClick={handleStart}
          >
            <Play size={18} /> Start Quiz
          </button>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default QuizSetup;
