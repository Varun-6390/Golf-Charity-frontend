import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Charities from './pages/Charities';
import CharityDetail from './pages/CharityDetail';

// Dashboard imports
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Scores from './pages/dashboard/Scores';
import CharitySelect from './pages/dashboard/CharitySelect';
import Draws from './pages/dashboard/Draws';
import Winnings from './pages/dashboard/Winnings';

// Subscription imports
import Subscribe from './pages/Subscribe';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

// Admin imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDraws from './pages/admin/AdminDraws';
import AdminCharities from './pages/admin/AdminCharities';
import AdminWinners from './pages/admin/AdminWinners';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  
  return children;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="charities" element={<Charities />} />
        <Route path="charities/:id" element={<CharityDetail />} />
        
        {/* Subscription Pages */}
        <Route path="subscribe" element={
          <ProtectedRoute>
            <Subscribe />
          </ProtectedRoute>
        } />
        <Route path="subscription-success" element={
          <ProtectedRoute>
            <SubscriptionSuccess />
          </ProtectedRoute>
        } />
        
        {/* User Dashboard */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="scores" element={<Scores />} />
          <Route path="charity" element={<CharitySelect />} />
          <Route path="draws" element={<Draws />} />
          <Route path="winnings" element={<Winnings />} />
        </Route>
        
        {/* Admin Dashboard */}
        <Route path="admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="draws" element={<AdminDraws />} />
          <Route path="charities" element={<AdminCharities />} />
          <Route path="winners" element={<AdminWinners />} />
        </Route>
      </Route>
    </Routes>
  );
}
