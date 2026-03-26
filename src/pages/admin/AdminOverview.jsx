import { useState, useEffect } from 'react';
import { FiUsers, FiHeart, FiGift, FiAward, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import api from '../../api/client';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch actual aggregated stats.
    // For now we'll simulate the data or fetch raw lists and count them if no endpoint exists.
    const fetchStats = async () => {
      try {
        const [users, charities] = await Promise.all([
          api.get('/admin/users').catch(() => ({ data: { users: [] } })),
          api.get('/charities').catch(() => ({ data: { charities: [] } }))
        ]);
        
        const activeUsersCount = (users.data.users || []).filter(u => u.subscriptionStatus === 'active').length;
        
        setStats({
          totalUsers: users.data.users?.length || 0,
          activeSubscriptions: activeUsersCount,
          charities: charities.data.charities?.length || 0,
          estimatedMonthlyRev: activeUsersCount * 10
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: <FiTrendingUp />, color: 'bg-green-100 text-green-600' },
    { label: 'Partner Charities', value: stats?.charities || 0, icon: <FiHeart />, color: 'bg-red-100 text-red-600' },
    { label: 'Est. Monthly Revenue', value: `£${stats?.estimatedMonthlyRev || 0}`, icon: <FiDollarSign />, color: 'bg-amber-100 text-amber-600' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Platform Overview</h1>
        <p className="text-slate-600">High-level metrics and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card p-6 border-slate-200 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-2xl font-heading font-extrabold text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Getting Started */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 border-slate-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FiGift className="text-primary-500" /> Monthly Priorities
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="mt-1 text-slate-400">1.</div>
              <div>
                <strong className="block text-slate-900">Run the Draw (1st of Month)</strong>
                <span className="text-sm text-slate-500">Go to Draw Management to simulate and publish the winning numbers.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 text-slate-400">2.</div>
              <div>
                <strong className="block text-slate-900">Verify Winners</strong>
                <span className="text-sm text-slate-500">Check the Winners panel to review uploaded scorecards from matched users.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 text-slate-400">3.</div>
              <div>
                <strong className="block text-slate-900">Process Payouts</strong>
                <span className="text-sm text-slate-500">Approve scorecards and mark payouts as completed once funds are transferred.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
