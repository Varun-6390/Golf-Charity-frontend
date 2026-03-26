import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <div className="text-3xl font-heading font-extrabold text-primary-600 tracking-tight mb-2">⛳ GolfCharity</div>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <FiAlertCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center gap-1.5" htmlFor="login-email">
              <FiMail className="text-slate-400" /> Email
            </label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center">
              <label className="form-label flex items-center gap-1.5" htmlFor="login-password">
                <FiLock className="text-slate-400" /> Password
              </label>
              <button type="button" className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Forgot password?
              </button>
            </div>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary w-full py-3.5 text-base mt-2" type="submit" disabled={loading}>
            {loading ? <span className="spinner w-5 h-5 border-[3px]" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
