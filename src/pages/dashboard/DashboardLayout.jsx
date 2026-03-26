import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUser, FiHeart, FiGift, FiAward, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '.', label: 'Overview', icon: <FiHome />, end: true },
    { to: 'scores', label: 'My Scores', icon: <FiUser /> },
    { to: 'charity', label: 'Charity Option', icon: <FiHeart /> },
    { to: 'draws', label: 'Draw Results', icon: <FiGift /> },
    { to: 'winnings', label: 'My Winnings', icon: <FiAward /> },
  ];

  const SidebarContent = ({ isMobile }) => (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-heading font-bold text-slate-800">My Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
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
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-200 shrink-0 sticky top-[72px] h-[calc(100vh-72px)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle & Overlay */}
      <div className="md:hidden">
        <div className="bg-white border-b border-slate-200 p-4 sticky top-[72px] z-30 flex items-center justify-between">
          <h2 className="font-heading font-bold text-slate-800">Dashboard</h2>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <FiMenu size={24} />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
              >
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <FiX size={24} />
                </button>
                <div className="pt-8 h-full">
                  <SidebarContent isMobile theme />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
