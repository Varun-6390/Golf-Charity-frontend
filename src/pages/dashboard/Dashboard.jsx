import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiHeart, FiGift, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [subData, setSubData] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subRes, scoresRes] = await Promise.all([
          api.get('/me/subscription').catch(() => ({ data: null })),
          api.get('/me/scores').catch(() => ({ data: { scores: [] } }))
        ]);
        
        setSubData(subRes?.data);
        setScores(scoresRes?.data?.scores || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="spinner w-8 h-8 border-[3px]"></div>
      </div>
    );
  }

  const isActive = subData?.status === 'active';
  const scoreCount = scores.length;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome back, {user?.profile?.name || user?.email?.split('@')[0]}!</h1>
        <p className="text-slate-600">Here's an overview of your platform activity.</p>
      </div>

      {/* Subscription Alert */}
      {!isActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="mt-1 text-amber-500 shrink-0"><FiAlertCircle size={24} /></div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Subscription Inactive</h3>
              <p className="text-amber-700 text-sm">You need an active subscription to participate in the monthly prize draws and support charities.</p>
            </div>
          </div>
          <Link to="/subscribe" className="btn bg-amber-500 text-white hover:bg-amber-600 shrink-0 w-full sm:w-auto">
            Subscribe Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scores Summary */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <FiTrendingUp />
            </div>
            <h3 className="font-bold text-lg">Your Scores</h3>
          </div>
          <div className="flex-1">
            <div className="text-4xl font-heading font-extrabold text-slate-900 mb-2">{scoreCount}<span className="text-lg text-slate-500 font-normal">/5</span></div>
            <p className="text-sm text-slate-500">
              {scoreCount < 5 ? `Add ${5 - scoreCount} more scores to enter the draw.` : 'You have the maximum 5 active scores.'}
            </p>
          </div>
          <Link to="scores" className="btn btn-outline w-full mt-6">Manage Scores</Link>
        </div>

        {/* Charity Summary */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiHeart />
            </div>
            <h3 className="font-bold text-lg">My Charity</h3>
          </div>
          <div className="flex-1">
            {user?.profile?.charityPreference ? (
              <>
                <div className="font-semibold text-slate-900 mb-1 truncate">Charity Selected</div>
                <div className="text-3xl font-heading font-extrabold text-blue-600 mb-2">{user.profile.contributionPercentage}%</div>
                <p className="text-sm text-slate-500">of your subscription goes to this cause.</p>
              </>
            ) : (
              <>
                <div className="font-semibold text-amber-600 mb-2">No Charity Selected</div>
                <p className="text-sm text-slate-500">Choose a charity to support with your subscription fees.</p>
              </>
            )}
          </div>
          <Link to="charity" className="btn btn-ghost bg-slate-100 w-full mt-6">Update Preference</Link>
        </div>

        {/* Draw Status */}
        <div className="card p-6 flex flex-col border-primary-100 bg-gradient-to-br from-white to-primary-50/50">
          <div className="flex items-center gap-3 mb-4 text-slate-800">
            <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
              <FiGift />
            </div>
            <h3 className="font-bold text-lg">Next Draw</h3>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</div>
            {isActive && scoreCount === 5 ? (
              <div className="inline-flex items-center gap-1.5 text-primary-700 bg-primary-100 px-3 py-1 rounded-full text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                Eligible to Win
              </div>
            ) : (
              <div className="text-sm text-slate-600 italic">Not eligible for upcoming draw. { !isActive ? 'Requires subscription.' : 'Requires 5 scores.' }</div>
            )}
          </div>
          <Link to="draws" className="btn bg-primary-600 hover:bg-primary-700 text-white w-full mt-6 shadow-md shadow-primary-500/20">View Draw Results</Link>
        </div>
      </div>
    </div>
  );
}
