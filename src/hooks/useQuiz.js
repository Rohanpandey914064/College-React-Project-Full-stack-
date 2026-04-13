import { useState, useEffect, useCallback, useRef } from 'react';
import { saveSession, getSession, removeSession } from '../utils/storage';

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * useQuiz
 * @param {Object[]} allQuestions  — Full question pool for the category
 * @param {Object}   config        — { count, duration (seconds | null), attemptId, categoryId, categoryName, difficulty }
 * @param {Function} onComplete    — called with { score, selectedAnswers, questions, timeTaken }
 */
export const useQuiz = (allQuestions, config, onComplete) => {
  const {
    count = 10,
    duration = null,   // null = no timer
    attemptId,
    categoryId,
    categoryName,
    difficulty = 'all',
  } = config;

  // ─── Initialise state from saved session (resume) or fresh ---
  const initState = () => {
    const saved = getSession();
    if (
      saved &&
      saved.attemptId === attemptId &&
      saved.categoryId === categoryId
    ) {
      return {
        questions:       saved.questions,
        currentIndex:    saved.currentIndex,
        selectedAnswers: saved.selectedAnswers,
        flagged:         saved.flagged || {},
        timeLeft:        saved.timeLeft ?? duration,
        isResumed:       true,
      };
    }

    // Filter by difficulty
    let pool = difficulty === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === difficulty);

    // Fallback: if not enough filtered, use all
    if (pool.length < count) pool = allQuestions;

    const questions = shuffle(pool).slice(0, count);

    return {
      questions,
      currentIndex:    0,
      selectedAnswers: {},
      flagged:         {},
      timeLeft:        duration,
      isResumed:       false,
    };
  };

  const [state, setState] = useState(initState);
  const { questions, currentIndex, selectedAnswers, flagged, timeLeft } = state;

  const timerRef  = useRef(null);
  const startedAt = useRef(Date.now());

  const currentQuestion = questions[currentIndex];

  // ─── Persist session on every meaningful change ───────────────
  useEffect(() => {
    if (!questions.length) return;
    saveSession({
      attemptId,
      categoryId,
      categoryName,
      questions,
      currentIndex,
      selectedAnswers,
      flagged,
      timeLeft,
    });
  }, [currentIndex, selectedAnswers, flagged, timeLeft, questions, attemptId, categoryId, categoryName]);

  // ─── Finish quiz ──────────────────────────────────────────────
  const finishQuiz = useCallback((autoSubmit = false) => {
    clearInterval(timerRef.current);
    removeSession();

    const timeTaken = duration != null
      ? duration - (autoSubmit ? 0 : (state.timeLeft ?? 0))
      : Math.round((Date.now() - startedAt.current) / 1000);

    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });

    onComplete({
      score,
      selectedAnswers,
      questions,
      timeTaken,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, selectedAnswers, duration, onComplete]);

  // ─── Full-quiz countdown timer ────────────────────────────────
  useEffect(() => {
    if (duration == null) return; // no timer mode

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit via timeout — deferred to avoid state update during render
          setTimeout(() => finishQuiz(true), 0);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ─── Navigation ──────────────────────────────────────────────
  const goTo = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setState((prev) => ({ ...prev, currentIndex: idx }));
    }
  };

  const handleNext = () => goTo(currentIndex + 1);
  const handlePrev = () => goTo(currentIndex - 1);

  // ─── Select Answer ────────────────────────────────────────────
  const handleSelect = (option) => {
    setState((prev) => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [prev.currentIndex]: option },
    }));
  };

  // ─── Flag / Mark for Review ───────────────────────────────────
  const handleFlag = () => {
    setState((prev) => ({
      ...prev,
      flagged: { ...prev.flagged, [prev.currentIndex]: !prev.flagged[prev.currentIndex] },
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progress      = questions.length > 0
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  return {
    questions,
    currentIndex,
    currentQuestion,
    selectedAnswers,
    flagged,
    timeLeft,
    answeredCount,
    progress,
    handleSelect,
    handleNext,
    handlePrev,
    handleFlag,
    goTo,
    finishQuiz,
  };
};