import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login      from './pages/Login';
import Home       from './pages/Home';
import Dashboard  from './pages/Dashboard';
import QuizSetup  from './pages/QuizSetup';
import Quiz       from './pages/Quiz';
import Result     from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile    from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user }  = useAuth();
  const location  = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

        {/* Protected — Home is the new "/" */}
        <Route path="/"             element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz-setup/:categoryId" element={<ProtectedRoute><QuizSetup /></ProtectedRoute>} />
        <Route path="/quiz/:categoryId"       element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/result"       element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/leaderboard"  element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
