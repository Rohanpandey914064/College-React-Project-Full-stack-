import React, { createContext, useContext, useState } from 'react';
import registeredUsers from '../data/users.json';
import {
  getUser, saveUser, removeUser,
  getStats, saveStats, removeStats,
  getLeaderboard, saveLeaderboard,
  getRegisteredUsers, saveRegisteredUsers,
  removeHistory, removeSession,
} from '../utils/storage';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const DEFAULT_STATS = {
  totalQuizzes: 0,
  totalScore: 0,
  totalQuestions: 0,
  bestAccuracy: 0,
  streak: 0,
  lastPlayedDate: null,
  categoryStats: {},
};

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => getUser());
  const [stats, setStats] = useState(() => getStats());
  const [dynamicUsers, setDynamicUsers] = useState(() => getRegisteredUsers());

  // Merge static users from JSON with dynamically registered users from localStorage
  const allUsers = [...registeredUsers, ...dynamicUsers];

  /**
   * Validate name + email against the local users.json list.
   * Returns { ok, error } — no backend required.
   */
  const login = (email, password) => {
    const trimEmail = email.trim().toLowerCase();

    const match = allUsers.find(
      (u) => u.email.toLowerCase() === trimEmail && u.password === password
    );

    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const userData = {
      username:   match.name,
      email:      match.email,
      joinedDate: match.joinedDate || new Date().toISOString(),
    };
    setUser(userData);
    saveUser(userData);
    return { ok: true };
  };

  const register = (name, email, password) => {
    const trimEmail = email.trim().toLowerCase();

    if (allUsers.some((u) => u.email.toLowerCase() === trimEmail)) {
      return { ok: false, error: 'Email already registered.' };
    }

    const newUser = {
      name: name.trim(),
      email: trimEmail,
      password: password,
      joinedDate: new Date().toISOString(),
    };

    const updatedDynamic = [...dynamicUsers, newUser];
    setDynamicUsers(updatedDynamic);
    saveRegisteredUsers(updatedDynamic);

    // Auto-login after registration
    const userData = {
      username:   newUser.name,
      email:      newUser.email,
      joinedDate: newUser.joinedDate,
    };
    setUser(userData);
    saveUser(userData);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setStats(DEFAULT_STATS);
    removeUser();
    removeStats();
    // Note: We NO LONGER call removeLeaderboard() so data persists
    removeHistory();
    removeSession();
  };

  const saveScore = (scoreData) => {
    // De-duplicate (React 18 Strict Mode double-invoke guard)
    const leaderboard = getLeaderboard();
    if (
      scoreData.attemptId &&
      leaderboard.some((e) => e.attemptId === scoreData.attemptId)
    ) return;

    const accuracy = scoreData.total > 0
      ? Math.round((scoreData.score / scoreData.total) * 100)
      : 0;

    const entry = {
      attemptId: scoreData.attemptId,
      username:  user?.username ?? 'Guest',
      category:  scoreData.category,
      score:     scoreData.score,
      total:     scoreData.total,
      accuracy,
      timeTaken: scoreData.timeTaken ?? 0,
      date:      new Date().toISOString(),
    };
    saveLeaderboard([...leaderboard, entry]);

    // Streak logic
    const today     = new Date().toDateString();
    const lastDate  = stats.lastPlayedDate
      ? new Date(stats.lastPlayedDate).toDateString() : null;
    let newStreak   = stats.streak ?? 0;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      newStreak = lastDate === yesterday.toDateString() ? newStreak + 1 : 1;
    }

    // Per-category aggregation
    const catStats = { ...(stats.categoryStats || {}) };
    const prev = catStats[scoreData.category] || { quizzes: 0, totalScore: 0, totalQuestions: 0 };
    catStats[scoreData.category] = {
      quizzes:        prev.quizzes + 1,
      totalScore:     prev.totalScore + scoreData.score,
      totalQuestions: prev.totalQuestions + scoreData.total,
    };

    const newStats = {
      totalQuizzes:   (stats.totalQuizzes   ?? 0) + 1,
      totalScore:     (stats.totalScore     ?? 0) + scoreData.score,
      totalQuestions: (stats.totalQuestions ?? 0) + scoreData.total,
      bestAccuracy:   Math.max(stats.bestAccuracy ?? 0, accuracy),
      streak:         newStreak,
      lastPlayedDate: new Date().toISOString(),
      categoryStats:  catStats,
    };
    setStats(newStats);
    saveStats(newStats);
  };

  return (
    <AuthContext.Provider value={{ user, stats, login, register, logout, saveScore }}>
      {children}
    </AuthContext.Provider>
  );
};
