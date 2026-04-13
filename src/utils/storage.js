// ─── LocalStorage Utility Helpers ───────────────────────────────────────────

const KEYS = {
  THEME:         'quiz_theme',
  USER:          'quiz_user',
  USER_STATS:    'quiz_user_stats',
  LEADERBOARD:   'quiz_leaderboard',
  HISTORY:       'quiz_history',
  SESSION:       'current_quiz_session',
  RESULT:        'current_quiz_result',
  REG_USERS:     'quiz_registered_users',
};

export { KEYS };

const get = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('localStorage write failed for key:', key);
  }
};

const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
};

// ─── Theme ──────────────────────────────────────────────────────────────────
export const getTheme     = ()    => get(KEYS.THEME, 'dark');
export const saveTheme    = (t)   => set(KEYS.THEME, t);

// ─── User ────────────────────────────────────────────────────────────────────
export const getUser      = ()    => get(KEYS.USER, null);
export const saveUser     = (u)   => set(KEYS.USER, u);
export const removeUser   = ()    => remove(KEYS.USER);

// ─── Stats ───────────────────────────────────────────────────────────────────
const DEFAULT_STATS = {
  totalQuizzes: 0,
  totalScore: 0,
  totalQuestions: 0,
  bestAccuracy: 0,
  streak: 0,
  lastPlayedDate: null,
  categoryStats: {},
};
export const getStats     = ()    => get(KEYS.USER_STATS, DEFAULT_STATS);
export const saveStats    = (s)   => set(KEYS.USER_STATS, s);
export const removeStats  = ()    => remove(KEYS.USER_STATS);

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getLeaderboard   = ()    => get(KEYS.LEADERBOARD, []);
export const saveLeaderboard  = (lb)  => set(KEYS.LEADERBOARD, lb);
export const removeLeaderboard = ()   => remove(KEYS.LEADERBOARD);

// ─── History ─────────────────────────────────────────────────────────────────
export const getHistory   = ()    => get(KEYS.HISTORY, []);
export const saveHistory  = (h)   => set(KEYS.HISTORY, h);
export const removeHistory = ()   => remove(KEYS.HISTORY);

// ─── Active Quiz Session ─────────────────────────────────────────────────────
export const getSession   = ()    => get(KEYS.SESSION, null);
export const saveSession  = (s)   => set(KEYS.SESSION, s);
export const removeSession = ()   => remove(KEYS.SESSION);

// ─── Quiz Result ─────────────────────────────────────────────────────────────
export const getResult    = ()    => get(KEYS.RESULT, null);
export const saveResult   = (r)   => set(KEYS.RESULT, r);
export const removeResult = ()    => remove(KEYS.RESULT);
// ─── Registered Users (Dynamic) ──────────────────────────────────────────────
export const getRegisteredUsers  = ()    => get(KEYS.REG_USERS, []);
export const saveRegisteredUsers = (ru)   => set(KEYS.REG_USERS, ru);
export const removeRegisteredUsers = ()  => remove(KEYS.REG_USERS);
