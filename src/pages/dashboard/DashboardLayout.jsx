import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUser,
  FiHeart,
  FiGift,
  FiAward,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Auto close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ✅ Async logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ✅ Navigation Items (Role-based ready)
  const navItems = [
    { to: '.', label: 'Overview', icon: <FiHome />, end: true },
    { to: 'scores', label: 'My Scores', icon: <FiUser /> },
    { to: 'charity', label: 'Charity Option', icon: <FiHeart /> },
    { to: 'draws', label: 'Draw Results', icon: <FiGift /> },
    { to: 'winnings', label: 'My Winnings', icon: <FiAward /> },

    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Panel', icon: <FiAward /> }]
      : []),
  ];

  // ✅ Sidebar Component
  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800">My Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1 break-all">
          {user?.email}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button
          aria-label="Sign out"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
        >
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 flex flex-col md:flex-row">
      
      {/* ✅ Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-200 shrink-0 sticky top-[72px] h-[calc(100vh-72px)]">
        <SidebarContent />
      </aside>

      {/* ✅ Mobile Header */}
      <div className="md:hidden w-full">
        <div className="bg-white border-b border-slate-200 p-4 sticky top-[72px] z-30 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Dashboard</h2>

          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* ✅ Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
              >
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <FiX size={24} />
                </button>

                <div className="pt-8 h-full">
                  <SidebarContent isMobile />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Main Content */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-5xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
