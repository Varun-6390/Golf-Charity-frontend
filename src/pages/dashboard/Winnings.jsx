import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheckCircle, FiClock, FiFileText, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function WinnerProof() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const toast = useToast();
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    api.get(`/winners/me?drawId=${currentMonthKey}`)
      .then(({ data }) => setEligibility(data))
      .catch(() => {}) // We can ignore 404s if user isn't a winner
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // 1. Get signature from backend
      const { data: sigData } = await api.post('/uploads/signature');
      
      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder || 'winner-proofs');
      formData.append('upload_preset', sigData.uploadPreset);
      
      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
      
      const uploadRes = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const proofImageUrl = uploadRes.data.secure_url;
      
      // 3. Submit Winner Claim
      await api.post('/winners/submit', {
        drawId: currentMonthKey,
        matchCount: eligibility?.matchCount || 3, // Safe fallback
        proof: { url: proofImageUrl }
      });
      
      toast.success('Proof submitted! We will review it shortly.');
      
      // Refresh status
      const { data } = await api.get(`/winners/me?drawId=${currentMonthKey}`);
      setEligibility(data);

    } catch (err) {
      console.error(err);
      toast.error('Failed to upload and submit proof.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="py-12 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  // If user has not won in the current draw
  if (!eligibility || eligibility.matchCount < 3) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">My Winnings</h1>
        <div className="card text-center py-16 bg-slate-50 border-dashed mt-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto shadow-sm mb-4">
            <FiAlertCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No winnings to claim</h3>
          <p className="text-slate-500">You do not have any eligible winning matches for the current draw.</p>
        </div>
      </div>
    );
  }

  const submissionStatus = eligibility.submission?.adminDecision;
  const payoutStatus = eligibility.payout?.status;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Claim Your Winnings</h1>
        <p className="text-slate-600">
          Congratulations! You matched {eligibility.matchCount} numbers in the {currentMonthKey} draw. 
          Please upload a photo of your scorecard to verify your entry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Tracker */}
        <div className="md:col-span-1">
          <div className="card p-6 bg-slate-900 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Claim Status</h3>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="mt-0.5 text-accent-400"><FiCheckCircle /></div>
                <div>
                  <div className="font-semibold text-sm">Draw Matched</div>
                  <div className="text-xs text-slate-400 mt-1">{eligibility.matchCount} numbers matched</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className={`mt-0.5 ${submissionStatus === 'approved' ? 'text-primary-400' : submissionStatus === 'pending' ? 'text-amber-400' : 'text-slate-500'}`}>
                  {submissionStatus === 'approved' ? <FiCheckCircle /> : submissionStatus === 'pending' ? <FiClock /> : <FiFileText />}
                </div>
                <div>
                  <div className="font-semibold text-sm">Proof Verified</div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">{submissionStatus || 'Not Submitted'}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className={`mt-0.5 ${payoutStatus === 'paid' ? 'text-primary-400' : 'text-slate-500'}`}>
                  {payoutStatus === 'paid' ? <FiCheckCircle /> : <FiClock />}
                </div>
                <div>
                  <div className="font-semibold text-sm">Payout Sent</div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">{payoutStatus || (submissionStatus === 'approved' ? 'Processing' : 'Awaiting verification')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="md:col-span-2">
          <div className="card p-8 text-center border-dashed border-2">
            {submissionStatus ? (
              <div className="py-8">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mx-auto mb-4">
                  {submissionStatus === 'approved' ? <FiCheckCircle /> : <FiClock />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Proof Submitted</h3>
                <p className="text-slate-600">
                  {submissionStatus === 'approved' 
                    ? "Your proof has been approved! We are processing your payout."
                    : "Your proof is currently under review by our team. Check back soon."}
                </p>
                {eligibility.submission?.proof?.url && (
                  <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden max-w-xs mx-auto">
                    <img src={eligibility.submission.proof.url} alt="Submitted Proof" className="w-full h-auto" />
                  </div>
                )}
              </div>
            ) : (
               <div className="py-4">
                 <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
                   <FiUpload />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Scorecard</h3>
                 <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                   Please provide a clear image of your official scorecard confirming the scores entered into our system.
                 </p>
                 
                 <input 
                   type="file" 
                   id="proof-upload" 
                   accept="image/*" 
                   className="hidden" 
                   onChange={handleFileChange}
                 />
                 
                 {file ? (
                   <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block text-sm text-slate-700 font-medium">
                     {file.name}
                   </div>
                 ) : (
                   <label htmlFor="proof-upload" className="btn btn-outline mx-auto cursor-pointer mb-6">
                     Choose File
                   </label>
                 )}
                 
                 <div className="block">
                   <button 
                     onClick={handleUploadAndSubmit} 
                     disabled={!file || uploading}
                     className="btn btn-primary w-full max-w-xs"
                   >
                     {uploading ? <span className="spinner w-5 h-5 border-[3px]"></span> : 'Submit Claim'}
                   </button>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
