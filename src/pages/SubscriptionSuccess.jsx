import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Optionally we can verify the session ID with the backend here, 
    // but the Stripe webhook handles the actual DB update.
    // We just refresh the user profile to hopefully catch the active status
    const refreshAndVerify = async () => {
      try {
        if (sessionId) {
          await api.get(`/billing/verify-session?sessionId=${sessionId}`).catch(() => {});
        }
        await fetchUser();
      } catch (err) {
        console.error("Failed to refresh user after checkout");
      }
    };
    
    refreshAndVerify();
  }, [sessionId, fetchUser]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card p-10 max-w-lg text-center shadow-xl border-primary-100"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
          className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-4">
          Welcome to the Club!
        </h1>
        
        <p className="text-lg text-slate-600 mb-8">
          Your payment was successful and your subscription is now active. Thank you for joining us in supporting great causes while playing the game you love.
        </p>

        <div className="bg-primary-50 rounded-xl p-6 text-left mb-8">
          <h3 className="font-bold text-primary-900 mb-2">Next Steps:</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-primary-800 text-sm">
              <span className="font-bold shrink-0">1.</span>
              <span>Head to your dashboard to <b>add your Stableford scores</b>.</span>
            </li>
            <li className="flex gap-3 text-primary-800 text-sm">
              <span className="font-bold shrink-0">2.</span>
              <span>Visit the Charity Option page to <b>select your preferred charity</b>.</span>
            </li>
            <li className="flex gap-3 text-primary-800 text-sm">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>Keep an eye out on the 1st of every month for the <b>Prize Draw results</b>!</span>
            </li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
        >
          Go to My Dashboard
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
