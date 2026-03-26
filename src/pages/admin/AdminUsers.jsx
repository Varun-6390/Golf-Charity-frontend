import { useState, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      // In a real app we'd have a specific admin users endpoint.
      // Based on PRD, we just need to be able to activate subscriptions manually.
      // We will assume `GET /admin/users` exists, or we mock it if it doesn't.
      const { data } = await api.get('/admin/users');
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleManualActivate = async (email) => {
    if (!window.confirm("Manually activate this user's subscription?")) return;
    
    try {
      await api.post('/admin/subscriptions/activate', {
        email,
        plan: 'monthly',
        priceCentsMonthlyEquivalent: 1000,
        currentPeriodEndDays: 30
      });
      toast.success('Subscription activated manually');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to activate subscription');
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.profile?.name && u.profile.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-600">View registered users and manage their subscription states.</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-100 text-slate-700 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Sub Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{u.profile?.name || 'Unnamed'}</div>
                        <div className="text-slate-500 text-xs">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.subscriptionStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs font-bold">
                            <FiCheckCircle size={14} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold w-max">
                            <FiXCircle size={14} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="text-xs font-semibold text-primary-600 hover:text-primary-800 disabled:opacity-50"
                            onClick={() => handleManualActivate(u.email)}
                            disabled={u.subscriptionStatus === 'active'}
                          >
                            Activate Sub
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
