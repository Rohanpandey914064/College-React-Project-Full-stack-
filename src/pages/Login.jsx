import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const { login, register } = useAuth();

  const canSubmit = isRegister
    ? name.trim().length >= 2 && email.trim().includes('@') && password.length >= 6
    : email.trim().includes('@') && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!canSubmit) {
      if (password.length < 6) setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = isRegister
      ? register(name.trim(), email.trim(), password)
      : login(email.trim(), password);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="card"
        style={{ padding: 'var(--sp-10)' }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
          <div
            style={{
              width: 56, height: 56,
              background: 'var(--clr-indigo)',
              borderRadius: 'var(--r-xl)',
              display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: 'var(--sp-5)',
            }}
          >
            ⚡
          </div>
          <h2 style={{ marginBottom: 'var(--sp-2)' }}>
            {isRegister ? 'Join ' : 'Welcome to '}
            <span style={{ color: 'var(--clr-indigo)' }}>QuizMaster</span>
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            {isRegister
              ? 'Create an account to start tracking your progress.'
              : 'Sign in with your email and password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name (Only for registration) */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginBottom: 'var(--sp-4)' }}
            >
              <label htmlFor="login-name" className="form-label">Full Name</label>
              <input
                id="login-name"
                type="text"
                className="input"
                placeholder="e.g. Aryan"
                value={name}
                autoFocus={isRegister}
                onChange={(e) => { setName(e.target.value); setError(''); }}
              />
            </motion.div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="e.g. aryan@example.com"
              value={email}
              autoFocus={!isRegister}
              autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="form-error"
              style={{ marginBottom: 'var(--sp-4)' }}
            >
              <span>⚠</span> {error}
            </motion.div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={!canSubmit || loading}
          >
            {loading ? 'Processing…' : (
              <>
                {isRegister ? 'Sign Up' : 'Sign In'} <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div style={{ marginTop: 'var(--sp-6)', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleMode}
            style={{ fontWeight: 500, color: 'var(--clr-indigo)' }}
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Hint (Only in Login mode) */}
        {!isRegister && (
          <p style={{
            marginTop: 'var(--sp-4)',
            fontSize: '0.78rem', color: 'var(--txt-3)',
            textAlign: 'center', lineHeight: 1.6,
          }}>
            Try: <strong>tiwariaryan.2005@gmail.com</strong> / <strong>password123</strong>
            <br />
            New user? Use the Sign Up button to create one!
          </p>
        )}
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
