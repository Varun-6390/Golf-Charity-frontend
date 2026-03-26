import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGift, FiCalendar, FiAward, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Draws() {
  const { user } = useAuth();
  const [draws, setDraws] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Format YYYY-MM
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        // Fetch past draws (could be an array) and current draw if it's published
        const [drawsRes, eligRes] = await Promise.all([
          api.get('/draws/history').catch(() => ({ data: { draws: [] } })),
          api.get(`/winners/me?drawId=${currentMonthKey}`).catch(() => ({ data: { eligible: false, matchCount: 0 } }))
        ]);
        
        // Actually the backend endpoint for history doesn't exist explicitly in the PRD perfectly for an array of ALL draws, 
        // but we assume there's a list or we fetch current. 
        // For now, let's fetch current and check if it's published.
        
        try {
          const currentRes = await api.get('/draws/current');
          setDraws([currentRes.data]);
        } catch (currentErr) {
          // No current draw published yet
          setDraws([]); 
        }

        if (eligRes?.data) {
          setEligibility(eligRes.data);
        } else {
          setEligibility({ eligible: false, matchCount: 0 });
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  if (loading) {
    return <div className="py-12 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  const currentDraw = draws.find(d => d.monthKey === currentMonthKey);
  const isPublished = currentDraw?.status === 'published';

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Draw Results</h1>
        <p className="text-slate-600">
          Monthly draws take place on the 1st of every month. Check back here to see if your Stableford scores match the winning numbers!
        </p>
      </div>

      {/* Current Month Status */}
      <div className="card p-8 mb-8 border-primary-100 bg-gradient-to-br from-white to-primary-50/50">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary-600 font-bold uppercase tracking-wider text-sm">
              <FiCalendar /> {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Draw
            </div>
            {isPublished ? (
              <h2 className="text-3xl font-heading font-extrabold text-slate-900">Results are in!</h2>
            ) : (
              <h2 className="text-3xl font-heading font-extrabold text-slate-900">Draw pending</h2>
            )}
            <p className="text-slate-600 mt-2 max-w-md">
              {isPublished 
                ? "The draw numbers have been published. Check below to see if your scores matched." 
                : "The draw hasn't been published yet. Make sure you have an active subscription and 5 valid scores to be eligible."}
            </p>
          </div>

          {/* User Eligibility Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-w-[250px]">
            <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Your Status</h4>
            {!isPublished ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FiClock size={18} className="text-amber-500" /> Awaiting draw results
              </div>
            ) : eligibility && eligibility.eligible ? (
              <div className="flex items-center gap-2 text-primary-600 font-bold">
                <FiAward size={20} /> You have {eligibility.matchCount} matches!
              </div>
            ) : eligibility ? (
               <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                 <FiAlertCircle size={18} /> No winning matches this month
               </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse">
                <FiAlertCircle size={18} /> Checking eligibility...
              </div>
            )}
          </div>
        </div>

        {/* Winning Numbers Display */}
        {isPublished && currentDraw && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-center font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">Winning Numbers</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {(currentDraw.drawNumbers || []).map((num, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white font-heading font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-accent-500/30"
                >
                  {num}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-sm text-slate-700">Prize Pool Breakdown</div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                <div className="p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase">Match 5</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">£{((currentDraw.tierTotalsCents?.tier5 || 0) / 100).toFixed(2)}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase">Match 4</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">£{((currentDraw.tierTotalsCents?.tier4 || 0) / 100).toFixed(2)}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase">Match 3</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">£{((currentDraw.tierTotalsCents?.tier3 || 0) / 100).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Past Draws Placeholder */}
      <h3 className="font-bold text-lg text-slate-900 mb-4">Past Draws</h3>
      <div className="card text-center py-12 bg-slate-50 border-dashed">
        <FiGift className="text-slate-400 text-4xl mx-auto mb-3" />
        <h4 className="font-medium text-slate-900">No past draws available</h4>
        <p className="text-sm text-slate-500 mt-1">Past draw results will appear here as the months progress.</p>
      </div>
    </div>
  );
}
