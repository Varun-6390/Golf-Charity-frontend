import { useState, useEffect } from 'react';
import { FiPlay, FiUploadCloud, FiAward, FiAlertTriangle } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminDraws() {
  const [currentDraw, setCurrentDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const toast = useToast();
  // Format YYYY-MM
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const fetchDraw = async () => {
    try {
      // Use admin-specific endpoint that returns draws in any status
      const { data } = await api.get(`/admin/draws/${currentMonthKey}`);
      setCurrentDraw(data);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to load current draw data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraw();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    
    try {
      const { data } = await api.post(`/admin/draws/${currentMonthKey}/simulate`, {
            logicType: "random"});
      setCurrentDraw(data);
      toast.success('Draw simulated successfully');
    } catch (err) {
      toast.error(typeof err.response?.data?.error === 'object' ? 'Validation failed' : (err.response?.data?.error || 'Failed to simulate draw'));
    } finally {
      setSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm("Are you sure? This will lock the draw and send emails to all winners.")) return;
    
    setPublishing(true);
    try {
      const { data } = await api.post(`/admin/draws/${currentMonthKey}/publish`);
      setCurrentDraw(data);
      toast.success('Draw published successfully! Emails are being sent.');
    } catch (err) {
      toast.error(typeof err.response?.data?.error === 'object' ? 'Validation failed' : (err.response?.data?.error || 'Failed to publish draw'));
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  const isPublished = currentDraw?.status === 'published';
  const hasNumbers = currentDraw?.drawNumbers?.length > 0;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Draw Management</h1>
        <p className="text-slate-600">Simulate and publish the monthly prize draw. Current cycle: <strong className="text-slate-900">{currentMonthKey}</strong></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Controls Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-8 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FiAward className="text-primary-500" /> Draw Control Panel
            </h2>

            {/* Status Display */}
            <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status:</div>
              {isPublished ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded flex items-center gap-2 text-sm uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Published & Locked
                </span>
              ) : hasNumbers ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded flex items-center gap-2 text-sm uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Simulated (Draft)
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-200 text-slate-600 font-bold rounded text-sm uppercase tracking-wide">
                  Pending Simulation
                </span>
              )}
            </div>

            {/* Winning Numbers Preview */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Winning Numbers</h3>
              {hasNumbers ? (
                <div className="flex gap-3 flex-wrap">
                  {currentDraw.drawNumbers.map((num, idx) => (
                    <div key={idx} className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-heading font-extrabold shadow-sm ${
                      isPublished ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-800 border-2 border-slate-300'
                    }`}>
                      {num}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 italic text-sm">No numbers generated yet. Run a simulation.</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
              <button 
                onClick={handleSimulate}
                disabled={simulating || isPublished}
                className="flex-1 btn bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {simulating ? <span className="spinner w-5 h-5 border-2"></span> : <><FiPlay /> Simulate Algorithm Draw</>}
              </button>
              
              <button 
                onClick={handlePublish}
                disabled={publishing || isPublished || !hasNumbers}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {publishing ? <span className="spinner w-5 h-5 border-2"></span> : <><FiUploadCloud /> Publish Results</>}
              </button>
            </div>
            
            {!isPublished && hasNumbers && (
               <p className="mt-3 text-xs text-amber-600 font-medium">
                 <FiAlertTriangle className="inline mr-1" /> Re-simulating will overwrite current numbers.
               </p>
            )}
          </div>
        </div>

        {/* Stats & Info Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Estimated Prize Pool</h3>
            
            {hasNumbers && currentDraw.tierTotalsCents ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Total Pool</span>
                  <span className="font-bold text-slate-900 text-lg">£{((currentDraw.prizePoolCents || 0) / 100).toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">Match 5</span>
                      {currentDraw.eligibilityCounts && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {currentDraw.eligibilityCounts.tier5} Winners
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-900">£{((currentDraw.tierTotalsCents.tier5 || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">Match 4</span>
                      {currentDraw.eligibilityCounts && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {currentDraw.eligibilityCounts.tier4} Winners
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-900">£{((currentDraw.tierTotalsCents.tier4 || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">Match 3</span>
                      {currentDraw.eligibilityCounts && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {currentDraw.eligibilityCounts.tier3} Winners
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-900">£{((currentDraw.tierTotalsCents.tier3 || 0) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">Run a simulation to calculate pools based on active subscriptions.</div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
            <h4 className="font-bold mb-2">How it works</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>Simulate:</strong> Uses an algorithmic draw biased towards frequently submitted scores by users. Generates numbers and calculates pools.</li>
              <li><strong>Publish:</strong> Locking the draw makes it visible to users on their dashboard and dispatches notifications.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
