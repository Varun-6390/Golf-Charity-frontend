import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiCheck, FiSave } from 'react-icons/fi';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CharitySelect() {
  const { user, fetchMe } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local state for the form
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [percentage, setPercentage] = useState(10);
  
  const toast = useToast();

  useEffect(() => {
    // Fetch available charities
    api.get('/charities')
      .then(({ data }) => setCharities(data.charities || []))
      .catch(() => toast.error('Failed to load charities'));
      
    // Fetch saved preference
    api.get('/me/charity-preference')
      .then(({ data }) => {
        if (data.selected && data.preference) {
          setSelectedCharityId(data.preference.charityId);
          setPercentage(data.preference.contributionPercent);
        }
      })
      .catch(() => {
        // Not a critical error, might be a new user without a sub yet
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!selectedCharityId) {
      toast.error('Please select a charity first.');
      return;
    }
    if (percentage < 10) {
      toast.error('Contribution must be at least 10%.');
      return;
    }
    
    setSaving(true);
    try {
      await api.put('/me/charity-preference', {
        charityId: selectedCharityId,
        contributionPercent: Number(percentage)
      });
      // Refresh user context to propagate changes to UI
      await fetchMe();
      toast.success('Charity preferences saved!');
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      const message = typeof errorMsg === 'object' ? 'Validation failed. Please check your inputs.' : (errorMsg || 'Failed to save preferences.');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">My Charity</h1>
        <p className="text-slate-600">
          Choose the charity you want to support. A minimum of 10% of your subscription goes directly to them. 
          You can increase this percentage if you'd like to give more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">1. Select a Charity</h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {charities.map(charity => {
                const isSelected = selectedCharityId === charity._id;
                return (
                  <div 
                    key={charity._id}
                    onClick={() => setSelectedCharityId(charity._id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center text-2xl">
                      {charity.images?.[0] ? (
                        <img src={charity.images[0]} alt={charity.name} className="w-full h-full object-cover" />
                      ) : '🏌️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold truncate ${isSelected ? 'text-primary-700' : 'text-slate-900'}`}>
                          {charity.name}
                        </h4>
                        {isSelected && (
                          <div className="shrink-0 text-white bg-primary-500 p-1 rounded-full text-xs">
                            <FiCheck />
                          </div>
                        )}
                      </div>
                      <p className={`text-xs line-clamp-2 ${isSelected ? 'text-primary-600' : 'text-slate-500'}`}>
                        {charity.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">2. Set Contribution Level</h3>
            <p className="text-sm text-slate-500 mb-6">Drag the slider to choose what percentage of your subscription goes to charity.</p>
            
            <div className="px-2">
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={percentage} 
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              
              <div className="flex justify-between items-center mt-3 text-sm font-medium text-slate-500">
                <span>10% (Min)</span>
                <span>50%</span>
                <span>100% (Max)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24 border-primary-100 bg-gradient-to-b from-white to-primary-50/30">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mx-auto mb-4">
              <FiHeart />
            </div>
            <h3 className="font-bold text-lg text-slate-900 text-center mb-6">Donation Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Selected Charity</span>
                <span className="font-semibold text-slate-900 text-right max-w-[150px] truncate">
                  {selectedCharityId ? charities.find(c => c._id === selectedCharityId)?.name : 'None selected'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Contribution</span>
                <span className="font-heading font-extrabold text-2xl text-primary-600">{percentage}%</span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 text-center mt-4">
                You can change your charity and contribution amount at any time. Changes apply to future billing cycles.
              </div>
            </div>

            <button 
              onClick={handleSave} 
              disabled={saving || !selectedCharityId}
              className="btn btn-primary w-full mt-6 py-3"
            >
              {saving ? <span className="spinner w-5 h-5 border-[3px]"></span> : <><FiSave /> Save Preferences</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
