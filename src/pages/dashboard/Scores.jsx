import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiClock, FiAlertCircle, FiInfo } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [stableford, setStableford] = useState('');
  
  const toast = useToast();

  const fetchScores = async () => {
    try {
      const { data } = await api.get('/me/scores');
      setScores(data.scores || []);
    } catch (err) {
      toast.error('Failed to load scores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stableford || stableford < 1 || stableford > 45) {
      toast.error('Please enter a valid Stableford score (1-45).');
      return;
    }
    
    setSubmitLoading(true);
    try {
      await api.post('/me/scores', {
        scoreDate: date,
        stableford: parseInt(stableford, 10)
      });
      fetchScores();
      setStableford('');
      toast.success('Score added successfully.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add score.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this score?')) return;
    try {
      await api.delete(`/me/scores/${id}`);
      fetchScores();
      toast.success('Score deleted.');
    } catch (err) {
      toast.error('Failed to delete score.');
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">My Scores</h1>
        <p className="text-slate-600">Enter your Stableford scores (1-45). We keep your latest 5 scores on a rolling basis, which will be used as your numbers for the monthly prize draw.</p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-8">
        <FiInfo className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <span className="font-bold">Rolling 5 System:</span> You can enter as many scores as you like. The system automatically keeps only your 5 most recently dated scores. When you add a new score, the oldest one is replaced!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Form Column */}
        <div className="md:col-span-2">
          <div className="card p-6 bg-slate-50 border-slate-200 shadow-none">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Add New Score</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider text-slate-500" htmlFor="score-date">Date Played</label>
                <input
                  id="score-date"
                  type="date"
                  className="form-input"
                  value={date}
                  max={new Date().toISOString().split('T')[0]} // Cannot be future date
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs uppercase tracking-wider text-slate-500" htmlFor="score-val">Stableford Score</label>
                <input
                  id="score-val"
                  type="number"
                  min="1"
                  max="45"
                  className="form-input text-lg font-bold"
                  placeholder="e.g. 36"
                  value={stableford}
                  onChange={(e) => setStableford(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2" disabled={submitLoading}>
                {submitLoading ? <span className="spinner w-5 h-5 border-2"></span> : <><FiPlus /> Add Score</>}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="md:col-span-3">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center justify-between">
            Active Scores
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {scores.length} / 5
            </span>
          </h3>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {scores.length > 0 ? (
                scores.map((score, idx) => (
                  <motion.div
                    key={score.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 font-heading font-extrabold text-xl flex items-center justify-center">
                        {score.stableford}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Score #{idx + 1}</div>
                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <FiClock className="text-slate-400" />
                          {new Date(score.scoreDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(score.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete score"
                    >
                      <FiTrash2 />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 px-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                  <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-3">
                    <FiAlertCircle size={20} />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">No active scores yet</h4>
                  <p className="text-sm text-slate-500">Add your first Stableford score using the form.</p>
                </div>
              )}
            </AnimatePresence>
            
            {scores.length === 5 && (
              <p className="text-xs text-center text-slate-500 mt-4 px-4">
                You have the maximum 5 scores. Adding a new score will replace the oldest one.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
