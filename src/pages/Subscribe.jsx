import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiStar, FiArrowRight } from 'react-icons/fi';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '../context/ToastContext';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Subscribe() {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [activeSub, setActiveSub] = useState(false);

  useEffect(() => {
    // Check if running already subscribed
    api.get('/me/subscription')
      .then((res) => {
        if (res.data?.status === 'active') {
          setActiveSub(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleCheckout = async (interval) => {
    try {
      setLoading(interval);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { data } = await api.post('/billing/create-checkout-session', {
        plan: interval === 'month' ? 'monthly' : 'yearly',
      });

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data?.error;
      const errorMessage = typeof errorData === 'string' ? errorData : "Failed to initiate checkout";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (activeSub) {
    return (
      <div className="container-sm py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">You're Already Subscribed!</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Your subscription is currently active. You can participate in draws, submit scores, and support your favourite charity.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">
            Join the Club. Play to Win. <span className="text-primary-600">Give Back.</span>
          </h1>
          <p className="text-lg text-slate-600">
            A £10 monthly subscription gives you access to the community, entry into the monthly prize draw, and automatically donates a minimum of £1 to your chosen charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="card p-8 border-2 border-slate-200 hover:border-primary-300 transition-colors bg-white relative">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Monthly Member</h3>
            <p className="text-slate-500 mb-6">Flexible, rolling monthly subscription.</p>
            
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="text-5xl font-heading font-extrabold text-slate-900">£10</span>
              <span className="text-slate-500">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "1 entry per month in the Prize Draw",
                "Minimum 10% donated to charity",
                "Submit unlimited Stableford scores",
                "Cancel anytime"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <FiCheckCircle className="text-primary-500 shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleCheckout('month')}
              disabled={loading}
              className="btn btn-outline w-full py-4 text-lg"
            >
              {loading === 'month' ? <span className="spinner w-6 h-6 border-[3px]"></span> : 'Choose Monthly'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="card p-8 border-2 border-primary-500 shadow-xl shadow-primary-500/10 bg-white relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white font-bold text-sm tracking-wider uppercase px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiStar /> Best Value
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Annual Member</h3>
            <p className="text-slate-500 mb-6">Commit for a year and save on your subscription.</p>
            
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="text-5xl font-heading font-extrabold text-slate-900">£100</span>
              <span className="text-slate-500">/year</span>
              <div className="text-primary-600 font-bold text-sm mt-1">2 months free!</div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "1 entry per month in the Prize Draw",
                "Minimum 10% donated to charity",
                "Submit unlimited Stableford scores",
                "Annual commitment"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <FiCheckCircle className="text-primary-500 shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleCheckout('year')}
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg"
            >
              {loading === 'year' ? <span className="spinner w-6 h-6 border-[3px]"></span> : 'Choose Annual'}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12 text-slate-500 text-sm flex items-center justify-center gap-2">
           Payments are securely processed by Stripe. You can update your payment method directly in the customer portal later.
        </div>
      </div>
    </div>
  );
}
