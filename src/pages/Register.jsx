import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
          <p className="text-slate-500 text-sm">Create your account to start playing</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <FiAlertCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label flex items-center gap-1.5" htmlFor="reg-name">
              <FiUser className="text-slate-400" /> Full Name
            </label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-1.5" htmlFor="reg-email">
              <FiMail className="text-slate-400" /> Email
            </label>
            <input
              id="reg-email"
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
            <label className="form-label flex items-center gap-1.5" htmlFor="reg-password">
              <FiLock className="text-slate-400" /> Password
            </label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button className="btn btn-primary w-full py-3.5 text-base mt-2" type="submit" disabled={loading}>
            {loading ? <span className="spinner w-5 h-5 border-[3px]" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
