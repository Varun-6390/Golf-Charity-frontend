import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiDollarSign, FiExternalLink, FiSearch } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminWinners() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawId, setFilterDrawId] = useState(''); // E.g., '2025-03'
  
  const toast = useToast();

  const fetchSubmissions = async () => {
    try {
      const url = filterDrawId ? `/admin/winners?drawId=${filterDrawId}` : '/admin/winners';
      const { data } = await api.get(url);
      setSubmissions(data.submissions || []);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // Default to current month key if not set, or let it load all
  }, [filterDrawId]);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this submission as ${status}?`)) return;
    try {
      await api.patch(`/admin/winners/${id}`, { adminDecision: status });
      toast.success(`Submission ${status}`);
      fetchSubmissions();
      
      // If approved, trigger payout creation automatically based on the logic described in the backend
      if (status === 'approved') {
        // Technically backend could do this in the PATCH or we do a distinct step:
        toast.success(`Now process the payout.`, { id: 'payout-instruction' });
      }
    } catch (err) {
      toast.error(typeof err.response?.data?.error === 'object' ? 'Validation failed' : (err.response?.data?.error || 'Failed to update status'));
    }
  };

  const handleMarkPaid = async (payoutId) => {
    if (!window.confirm('Mark this payout as PAID? This means money was transferred.')) return;
    try {
      await api.post(`/admin/payouts/${payoutId}/mark-paid`);
      toast.success('Payout marked as paid');
      fetchSubmissions(); // refresh
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  const handleGeneratePayouts = async () => {
    if (!filterDrawId) {
      toast.error('Please filter by a Draw Month first to generate its payouts.');
      return;
    }
    if (!window.confirm('Generate payouts for all approved winners in this draw?')) return;
    try {
      await api.post(`/admin/payouts/${filterDrawId}`);
      toast.success('Payouts generated successfully!');
      fetchSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate payouts');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Winners & Payouts</h1>
        <p className="text-slate-600">Review user uploaded proofs of their scorecards and manage financial payouts.</p>
      </div>

      <div className="card p-4 mb-6 bg-slate-50 flex items-center justify-between gap-4 border-slate-200 flex-wrap">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Filter by Draw Month:</label>
          <input 
            type="month" 
            value={filterDrawId}
            onChange={(e) => setFilterDrawId(e.target.value)}
            className="form-input max-w-xs"
          />
          <button onClick={() => setFilterDrawId('')} className="text-sm text-slate-500 hover:text-slate-900 underline">Clear</button>
        </div>
        <div>
          <button 
            onClick={handleGeneratePayouts}
            className="btn btn-primary text-sm flex items-center gap-2"
          >
            <FiDollarSign /> Generate Payouts
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>
        ) : submissions.length > 0 ? (
          <table className="w-full text-left text-sm text-slate-600 bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Draw</th>
                <th className="px-6 py-4">Matches</th>
                <th className="px-6 py-4 text-center">Proof Image</th>
                <th className="px-6 py-4">Sub Status</th>
                <th className="px-6 py-4">Payout Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{sub.user?.email || 'Unknown'}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{sub.drawId}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-slate-200 font-bold">{sub.matchCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a href={sub.proofImageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      <FiExternalLink /> View Card
                    </a>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {sub.submissionStatus === 'pending' ? (
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded text-xs border border-amber-200">Pending</span>
                    ) : sub.submissionStatus === 'approved' ? (
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs border border-green-200">Approved</span>
                    ) : (
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs border border-red-200">Rejected</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium capitalize">
                    <span className={sub.payoutStatus === 'paid' ? 'text-green-600' : 'text-slate-500'}>
                      {sub.payoutStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-y-2">
                    {/* Submission Actions */}
                    {sub.submissionStatus === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleStatusUpdate(sub._id, 'approved')} className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200" title="Approve">
                          <FiCheckCircle size={16} />
                        </button>
                        <button onClick={() => handleStatusUpdate(sub._id, 'rejected')} className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200" title="Reject">
                          <FiXCircle size={16} />
                        </button>
                      </div>
                    )}
                    
                    {/* Payout Actions */}
                    {sub.submissionStatus === 'approved' && sub.payoutStatus === 'pending' && sub.payoutRef && (
                      <div className="flex justify-end">
                        <button onClick={() => handleMarkPaid(sub.payoutRef)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5">
                          <FiDollarSign /> Mark Paid
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card text-center py-16 bg-white border-slate-200">
            <h4 className="text-slate-900 font-medium">No submissions found</h4>
            <p className="text-sm text-slate-500 mt-1">Winners haven't submitted any proofs for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
