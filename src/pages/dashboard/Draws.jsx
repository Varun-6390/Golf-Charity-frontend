import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGift, FiCalendar, FiAward, FiAlertCircle, FiClock } from 'react-icons/fi';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Draws() {
  const { user } = useAuth();
  const [draws, setDraws] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentMonthKey = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, '0')}`;

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        let currentDraw = null;

        // ✅ Safe current draw fetch
        try {
          const res = await api.get('/draws/current');
          currentDraw = res.data;
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Current draw error:", err);
          }
        }

        // ✅ Safe eligibility fetch
        let eligData = { eligible: false, matchCount: 0 };
        try {
          const res = await api.get(`/winners/me?drawId=${currentMonthKey}`);
          eligData = res.data;
        } catch (err) {
          console.warn("Eligibility fetch failed (safe fallback)");
        }

        setDraws(currentDraw ? [currentDraw] : []);
        setEligibility(eligData);

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="spinner w-8 h-8 border-[3px]"></div>
      </div>
    );
  }

  const currentDraw = draws.find(d => d.monthKey === currentMonthKey);
  const isPublished = currentDraw?.status === 'published';

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
          Draw Results
        </h1>
        <p className="text-slate-600">
          Monthly draws take place on the 1st of every month.
        </p>
      </div>

      {/* Current Draw Card */}
      <div className="card p-8 mb-8 border-primary-100 bg-gradient-to-br from-white to-primary-50/50">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary-600 font-bold uppercase text-sm">
              <FiCalendar />
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Draw
            </div>

            <h2 className="text-3xl font-heading font-extrabold text-slate-900">
              {isPublished ? "Results are in!" : "Draw pending"}
            </h2>

            <p className="text-slate-600 mt-2 max-w-md">
              {isPublished
                ? "Check below to see if your scores matched."
                : "Draw not published yet. Stay tuned!"}
            </p>
          </div>

          {/* User Status */}
          <div className="bg-white p-5 rounded-xl border shadow-sm min-w-[250px]">
            <h4 className="text-sm font-bold mb-3 border-b pb-2">
              Your Status
            </h4>

            {!isPublished ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FiClock className="text-amber-500" /> Awaiting results
              </div>
            ) : eligibility?.eligible ? (
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <FiAward /> {eligibility.matchCount} matches!
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FiAlertCircle /> No matches
              </div>
            )}
          </div>
        </div>

        {/* Winning Numbers */}
        {isPublished && currentDraw?.drawNumbers?.length === 5 ? (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-center font-bold mb-6 text-sm uppercase">
              Winning Numbers
            </h3>

            <div className="flex justify-center gap-4 flex-wrap">
              {currentDraw.drawNumbers.map((num, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-16 h-16 rounded-full bg-primary-600 text-white text-xl flex items-center justify-center"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-slate-500">
            <FiClock className="mx-auto text-3xl mb-2" />
            <p>No results published yet</p>
          </div>
        )}
      </div>

      {/* Past Draws */}
      <h3 className="font-bold text-lg mb-4">Past Draws</h3>

      <div className="card text-center py-12 bg-slate-50 border-dashed">
        <FiGift className="text-slate-400 text-4xl mx-auto mb-3" />
        <h4 className="font-medium">No past draws available</h4>
        <p className="text-sm text-slate-500">
          Results will appear here once available.
        </p>
      </div>
    </div>
  );
}
