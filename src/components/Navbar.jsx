import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const initial = user?.profile?.name?.[0] || user?.email?.[0] || 'U';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="container-default flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl text-primary-700">
            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white text-lg">
              ⛳
            </span>
            GolfCharity
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/charities"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
                }`
              }
            >
              Charities
            </NavLink>
            <NavLink
              to="/subscribe"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
                }`
              }
            >
              Subscribe
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="hidden md:flex items-center gap-2 pr-3 pl-1.5 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-800 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {initial.toUpperCase()}
                  </div>
                  <span>{user?.profile?.name || user?.email?.split('@')[0]}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute top-[calc(100%+8px)] right-0 bg-white border border-slate-200 rounded-xl shadow-xl min-w-[200px] overflow-hidden z-[100]"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <FiGrid size={16} /> Dashboard
                      </Link>
                      <Link to="/dashboard/scores" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                        <FiUser size={16} /> My Scores
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors" onClick={() => setDropdownOpen(false)}>
                          <FiShield size={16} /> Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-slate-200 my-1" />
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={handleLogout}>
                        <FiLogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </div>
            )}

            <button
              className="md:hidden flex flex-col gap-[5px] p-2 text-slate-800"
              onClick={() => setMobileOpen(true)}
            >
              <span className="block w-6 h-[2px] bg-current rounded-full" />
              <span className="block w-6 h-[2px] bg-current rounded-full" />
              <span className="block w-6 h-[2px] bg-current rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[200] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-6 right-6 text-2xl text-slate-500" onClick={() => setMobileOpen(false)}>
                <FiX />
              </button>
              
              <div className="flex flex-col gap-2 mt-12">
                {isAuthenticated && (
                  <div className="flex items-center gap-3 pb-6 mb-4 border-b border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                      {initial.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user?.profile?.name || 'User'}</div>
                      <div className="text-sm text-slate-500">{user?.email}</div>
                    </div>
                  </div>
                )}
              
                <Link to="/" className="px-4 py-3 text-base font-medium rounded-lg text-slate-800 hover:bg-primary-50 hover:text-primary-700" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/charities" className="px-4 py-3 text-base font-medium rounded-lg text-slate-800 hover:bg-primary-50 hover:text-primary-700" onClick={() => setMobileOpen(false)}>Charities</Link>
                <Link to="/subscribe" className="px-4 py-3 text-base font-medium rounded-lg text-slate-800 hover:bg-primary-50 hover:text-primary-700" onClick={() => setMobileOpen(false)}>Subscribe</Link>
                
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="px-4 py-3 text-base font-medium rounded-lg text-slate-800 hover:bg-primary-50 hover:text-primary-700 mt-4 border-t border-slate-100" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    {isAdmin && (
                      <Link to="/admin" className="px-4 py-3 text-base font-medium rounded-lg text-slate-800 hover:bg-primary-50 hover:text-primary-700" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
                    )}
                    <button className="px-4 py-3 text-base font-medium rounded-lg text-red-600 hover:bg-red-50 text-left mt-4 border-t border-slate-100" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-slate-100">
                    <Link to="/login" className="btn btn-outline w-full" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
