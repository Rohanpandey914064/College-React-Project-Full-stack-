import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import quizData from '../data/quizData';
import MainLayout from '../layouts/MainLayout';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* ── Hero ── */}
        <section className="hero-section">
          <motion.div variants={fadeUp}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 14px',
                background: 'var(--clr-indigo-dim)',
                borderRadius: 'var(--r-full)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--clr-indigo)',
                marginBottom: 'var(--sp-5)',
                letterSpacing: '0.04em',
              }}
            >
              ⚡ 4 categories · 200+ questions
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-heading">
            Test your knowledge.<br />
            <span className="accent">Sharpen your mind.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-sub">
            Pick a category, choose your challenge level, and start your quiz — 
            no signup required beyond your name.
          </motion.p>

          <motion.button
            variants={fadeUp}
            className="btn btn-primary btn-xl"
            onClick={() => {
              // Scroll to categories
              document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start a Quiz
          </motion.button>

          {/* ── Category cards ── */}
          <motion.div
            id="categories"
            variants={fadeUp}
            className="category-grid-home"
            style={{ marginTop: 'var(--sp-12)' }}
          >
            {quizData.map((cat) => (
              <div
                key={cat.id}
                className="home-cat-card"
                onClick={() => navigate(`/quiz-setup/${cat.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/quiz-setup/${cat.id}`)}
                style={{ borderTop: `3px solid ${cat.color}` }}
              >
                <div className="home-cat-emoji">{cat.icon}</div>
                <div className="home-cat-name">{cat.name}</div>
                <div className="home-cat-count">{cat.questions.length} questions</div>
                <div className="home-cat-arrow">Start →</div>
              </div>
            ))}
          </motion.div>
        </section>
      </motion.div>
    </MainLayout>
  );
};

export default Home;
