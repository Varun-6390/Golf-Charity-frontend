import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiHeart, FiGift, FiAward, FiBarChart2, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '.', label: 'Overview', icon: <FiBarChart2 />, end: true },
    { to: 'users', label: 'Users', icon: <FiUsers /> },
    { to: 'draws', label: 'Draw Management', icon: <FiGift /> },
    { to: 'charities', label: 'Charities', icon: <FiHeart /> },
    { to: 'winners', label: 'Winners & Payouts', icon: <FiAward /> },
  ];

  const SidebarContent = ({ isMobile }) => (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 text-primary-700 mb-1">
          <FiShield size={24} />
          <h2 className="text-xl font-heading font-extrabold uppercase tracking-wider">Admin Panel</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <FiLogOut />
          Exit Admin
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle & Overlay */}
      <div className="lg:hidden">
        <div className="bg-slate-900 text-white p-4 sticky top-0 z-30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <FiShield size={20} className="text-primary-400" />
            <h2 className="font-heading font-bold tracking-wider">ADMIN</h2>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
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
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
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
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
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
          className="max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
